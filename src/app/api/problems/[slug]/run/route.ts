import { z } from "zod";
import { NextResponse } from "next/server";
import { db } from "@/lib/db"; import { apiError } from "@/lib/api"; import { getAuthenticatedUser } from "@/lib/auth/server-user"; import { checkRateLimit } from "@/lib/rate-limit"; import { getCodeExecutor } from "@/lib/execution/executor";
import { hashStudentCode } from "@/lib/tutor/diagnosis/hash";
import { normalizeExecutionResult } from "@/lib/tutor/diagnosis/normalize";
import { saveRecentExecution } from "@/lib/tutor/diagnosis/store";
const schema = z.object({ language: z.literal("cpp"), code: z.string().trim().min(1).max(100000), input: z.string().max(100000) });
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getAuthenticatedUser(); if (!user) return apiError("Authentication required.", 401, "UNAUTHORIZED"); if (!checkRateLimit(`run:${user.id}`, 20)) return apiError("Run limit reached. Try again shortly.", 429, "RATE_LIMITED");
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return apiError("Invalid run request.", 422, "VALIDATION_ERROR");
  const problem = await db.problem.findFirst({ where: { slug: (await params).slug, isPublished: true }, select: { id: true, timeLimitMs: true, memoryLimitMb: true, templates: { where: { language: "cpp" }, take: 1, select: { driverCode: true } } } });
  if (!problem) return apiError("Problem not found.", 404, "NOT_FOUND"); const template = problem.templates[0]; if (!template) return apiError("C++ template not found.", 409, "TEMPLATE_NOT_FOUND");
  const result = await getCodeExecutor().execute({ language: "cpp", sourceCode: template.driverCode.replace("// USER_CODE", parsed.data.code), stdin: parsed.data.input, timeoutMs: problem.timeLimitMs, memoryLimitMb: problem.memoryLimitMb });
  const executionRef = saveRecentExecution(user.id, problem.id, normalizeExecutionResult({ source: "RUN", ...result, codeHash: hashStudentCode(parsed.data.code) }));
  return NextResponse.json({ ...result, executionRef });
}
