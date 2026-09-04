import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth/server-user";
import { MAX_HISTORY_MESSAGES, MAX_TUTOR_CODE_LENGTH, MAX_TUTOR_MESSAGE_LENGTH } from "@/lib/tutor/constants";
import { resolveStudentHelpIntent } from "@/lib/tutor/intent";
import { determineNextHintLevel } from "@/lib/tutor/policy";
import { generateTutorResponse } from "@/lib/tutor/tutor-service";
import type { TutorHintLevel, TutorSessionState } from "@/lib/tutor/types";

const schema = z.object({ problemId: z.string().min(1).max(100), message: z.string().trim().min(1).max(MAX_TUTOR_MESSAGE_LENGTH), code: z.string().max(MAX_TUTOR_CODE_LENGTH).optional(), sessionId: z.string().min(1).max(100).optional() });
const apiError = (message: string, status: number, code: string) => NextResponse.json({ error: { message, code } }, { status });
type ConversationRow = { id: string; currentHintLevel: number; lastHintLevel: number | null; hintsGiven: number; studentAskedForMoreHelp: boolean };
type MessageRow = { role: "USER" | "TUTOR"; content: string };

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return apiError("Authentication required.", 401, "UNAUTHORIZED");
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return apiError("Invalid tutor request.", 400, "INVALID_REQUEST");
    const problem = await db.problem.findFirst({ where: { OR: [{ id: parsed.data.problemId }, { slug: parsed.data.problemId }], isPublished: true }, select: { id: true, title: true, description: true, constraints: true, guidanceHints: true, topics: { select: { topic: { select: { name: true } } } } } });
    if (!problem) return apiError("Problem not found.", 404, "PROBLEM_NOT_FOUND");

    let rows = parsed.data.sessionId ? await db.$queryRaw<ConversationRow[]>`SELECT "id", "currentHintLevel", "lastHintLevel", "hintsGiven", "studentAskedForMoreHelp" FROM "TutorConversation" WHERE "id" = ${parsed.data.sessionId} AND "userId" = ${user.id} AND "problemId" = ${problem.id} LIMIT 1` : [];
    if (parsed.data.sessionId && !rows.length) return apiError("Tutor session is invalid.", 404, "INVALID_SESSION");
    if (!rows.length) {
      const id = randomUUID();
      rows = await db.$queryRaw<ConversationRow[]>`INSERT INTO "TutorConversation" ("id", "userId", "problemId", "updatedAt") VALUES (${id}, ${user.id}, ${problem.id}, NOW()) RETURNING "id", "currentHintLevel", "lastHintLevel", "hintsGiven", "studentAskedForMoreHelp"`;
    }
    const session = rows[0];
    const historyRows = await db.$queryRaw<MessageRow[]>`SELECT "role", "content" FROM "TutorMessage" WHERE "conversationId" = ${session.id} ORDER BY "createdAt" DESC LIMIT ${MAX_HISTORY_MESSAGES}`;
    const intent = resolveStudentHelpIntent(parsed.data.message);
    const state: TutorSessionState = { id: session.id, userId: user.id, problemId: problem.id, currentHintLevel: session.currentHintLevel as TutorHintLevel, hintsGiven: session.hintsGiven, lastHintLevel: session.lastHintLevel as TutorHintLevel | undefined, studentAskedForMoreHelp: session.studentAskedForMoreHelp, fullSolutionUnlocked: false };
    const hintLevel = determineNextHintLevel(state, intent);
    const guidanceHints = Array.isArray(problem.guidanceHints) ? problem.guidanceHints.filter((value): value is string => typeof value === "string") : [];
    const result = await generateTutorResponse({ message: parsed.data.message, code: parsed.data.code, hintLevel, intent, history: historyRows.reverse().map((item) => ({ role: item.role === "USER" ? "user" : "model", content: item.content })), problem: { id: problem.id, title: problem.title, description: problem.description, constraints: problem.constraints, topics: problem.topics.map(({ topic }) => topic.name), guidanceHints } });
    await db.$transaction([
      db.$executeRaw`INSERT INTO "TutorMessage" ("id", "conversationId", "role", "content", "hintLevel", "codeIncluded") VALUES (${randomUUID()}, ${session.id}, CAST('USER' AS "TutorMessageRole"), ${parsed.data.message}, ${hintLevel}, ${Boolean(parsed.data.code)}), (${randomUUID()}, ${session.id}, CAST('TUTOR' AS "TutorMessageRole"), ${result.message}, ${hintLevel}, false)`,
      db.$executeRaw`UPDATE "TutorConversation" SET "lastHintLevel" = "currentHintLevel", "currentHintLevel" = ${hintLevel}, "hintsGiven" = "hintsGiven" + 1, "studentAskedForMoreHelp" = ${intent === "MORE_HELP"}, "updatedAt" = NOW() WHERE "id" = ${session.id}`,
    ]);
    return NextResponse.json({ message: result.message, hintLevel, intent, sessionId: session.id, nextSuggestedAction: intent === "REQUEST_FULL_SOLUTION" ? "Ask for an approach or pseudocode first." : "Try the next step, then share what changed." });
  } catch (cause) {
    console.error("Tutor API error", cause instanceof Error ? cause.message : "unknown error");
    return apiError("The tutor couldn't respond right now. Your code and progress are safe — try again.", 500, "TUTOR_UNAVAILABLE");
  }
}
