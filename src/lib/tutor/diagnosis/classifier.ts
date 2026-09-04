import type { DiagnosisCategory, ExecutionContext } from "./types";
export function classifyCompilerError(text = ""): { category: DiagnosisCategory; summary: string; confidence: number } {
  if (/expected\s+['";})\]]|unterminated|before ['"}]/i.test(text)) return { category: "SYNTAX", summary: "A syntax error prevents compilation.", confidence: .98 };
  if (/cannot convert|invalid operands?|no matching function|type mismatch/i.test(text)) return { category: "TYPE_ERROR", summary: "A type or function-signature mismatch prevents compilation.", confidence: .94 };
  return { category: "COMPILATION", summary: "The code did not compile; the diagnostic is not specific enough for a narrower classification.", confidence: .8 };
}
export function classifyRuntimeError(text = ""): { category: DiagnosisCategory; likelyCause: string; confidence: number } {
  if (/stack overflow|stack-overflow/i.test(text)) return { category: "STACK_OVERFLOW", likelyCause: "Likely excessive or non-terminating recursion.", confidence: .96 };
  if (/SIGFPE|floating point exception|divide by zero/i.test(text)) return { category: "DIVIDE_BY_ZERO", likelyCause: "Likely division or modulo by zero.", confidence: .96 };
  if (/SIGSEGV|segmentation fault|heap-buffer-overflow|out of bounds/i.test(text)) return { category: "OUT_OF_BOUNDS", likelyCause: "Likely invalid memory or out-of-bounds access.", confidence: .88 };
  if (/null pointer|nullptr|invalid access/i.test(text)) return { category: "NULL_OR_INVALID_ACCESS", likelyCause: "Likely null or invalid access.", confidence: .88 };
  return { category: "RUNTIME", likelyCause: "The program terminated abnormally.", confidence: .72 };
}
export function categoryFromSafeSignals(execution: ExecutionContext): DiagnosisCategory | undefined { const value = execution.safeFailureCategories.join(" ").toLowerCase(); if (/bound|single|empty/.test(value)) return "BOUNDARY"; if (/duplicate/.test(value)) return "DUPLICATE_HANDLING"; if (/overflow|large value/.test(value)) return "OVERFLOW"; if (/format/.test(value)) return "OUTPUT_FORMAT"; return undefined; }
