import { collectPreAnalysisSignals, isEmptyAttempt } from "./heuristics";
import { buildAttemptAnalyzerPrompt } from "./prompt";
import { StudentAttemptAnalysisSchema } from "./schema";
import type { AttemptAnalyzerInput, StudentAttemptAnalysis } from "./types";

export const EMPTY_ATTEMPT_ANALYSIS: StudentAttemptAnalysis = { attemptState: "EMPTY", codeCompleteness: 0, issues: [], conceptsUnderstood: [], possibleKnowledgeGaps: [], suspiciousCodeRegions: [], summary: "No meaningful implementation attempt is present yet.", confidence: 1 };
export const UNKNOWN_ATTEMPT_ANALYSIS: StudentAttemptAnalysis = { attemptState: "UNKNOWN", codeCompleteness: 0.5, issues: [], conceptsUnderstood: [], possibleKnowledgeGaps: [], suspiciousCodeRegions: [], summary: "The current attempt could not be analyzed reliably.", confidence: 0 };
const parseJson = (value: string): unknown => { const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i); return JSON.parse(fenced?.[1] ?? value); };

export async function analyzeStudentAttemptCore(input: AttemptAnalyzerInput, generate: (system: string, user: string) => Promise<string>): Promise<StudentAttemptAnalysis> {
  if (isEmptyAttempt(input.code, input.starterCode)) return EMPTY_ATTEMPT_ANALYSIS;
  const prompt = buildAttemptAnalyzerPrompt(input, collectPreAnalysisSignals(input.code));
  try { const parsed = StudentAttemptAnalysisSchema.safeParse(parseJson(await generate(prompt.system, prompt.user))); return parsed.success ? parsed.data : UNKNOWN_ATTEMPT_ANALYSIS; }
  catch { return UNKNOWN_ATTEMPT_ANALYSIS; }
}
