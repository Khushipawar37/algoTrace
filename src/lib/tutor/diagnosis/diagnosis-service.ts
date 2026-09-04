import "server-only";
import { generateTutorText } from "../provider";
import { diagnoseExecution } from "./engine";
import { buildDiagnosisPrompt } from "./prompt";
import { ExecutionDiagnosisSchema } from "./schema";
import type { DiagnoseExecutionInput, ExecutionDiagnosis } from "./types";
const parseJson = (value: string): unknown => { const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i); return JSON.parse(fenced?.[1] ?? value); };
export async function diagnoseExecutionWithFallback(input: DiagnoseExecutionInput & { problem: { title: string; description: string; constraints: string[] }; language: string; code: string }): Promise<ExecutionDiagnosis> {
  const baseline = diagnoseExecution(input);
  const ambiguous = (input.execution.outcome === "WRONG_ANSWER" || input.execution.outcome === "PARTIALLY_CORRECT" || input.execution.outcome === "RUNTIME_ERROR") && baseline.confidence < .8;
  if (!ambiguous) return baseline;
  try { const prompt = buildDiagnosisPrompt({ ...input, baseline }); const raw = await generateTutorText(prompt.system, [{ role: "user", content: prompt.user }], { model: process.env.GROQ_DIAGNOSIS_MODEL || process.env.GROQ_ANALYZER_MODEL || process.env.GROQ_TUTOR_MODEL, json: true }); const parsed = ExecutionDiagnosisSchema.safeParse(parseJson(raw)); return parsed.success && parsed.data.outcome === baseline.outcome ? parsed.data : baseline; }
  catch { return baseline; }
}
