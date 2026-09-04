import type { StudentHelpIntent, TutorHintLevel } from "../types";
import type { StudentAttemptAnalysis, CodeRegion } from "../analyzer/types";
import type { ExecutionDiagnosis } from "../diagnosis/types";
export type TutorAction = "ASK_REASONING_QUESTION" | "ASK_COMPLEXITY_QUESTION" | "ASK_DRY_RUN" | "POINT_TO_CODE_REGION" | "POINT_TO_FAILURE_TYPE" | "EXPLAIN_CONCEPT" | "COMPARE_ALTERNATIVES" | "GUIDE_EDGE_CASE_REASONING" | "GUIDE_BOUNDARY_REASONING" | "GUIDE_STATE_REASONING" | "GUIDE_COMPLEXITY_IMPROVEMENT" | "PROVIDE_APPROACH_DIRECTION" | "PROVIDE_PSEUDOCODE" | "PROVIDE_CODE_FRAGMENT" | "ASK_STUDENT_TO_TRY_AGAIN" | "ASK_REFLECTION" | "ACKNOWLEDGE_SUCCESS" | "CLARIFY_STUDENT_QUESTION" | "SAFE_FALLBACK";
export type ReasoningMode = "SOCRATIC" | "EXPLANATORY" | "DIAGNOSTIC" | "REFLECTIVE";
export interface TutorDecision { action: TutorAction; objective: string; focus?: string; targetIssue?: string; targetCodeRegion?: CodeRegion; reasoningMode?: ReasoningMode; recommendedPromptStyle?: string; shouldReferenceExecution: boolean; shouldReferenceCode: boolean; shouldAskForAnotherAttempt: boolean; confidence: number }
export interface TutorDecisionSession { previousAction?: TutorAction; lastDecisionFocus?: string; previousHintLevel?: TutorHintLevel; studentAskedForMoreHelp: boolean; codeChangedSinceLastHint?: boolean }
export interface DecideTutorActionInput { studentIntent: StudentHelpIntent; hintLevel: TutorHintLevel; attemptAnalysis: StudentAttemptAnalysis; executionDiagnosis: ExecutionDiagnosis; session: TutorDecisionSession }
