import type { StudentAttemptAnalysis } from "../analyzer/types";
export type ExecutionOutcome = "NOT_RUN" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TIME_LIMIT_EXCEEDED" | "WRONG_ANSWER" | "PARTIALLY_CORRECT" | "ACCEPTED" | "UNKNOWN";
export type DiagnosisCategory = "SYNTAX" | "TYPE_ERROR" | "COMPILATION" | "RUNTIME" | "OUT_OF_BOUNDS" | "NULL_OR_INVALID_ACCESS" | "STACK_OVERFLOW" | "DIVIDE_BY_ZERO" | "TIME_COMPLEXITY" | "INFINITE_LOOP" | "LOGIC" | "EDGE_CASE" | "DUPLICATE_HANDLING" | "BOUNDARY" | "OVERFLOW" | "STATE_MANAGEMENT" | "OUTPUT_FORMAT" | "UNKNOWN";
export type ExecutionSource = "RUN" | "SUBMIT" | "NONE";
export interface TestSummary { total: number; passed: number; failed: number }
export interface ExecutionContext { source: ExecutionSource; outcome: ExecutionOutcome; compileOutput?: string; runtimeOutput?: string; stdout?: string; stderr?: string; executionTimeMs?: number; memoryKb?: number; visibleTests?: TestSummary; hiddenTests?: TestSummary; failureSignals: string[]; safeFailureCategories: string[]; codeHash?: string }
export interface DiagnosisEvidence { source: "COMPILER" | "RUNTIME" | "VISIBLE_TEST" | "HIDDEN_TEST_SUMMARY" | "STATIC_ANALYSIS"; description: string }
export interface ExecutionDiagnosis { outcome: ExecutionOutcome; primaryCategory?: DiagnosisCategory; secondaryCategories: DiagnosisCategory[]; summary: string; evidence: DiagnosisEvidence[]; likelyCause?: string; suspiciousCodeRegions: Array<{ startLine?: number; endLine?: number; description: string }>; confidence: number; safeFailureCategories: string[] }
export interface DiagnoseExecutionInput { execution: ExecutionContext; attemptAnalysis: StudentAttemptAnalysis }
