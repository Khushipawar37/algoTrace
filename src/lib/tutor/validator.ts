import { TUTOR_POLICIES } from "./constants";
import type { TutorHintLevel } from "./types";

const CODE_FENCE = /```(?:c\+\+|cpp|java|javascript|typescript|python|js|ts)?\s*[\s\S]{80,}?```/i;
const SOLUTION_SHAPE = /\b(class\s+Solution|public\s+static\s+void\s+main|def\s+\w+\s*\([^)]*\)\s*:|function\s+\w+\s*\([^)]*\)\s*\{)[\s\S]{60,}/i;
const PATTERNS = /\b(hash(?:ing|map|set)?|two pointers?|sliding window|binary search|dynamic programming|\bdfs\b|\bbfs\b|stack|queue)\b/i;

export function validateTutorResponse(message: string, level: TutorHintLevel): { valid: boolean; reason?: string } {
  if (!message.trim()) return { valid: false, reason: "empty response" };
  if (level < 6 && (CODE_FENCE.test(message) || SOLUTION_SHAPE.test(message))) return { valid: false, reason: "complete-code leakage" };
  if (level <= 2 && /```/.test(message)) return { valid: false, reason: "code or pseudocode is not allowed" };
  if (level <= 2 && PATTERNS.test(message)) return { valid: false, reason: "algorithmic pattern disclosed too early" };
  if (level === 6 && TUTOR_POLICIES[6].requiresExplicitStudentRequest !== true) return { valid: false, reason: "full solution not gated" };
  return { valid: true };
}

export function safeTutorFallback(level: TutorHintLevel) {
  if (level <= 1) return "Pause on the part of your approach that repeats work. What information do you calculate more than once, and what would change if you could remember it? Try a tiny example by hand, then make one small revision.";
  if (level === 2) return "Think about carrying useful information forward as you process the input, so later steps do not repeat earlier searches. What fact from each processed element would help you decide the next one?";
  if (level === 3) return "Consider a lookup-based pattern that stores useful information from elements already processed. Write down exactly what the key and value would represent before coding it.";
  if (level === 4) return "Plan: initialize the state you need, scan the input once, check whether the current item completes the condition, then update the state. Define the invariant for that stored state before implementing.";
  return "Implement only the state lookup and update first, then dry-run it on the smallest example. If that part fails, share the exact condition and I’ll help narrow it down.";
}
