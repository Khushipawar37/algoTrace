import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth/server-user";
import { MAX_HISTORY_MESSAGES, MAX_TUTOR_CODE_LENGTH, MAX_TUTOR_MESSAGE_LENGTH } from "@/lib/tutor/constants";
import { resolveStudentHelpIntent } from "@/lib/tutor/intent";
import { determineNextHintLevel } from "@/lib/tutor/policy";
import { generateTutorResponse } from "@/lib/tutor/tutor-service";
import { analyzeStudentAttempt } from "@/lib/tutor/analyzer/analyzer";
import { summarizeAttemptAnalysis } from "@/lib/tutor/analyzer/context";
import { diagnoseExecutionWithFallback } from "@/lib/tutor/diagnosis/diagnosis-service";
import { summarizeExecutionDiagnosis } from "@/lib/tutor/diagnosis/context";
import { hashStudentCode } from "@/lib/tutor/diagnosis/hash";
import { discardStaleExecution, normalizeExecutionResult } from "@/lib/tutor/diagnosis/normalize";
import { loadRecentExecution } from "@/lib/tutor/diagnosis/store";
import type { ExecutionContext } from "@/lib/tutor/diagnosis/types";
import type { TutorHintLevel, TutorSessionState } from "@/lib/tutor/types";
import { decideTutorAction } from "@/lib/tutor/decision/engine";
import { summarizeTutorDecision } from "@/lib/tutor/decision/context";
import type { TutorAction } from "@/lib/tutor/decision/types";

