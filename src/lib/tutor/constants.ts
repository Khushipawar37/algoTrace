import type { TutorHintLevel, TutorHintPolicy } from "./types";

export const TUTOR_POLICIES: Record<TutorHintLevel, TutorHintPolicy> = {
  0: { level: 0, objective: "Make the student reason about the next step.", allowedContent: ["focused questions", "dry-run prompts", "complexity questions", "edge-case questions"], forbiddenContent: ["optimal algorithm or data-structure names", "pseudocode", "code"] },
  1: { level: 1, objective: "Direct attention to the relevant flaw or area.", allowedContent: ["broad issue identification", "repeated work", "boundaries", "state or duplicate handling"], forbiddenContent: ["final algorithmic pattern", "implementation steps", "pseudocode", "code"] },
  2: { level: 2, objective: "Teach the missing concept without naming the final solution.", allowedContent: ["conceptual explanation", "analogy", "questions about retaining prior information"], forbiddenContent: ["final algorithm or data-structure name", "pseudocode", "code"] },
  3: { level: 3, objective: "Suggest an algorithmic pattern or data-structure direction.", allowedContent: ["pattern names", "data-structure names", "brief rationale"], forbiddenContent: ["complete steps", "pseudocode", "code"] },
  4: { level: 4, objective: "Provide a structured implementation plan.", allowedContent: ["algorithm steps", "pseudocode", "invariants"], forbiddenContent: ["copy-pasteable solution", "complete source code"] },
  5: { level: 5, objective: "Help with one narrow implementation blockage.", allowedContent: ["short code fragment", "syntax help", "one loop or corrected condition"], forbiddenContent: ["complete problem solution", "full function implementation"] },
  6: { level: 6, objective: "Provide a complete explained solution.", allowedContent: ["complete solution", "complexity explanation"], forbiddenContent: [], requiresExplicitStudentRequest: true },
};

export const MAX_TUTOR_MESSAGE_LENGTH = 2_000;
export const MAX_TUTOR_CODE_LENGTH = 30_000;
export const MAX_HISTORY_MESSAGES = 12;
