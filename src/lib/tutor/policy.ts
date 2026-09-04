import { TUTOR_POLICIES } from "./constants";
import type { StudentHelpIntent, TutorHintLevel, TutorSessionState } from "./types";

const intentFloor: Partial<Record<StudentHelpIntent, TutorHintLevel>> = {
  EXPLAIN_CONCEPT: 2,
  NEED_APPROACH: 3,
  NEED_PSEUDOCODE: 4,
  NEED_CODE_HELP: 5,
};

export function determineNextHintLevel(session: TutorSessionState, intent: StudentHelpIntent): TutorHintLevel {
  if (intent === "REQUEST_FULL_SOLUTION") return Math.min(session.currentHintLevel, 5) as TutorHintLevel;
  if (intent === "INITIAL_HELP") return session.hintsGiven === 0 ? 0 : session.currentHintLevel;
  if (intent === "MORE_HELP") return Math.min(5, session.currentHintLevel + 1) as TutorHintLevel;
  const floor = intentFloor[intent];
  return floor === undefined ? session.currentHintLevel : Math.max(session.currentHintLevel, floor) as TutorHintLevel;
}

export function getTutorHintPolicy(level: TutorHintLevel) { return TUTOR_POLICIES[level]; }