const schema = z.object({ problemId: z.string().min(1).max(100), message: z.string().trim().min(1).max(MAX_TUTOR_MESSAGE_LENGTH), code: z.string().max(MAX_TUTOR_CODE_LENGTH).optional(), language: z.enum(["cpp", "javascript", "python", "java"]).default("cpp"), sessionId: z.string().min(1).max(100).optional(), executionRef: z.string().uuid().optional() });
const apiError = (message: string, status: number, code: string) => NextResponse.json({ error: { message, code } }, { status });
type ConversationRow = { id: string; currentHintLevel: number; lastHintLevel: number | null; hintsGiven: number; studentAskedForMoreHelp: boolean; lastTutorAction: string | null; lastDecisionFocus: string | null };
type MessageRow = { role: "USER" | "TUTOR"; content: string };

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return apiError("Authentication required.", 401, "UNAUTHORIZED");
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return apiError("Invalid tutor request.", 400, "INVALID_REQUEST");
    const problem = await db.problem.findFirst({ where: { OR: [{ id: parsed.data.problemId }, { slug: parsed.data.problemId }], isPublished: true }, select: { id: true, slug: true, title: true, description: true, constraints: true, guidanceHints: true, expectedTimeComplexity: true, expectedSpaceComplexity: true, canonicalPatterns: true, commonMistakes: true, topics: { select: { topic: { select: { name: true } } } }, examples: { orderBy: { orderIndex: "asc" }, take: 3, select: { input: true, output: true } }, templates: { where: { language: parsed.data.language }, take: 1, select: { starterCode: true } } } });
    if (!problem) return apiError("Problem not found.", 404, "PROBLEM_NOT_FOUND");

    let rows = parsed.data.sessionId ? await db.$queryRaw<ConversationRow[]>`SELECT "id", "currentHintLevel", "lastHintLevel", "hintsGiven", "studentAskedForMoreHelp", "lastTutorAction", "lastDecisionFocus" FROM "TutorConversation" WHERE "id" = ${parsed.data.sessionId} AND "userId" = ${user.id} AND "problemId" = ${problem.id} LIMIT 1` : [];
    if (parsed.data.sessionId && !rows.length) return apiError("Tutor session is invalid.", 404, "INVALID_SESSION");
    if (!rows.length) {
      const id = randomUUID();
      rows = await db.$queryRaw<ConversationRow[]>`INSERT INTO "TutorConversation" ("id", "userId", "problemId", "updatedAt") VALUES (${id}, ${user.id}, ${problem.id}, NOW()) RETURNING "id", "currentHintLevel", "lastHintLevel", "hintsGiven", "studentAskedForMoreHelp", "lastTutorAction", "lastDecisionFocus"`;
    }
    const session = rows[0];
    const historyRows = await db.$queryRaw<MessageRow[]>`SELECT "role", "content" FROM "TutorMessage" WHERE "conversationId" = ${session.id} ORDER BY "createdAt" DESC LIMIT ${MAX_HISTORY_MESSAGES}`;
    const intent = resolveStudentHelpIntent(parsed.data.message);
    const attemptAnalysis = await analyzeStudentAttempt({ language: parsed.data.language, code: parsed.data.code ?? "", starterCode: problem.templates[0]?.starterCode, problem: { title: problem.title, statement: problem.description, constraints: problem.constraints, examples: problem.examples, topics: problem.topics.map(({ topic }) => topic.name), expectedTimeComplexity: problem.expectedTimeComplexity ?? undefined, expectedSpaceComplexity: problem.expectedSpaceComplexity ?? undefined, canonicalPatterns: problem.canonicalPatterns, commonMistakes: problem.commonMistakes } });
    if (process.env.NODE_ENV === "development") console.info("Tutor analysis", { problem: problem.slug, state: attemptAnalysis.attemptState, approach: attemptAnalysis.approachDetected, issues: attemptAnalysis.issues.length, confidence: attemptAnalysis.confidence });
    const currentCodeHash = parsed.data.code ? hashStudentCode(parsed.data.code) : undefined;
    let execution: ExecutionContext | undefined = loadRecentExecution(parsed.data.executionRef, user.id, problem.id);
    if (!execution && parsed.data.code) {
      const latest = await db.submission.findFirst({ where: { userId: user.id, problemId: problem.id, language: parsed.data.language, sourceCode: parsed.data.code }, orderBy: { createdAt: "desc" }, select: { status: true, diagnostic: true, runtimeMs: true, memoryKb: true, passedCases: true, totalCases: true } });
      if (latest) execution = normalizeExecutionResult({ source: "SUBMIT", verdict: latest.status, diagnostic: latest.diagnostic ?? undefined, runtimeMs: latest.runtimeMs ?? undefined, memoryKb: latest.memoryKb ?? undefined, passedCases: latest.passedCases, totalCases: latest.totalCases, codeHash: currentCodeHash });
    }
    execution = discardStaleExecution(execution ?? normalizeExecutionResult(), currentCodeHash);
    const executionDiagnosis = await diagnoseExecutionWithFallback({ execution, attemptAnalysis, problem: { title: problem.title, description: problem.description, constraints: problem.constraints }, language: parsed.data.language, code: parsed.data.code ?? "" });
    if (process.env.NODE_ENV === "development") console.info("Tutor diagnosis", { problem: problem.slug, source: execution.source, outcome: executionDiagnosis.outcome, category: executionDiagnosis.primaryCategory, confidence: executionDiagnosis.confidence });
    const state: TutorSessionState = { id: session.id, userId: user.id, problemId: problem.id, currentHintLevel: session.currentHintLevel as TutorHintLevel, hintsGiven: session.hintsGiven, lastHintLevel: session.lastHintLevel as TutorHintLevel | undefined, studentAskedForMoreHelp: session.studentAskedForMoreHelp, fullSolutionUnlocked: false };
    const hintLevel = determineNextHintLevel(state, intent);
    const guidanceHints = Array.isArray(problem.guidanceHints) ? problem.guidanceHints.filter((value): value is string => typeof value === "string") : [];
    const decision = decideTutorAction({ studentIntent: intent, hintLevel, attemptAnalysis, executionDiagnosis, session: { previousAction: session.lastTutorAction as TutorAction | undefined, lastDecisionFocus: session.lastDecisionFocus ?? undefined, previousHintLevel: session.lastHintLevel as TutorHintLevel | undefined, studentAskedForMoreHelp: session.studentAskedForMoreHelp } });
    const result = await generateTutorResponse({ message: parsed.data.message, code: parsed.data.code, hintLevel, intent, attemptAnalysis: summarizeAttemptAnalysis(attemptAnalysis), executionDiagnosis: summarizeExecutionDiagnosis(executionDiagnosis), tutorDecision: summarizeTutorDecision(decision), history: historyRows.reverse().map((item) => ({ role: item.role === "USER" ? "user" : "model", content: item.content })), problem: { id: problem.id, title: problem.title, description: problem.description, constraints: problem.constraints, topics: problem.topics.map(({ topic }) => topic.name), guidanceHints } });
    await db.$transaction([
      db.$executeRaw`INSERT INTO "TutorMessage" ("id", "conversationId", "role", "content", "hintLevel", "codeIncluded") VALUES (${randomUUID()}, ${session.id}, CAST('USER' AS "TutorMessageRole"), ${parsed.data.message}, ${hintLevel}, ${Boolean(parsed.data.code)}), (${randomUUID()}, ${session.id}, CAST('TUTOR' AS "TutorMessageRole"), ${result.message}, ${hintLevel}, false)`,
      db.$executeRaw`UPDATE "TutorConversation" SET "lastHintLevel" = "currentHintLevel", "currentHintLevel" = ${hintLevel}, "hintsGiven" = "hintsGiven" + 1, "studentAskedForMoreHelp" = ${intent === "MORE_HELP"}, "lastTutorAction" = ${decision.action}, "lastDecisionFocus" = ${decision.focus ?? null}, "updatedAt" = NOW() WHERE "id" = ${session.id}`,
    ]);
    return NextResponse.json({ message: result.message, hintLevel, intent, sessionId: session.id, nextSuggestedAction: intent === "REQUEST_FULL_SOLUTION" ? "Ask for an approach or pseudocode first." : "Try the next step, then share what changed." });
  } catch (cause) {
    console.error("Tutor API error", cause instanceof Error ? cause.message : "unknown error");
    return apiError("The tutor couldn't respond right now. Your code and progress are safe — try again.", 500, "TUTOR_UNAVAILABLE");
  }
}
