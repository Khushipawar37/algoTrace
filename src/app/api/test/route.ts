import { NextResponse } from "next/server";
import { z } from "zod";

import { evaluateJavascriptSolution } from "@/lib/problem-tests";

const requestSchema = z.object({
  slug: z.string(),
  language: z.enum(["javascript", "python", "cpp", "java"]),
  code: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.parse(body);

    if (parsed.language !== "javascript") {
      return NextResponse.json({
        supported: false,
        message: "Test runner currently supports JavaScript only.",
        stdout: [],
        stderr: [],
        results: [],
        summary: { total: 0, passed: 0, failed: 0 },
      });
    }

    const result = evaluateJavascriptSolution({
      code: parsed.code,
      slug: parsed.slug,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to run tests.";
    return NextResponse.json(
      {
        supported: false,
        message,
        stdout: [],
        stderr: [message],
        results: [],
        summary: { total: 0, passed: 0, failed: 0 },
      },
      { status: 200 },
    );
  }
}
