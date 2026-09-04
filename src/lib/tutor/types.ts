export type TutorHintLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type StudentHelpIntent =
  | "INITIAL_HELP"
  | "MORE_HELP"
  | "EXPLAIN_CONCEPT"
  | "NEED_APPROACH"
  | "NEED_PSEUDOCODE"
  | "NEED_CODE_HELP"
  | "REQUEST_FULL_SOLUTION"
  | "QUESTION";

export interface TutorHintPolicy {
  level: TutorHintLevel;
  objective: string;
  allowedContent: string[];
  forbiddenContent: string[];
  requiresExplicitStudentRequest?: boolean;
}

export interface TutorSessionState {
  id?: string;
  problemId: string;
  userId: string;
  currentHintLevel: TutorHintLevel;
  hintsGiven: number;
  lastHintLevel?: TutorHintLevel;
  studentAskedForMoreHelp: boolean;
  fullSolutionUnlocked: boolean;
}

export interface TutorProblemContext {
  id: string;
  title: string;
  description: string;
  constraints: string[];
  topics: string[];
  guidanceHints: string[];
}

export interface TutorResponse {
  message: string;
  hintLevel: TutorHintLevel;
  intent: StudentHelpIntent;
  sessionId: string;
  nextSuggestedAction?: string;
}
