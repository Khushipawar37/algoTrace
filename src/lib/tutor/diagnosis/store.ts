import { randomUUID } from "node:crypto";
import type { ExecutionContext } from "./types";
type Stored = { userId: string; problemId: string; execution: ExecutionContext; expiresAt: number };
const globalStore = globalThis as unknown as { phase3ExecutionStore?: Map<string, Stored> };
const store = globalStore.phase3ExecutionStore ??= new Map<string, Stored>();
export function saveRecentExecution(userId: string, problemId: string, execution: ExecutionContext): string { const id = randomUUID(); store.set(id, { userId, problemId, execution, expiresAt: Date.now() + 30 * 60_000 }); return id; }
export function loadRecentExecution(id: string | undefined, userId: string, problemId: string): ExecutionContext | undefined { if (!id) return; const item = store.get(id); if (!item || item.expiresAt < Date.now() || item.userId !== userId || item.problemId !== problemId) return; return item.execution; }
