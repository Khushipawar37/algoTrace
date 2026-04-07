import { NextResponse } from "next/server";
import { z } from "zod";

import { saveReport } from "@/lib/storage";
import type { SessionReport } from "@/lib/types";

const schema = z.object({
  sessionId: z.string(),
  weakness: z.record(z.string(), z.number()),
});

export async function POST(request: Request) {
  const body = schema.parse(await request.json());
  const top = Object.entries(body.weakness).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "optimizationThinking";

  const report: SessionReport = {
    summary:
      "You demonstrated steady progress and stayed engaged, with strongest gains once you switched to a structured approach.",
    strengths: ["Persistence under uncertainty", "Willingness to iterate", "Good decomposition on second attempt"],
    weaknesses: ["Edge-case anticipation", "Optimization timing", "Late strategy commitment"],
    evidence: ["Multiple pause bursts before final loop", "Hint dependency reached level 2", "Run attempts increased early"],
    topPriorityArea: top,
    improvementPlan: [
      "Before coding, write two edge cases and one complexity target.",
      "Practice one medium sliding-window problem daily for 5 sessions.",
      "After each failed run, state one hypothesis before editing code.",
    ],
    nextProblemSuggestion: "Longest Subarray with Sum K",
  };

  saveReport(body.sessionId, report);
  return NextResponse.json({ report });
}

