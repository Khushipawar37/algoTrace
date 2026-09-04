import type { StudentAttemptAnalysis } from "./types";

export function summarizeAttemptAnalysis(analysis: StudentAttemptAnalysis): string {
  return [`Attempt state: ${analysis.attemptState}`, `Detected approach: ${analysis.approachDetected ?? "uncertain"}`, `Likely issues: ${analysis.issues.length ? analysis.issues.map((issue) => `${issue.type}: ${issue.description}`).join("; ") : "none identified reliably"}`, `Concepts demonstrated: ${analysis.conceptsUnderstood.join(", ") || "none identified reliably"}`, `Possible knowledge gaps: ${analysis.possibleKnowledgeGaps.join(", ") || "none identified reliably"}`, `Estimated complexity: time ${analysis.estimatedTimeComplexity ?? "unknown"}, space ${analysis.estimatedSpaceComplexity ?? "unknown"}`, `Confidence: ${analysis.confidence.toFixed(2)}`, `Analysis summary: ${analysis.summary}`].join("\n");
}
