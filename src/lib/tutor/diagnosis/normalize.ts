import type { ExecutionContext, ExecutionOutcome, ExecutionSource } from "./types";
type RawEvidence = { source: ExecutionSource; status?: string; verdict?: string; stdout?: string; stderr?: string; diagnostic?: string; runtimeMs?: number; memoryKb?: number; passedCases?: number; totalCases?: number; codeHash?: string; safeFailureCategories?: string[] };
const sanitizeDiagnostic = (value?: string) => value?.replace(/(?:\/[^\s:]+)+\/([^\s:]+\.(?:cpp|cc|c|h))/g, "$1").split(/\r?\n/).filter(Boolean).slice(0, 8).join("\n").slice(0, 1200);
export function normalizeExecutionResult(raw?: RawEvidence): ExecutionContext {
  if (!raw) return { source: "NONE", outcome: "NOT_RUN", failureSignals: [], safeFailureCategories: [] };
  const status = raw.verdict ?? raw.status ?? ""; const total = Math.max(0, raw.totalCases ?? 0); const passed = Math.max(0, Math.min(total, raw.passedCases ?? 0));
  let outcome: ExecutionOutcome = status === "ACCEPTED" ? "ACCEPTED" : status === "WRONG_ANSWER" ? (passed > 0 ? "PARTIALLY_CORRECT" : "WRONG_ANSWER") : status === "COMPILATION_ERROR" || status === "compile_error" ? "COMPILE_ERROR" : status === "RUNTIME_ERROR" || status === "runtime_error" || status === "MEMORY_LIMIT_EXCEEDED" || status === "memory_limit" ? "RUNTIME_ERROR" : status === "TIME_LIMIT_EXCEEDED" || status === "timeout" ? "TIME_LIMIT_EXCEEDED" : status === "success" ? "ACCEPTED" : "UNKNOWN";
  const diagnostic = sanitizeDiagnostic(raw.diagnostic ?? raw.stderr);
  const summary = total ? { total, passed, failed: total - passed } : undefined;
  return { source: raw.source, outcome, ...(outcome === "COMPILE_ERROR" ? { compileOutput: diagnostic } : { runtimeOutput: diagnostic }), stdout: raw.source === "RUN" ? raw.stdout?.slice(0, 1200) : undefined, stderr: diagnostic, executionTimeMs: raw.runtimeMs, memoryKb: raw.memoryKb, ...(raw.source === "SUBMIT" && summary ? { hiddenTests: summary } : {}), failureSignals: diagnostic ? [diagnostic] : [], safeFailureCategories: raw.safeFailureCategories?.slice(0, 8) ?? [], codeHash: raw.codeHash };
}
export function discardStaleExecution(execution: ExecutionContext, currentCodeHash?: string): ExecutionContext { return !currentCodeHash || !execution.codeHash || execution.codeHash !== currentCodeHash ? normalizeExecutionResult() : execution; }
