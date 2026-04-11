export type WeaknessKey =
  | "approachFinding"
  | "edgeCaseDetection"
  | "logicalErrors"
  | "optimizationThinking"
  | "dataStructureSelection"
  | "syntaxLanguageGaps"
  | "timeManagement";

export type BehavioralEventType =
  | "start_coding"
  | "long_pause"
  | "delete_heavy"
  | "approach_change"
  | "hint_requested"
  | "run_attempt"
  | "language_switch";

export interface BehavioralEvent {
  sessionId: string;
  userId: string;
  type: BehavioralEventType;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface FeatureVector {
  time_to_first_char: number;
  pause_frequency: number;
  delete_ratio: number;
  approach_pivots: number;
  hint_dependency_rate: number;
  run_attempt_count: number;
  time_per_complexity_tier: number;
  error_pattern_clusters: number;
  brute_force_persistence: number;
  line_edit_churn: number;
}

export interface WeaknessVector {
  approachFinding: number;
  edgeCaseDetection: number;
  logicalErrors: number;
  optimizationThinking: number;
  dataStructureSelection: number;
  syntaxLanguageGaps: number;
  timeManagement: number;
}

export interface SessionReport {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  evidence: string[];
  topPriorityArea: string;
  improvementPlan: string[];
  nextProblemSuggestion: string;
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  tier: "Easy" | "Medium" | "Hard";
  topic: string;
  tags: string[];
  weaknessAreas: WeaknessKey[];
  prompt: string;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints: [string, string, string];
  starterCode: Record<string, string>;
}
