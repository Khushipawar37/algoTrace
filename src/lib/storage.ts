import type { BehavioralEvent, SessionReport, WeaknessVector } from "@/lib/types";

interface SessionRow {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  startedAt: number;
  weakness?: WeaknessVector;
  report?: SessionReport;
}

const sessionStore = new Map<string, SessionRow>();
const eventStore = new Map<string, BehavioralEvent[]>();

export function upsertSession(row: SessionRow) {
  sessionStore.set(row.id, row);
  if (!eventStore.has(row.id)) {
    eventStore.set(row.id, []);
  }
  return row;
}

export function appendEvents(sessionId: string, events: BehavioralEvent[]) {
  const existing = eventStore.get(sessionId) ?? [];
  eventStore.set(sessionId, [...existing, ...events]);
  return eventStore.get(sessionId) ?? [];
}

export function saveWeakness(sessionId: string, weakness: WeaknessVector) {
  const row = sessionStore.get(sessionId);
  if (!row) return null;
  const updated = { ...row, weakness };
  sessionStore.set(sessionId, updated);
  return updated;
}

export function saveReport(sessionId: string, report: SessionReport) {
  const row = sessionStore.get(sessionId);
  if (!row) return null;
  const updated = { ...row, report };
  sessionStore.set(sessionId, updated);
  return updated;
}

export function getSessionWithEvents(sessionId: string) {
  return {
    session: sessionStore.get(sessionId) ?? null,
    events: eventStore.get(sessionId) ?? [],
  };
}

export function listSessions() {
  return Array.from(sessionStore.values());
}

