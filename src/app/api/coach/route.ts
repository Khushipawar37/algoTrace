import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  message: z.string(),
  code: z.string(),
  hintLevel: z.number(),
  problemTitle: z.string(),
  weakness: z.object({
    approachFinding: z.number(),
    edgeCaseDetection: z.number(),
    logicalErrors: z.number(),
    optimizationThinking: z.number(),
    dataStructureSelection: z.number(),
    syntaxLanguageGaps: z.number(),
    timeManagement: z.number(),
  }),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());

  const strongestWeakness = Object.entries(body.weakness).sort((a, b) => b[1] - a[1])[0]?.[0];
  const edgePrompt =
    strongestWeakness === "edgeCaseDetection"
      ? "What happens for empty input or repeated values?"
      : "Can you articulate your invariant for each iteration?";

  const replies = [
    `Let's zoom in on ${body.problemTitle}. Before coding more, what exact approach are you committing to?`,
    `Good direction. ${edgePrompt}`,
    body.hintLevel > 1
      ? "You are close. Try validating one small example manually before changing your full solution."
      : "What is one smaller subproblem you can solve first to reduce uncertainty?",
  ];

  const reply = replies[Math.min(2, body.hintLevel)];

  return NextResponse.json({ reply });
}

