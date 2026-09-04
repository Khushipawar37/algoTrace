import "server-only";
import Groq from "groq-sdk";
import { extractGroqCompletionText, requireGroqApiKey } from "./provider-utils";

export interface TutorModelMessage { role: "user" | "model"; content: string }
export const DEFAULT_GROQ_TUTOR_MODEL = "openai/gpt-oss-20b";
export const TUTOR_PROVIDER_TIMEOUT_MS = 20_000;
export const TUTOR_MAX_COMPLETION_TOKENS = 500;
export const TUTOR_TEMPERATURE = 0.35;
export interface TutorGenerationOptions { model?: string; json?: boolean }

export async function generateTutorText(system: string, messages: TutorModelMessage[], options: TutorGenerationOptions = {}): Promise<string> {
  const key = requireGroqApiKey(process.env.GROQ_API_KEY);
  const groq = new Groq({ apiKey: key, timeout: TUTOR_PROVIDER_TIMEOUT_MS, maxRetries: 0 });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TUTOR_PROVIDER_TIMEOUT_MS);
  try {
    const completion = await groq.chat.completions.create({ model: options.model || process.env.GROQ_TUTOR_MODEL || DEFAULT_GROQ_TUTOR_MODEL, messages: [{ role: "system", content: system }, ...messages.map((message) => ({ role: message.role === "model" ? "assistant" as const : "user" as const, content: message.content }))], temperature: TUTOR_TEMPERATURE, max_completion_tokens: TUTOR_MAX_COMPLETION_TOKENS, ...(options.json ? { response_format: { type: "json_object" as const } } : {}) }, { signal: controller.signal });
    return extractGroqCompletionText(completion);
  } finally { clearTimeout(timeout); }
}
