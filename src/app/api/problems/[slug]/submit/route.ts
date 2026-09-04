import { z } from "zod";
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; import { apiError } from "@/lib/api"; import { getAuthenticatedUser } from "@/lib/auth/server-user"; import { checkRateLimit } from "@/lib/rate-limit"; import { judgeSubmission } from "@/lib/judge/submission-judge";
import { hashStudentCode } from "@/lib/tutor/diagnosis/hash";
import { normalizeExecutionResult } from "@/lib/tutor/diagnosis/normalize";
import { saveRecentExecution } from "@/lib/tutor/diagnosis/store";
const schema = z.object({ language: z.literal("cpp"), code: z.string().trim().min(1).max(100000) });
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getAuthenticatedUser(); if (!user) return apiError("Authentication required.", 401, "UNAUTHORIZED"); if (!checkRateLimit(`submit:${user.id}`, 8)) return apiError("Submission limit reached. Try again shortly.", 429, "RATE_LIMITED");
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return apiError("Invalid submission.", 422, "VALIDATION_ERROR");
  const p = await db.problem.findFirst({ where: { slug: (await params).slug, isPublished: true }, select: { id: true, timeLimitMs: true, memoryLimitMb: true, outputComparison: true, templates: { where: { language: "cpp" }, take: 1, select: { driverCode: true } }, testCases: { where: { isHidden: true }, orderBy: { orderIndex: "asc" }, select: { input: true, expectedOutput: true } } } });
  if (!p) return apiError("Problem not found.", 404, "NOT_FOUND"); if (!p.templates[0] || !p.testCases.length) return apiError("Problem judge is not configured.", 409, "JUDGE_NOT_CONFIGURED");
  const pending = await db.submission.create({ data: { userId: user.id, problemId: p.id, language: "cpp", sourceCode: parsed.data.code, totalCases: p.testCases.length } });
  const result = await judgeSubmission({ driverCode: p.templates[0].driverCode, code: parsed.data.code, testCases: p.testCases, comparison: p.outputComparison, timeLimitMs: p.timeLimitMs, memoryLimitMb: p.memoryLimitMb }); const now = new Date();
  await db.$transaction([db.submission.update({ where: { id: pending.id }, data: { status: result.verdict, runtimeMs: result.runtimeMs, memoryKb: result.memoryKb, passedCases: result.passedCases, totalCases: result.totalCases, failedTestIndex: result.failedTestIndex, diagnostic: result.diagnostic } }), db.userProblemProgress.upsert({ where: { userId_problemId: { userId: user.id, problemId: p.id } }, create: { userId: user.id, problemId: p.id, attempts: 1, lastAttemptAt: now, status: result.verdict === "ACCEPTED" ? "INDEPENDENT" : "UNATTEMPTED", solvedAt: result.verdict === "ACCEPTED" ? now : null }, update: { attempts: { increment: 1 }, lastAttemptAt: now, ...(result.verdict === "ACCEPTED" ? { status: "INDEPENDENT" as const, solvedAt: now } : {}) } })]);
  const executionRef = saveRecentExecution(user.id, p.id, normalizeExecutionResult({ source: "SUBMIT", verdict: result.verdict, diagnostic: result.diagnostic, runtimeMs: result.runtimeMs, memoryKb: result.memoryKb, passedCases: result.passedCases, totalCases: result.totalCases, codeHash: hashStudentCode(parsed.data.code) }));
  return NextResponse.json({ submissionId: pending.id, ...result, executionRef });
}
