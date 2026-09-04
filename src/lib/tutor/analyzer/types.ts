export type AttemptState = "EMPTY" | "STARTED" | "PARTIAL" | "COMPLETE" | "UNKNOWN";
export type AttemptIssueType = "SYNTAX" | "LOGIC" | "COMPLEXITY" | "EDGE_CASE" | "ALGORITHMIC" | "CONCEPTUAL" | "IMPLEMENTATION" | "UNKNOWN";
export type IssueSeverity = "LOW" | "MEDIUM" | "HIGH";
export interface AttemptIssue { type: AttemptIssueType; severity: IssueSeverity; description: string; evidence?: string }
export interface CodeRegion { startLine?: number; endLine?: number; description: string }
export interface StudentAttemptAnalysis { attemptState: AttemptState; approachDetected?: string; codeCompleteness: number; issues: AttemptIssue[]; conceptsUnderstood: string[]; possibleKnowledgeGaps: string[]; suspiciousCodeRegions: CodeRegion[]; estimatedTimeComplexity?: string; estimatedSpaceComplexity?: string; summary: string; confidence: number }
export interface AttemptAnalyzerProblem { title: string; statement: string; constraints: string[]; examples: Array<{ input: string; output: string }>; topics: string[]; expectedTimeComplexity?: string; expectedSpaceComplexity?: string; canonicalPatterns: string[]; commonMistakes: string[] }
export interface AttemptAnalyzerInput { problem: AttemptAnalyzerProblem; language: string; code: string; starterCode?: string }
export interface PreAnalysisSignals { lineCount: number; characterCount: number; meaningfulStatementCount: number; nestedLoops: boolean; recursion: boolean; sorting: boolean; mapOrSet: boolean; stackOrQueue: boolean; binarySearchShape: boolean; twoPointerShape: boolean }
