import "server-only";
import { generateTutorText } from "../provider";
import { analyzeStudentAttemptCore } from "./engine";
import type { AttemptAnalyzerInput, StudentAttemptAnalysis } from "./types";

export async function analyzeStudentAttempt(input: AttemptAnalyzerInput): Promise<StudentAttemptAnalysis> {
  return analyzeStudentAttemptCore(input, (system, user) => generateTutorText(system, [{ role: "user", content: user }], { model: process.env.GROQ_ANALYZER_MODEL || process.env.GROQ_TUTOR_MODEL, json: true }));
}
