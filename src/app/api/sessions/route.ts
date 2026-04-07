import { NextResponse } from "next/server";
import { z } from "zod";

import { appendEvents, listSessions, upsertSession } from "@/lib/storage";

const createSchema = z.object({
  id: z.string(),
  userId: z.string(),
  problemId: z.string(),
  language: z.string(),
  startedAt: z.number(),
});

const eventSchema = z.object({
  sessionId: z.string(),
  events: z.array(
    z.object({
      sessionId: z.string(),
      userId: z.string(),
      type: z.enum([
        "start_coding",
        "long_pause",
        "delete_heavy",
        "approach_change",
        "hint_requested",
        "run_attempt",
        "language_switch",
      ]),
      timestamp: z.number(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }),
  ),
});

export async function GET() {
  return NextResponse.json({ sessions: listSessions() });
}

export async function POST(request: Request) {
  const body = await request.json();
  if ("events" in body) {
    const parsed = eventSchema.parse(body);
    const events = appendEvents(parsed.sessionId, parsed.events);
    return NextResponse.json({ events });
  }
  const parsed = createSchema.parse(body);
  const session = upsertSession(parsed);
  return NextResponse.json({ session });
}
