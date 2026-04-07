import { NextResponse } from "next/server";
import { z } from "zod";

import { inferWeakness } from "@/lib/ml-client";
import { saveWeakness, upsertSession } from "@/lib/storage";

const requestSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  problemId: z.string(),
  language: z.string(),
  features: z.object({
    time_to_first_char: z.number(),
    pause_frequency: z.number(),
    delete_ratio: z.number(),
    approach_pivots: z.number(),
    hint_dependency_rate: z.number(),
    run_attempt_count: z.number(),
    time_per_complexity_tier: z.number(),
    error_pattern_clusters: z.number(),
    brute_force_persistence: z.number(),
    line_edit_churn: z.number(),
  }),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.parse(body);
  const weakness = await inferWeakness(parsed.features);

  upsertSession({
    id: parsed.sessionId,
    userId: parsed.userId,
    problemId: parsed.problemId,
    language: parsed.language,
    startedAt: Date.now(),
  });
  saveWeakness(parsed.sessionId, weakness);

  return NextResponse.json({ weakness });
}

