import { safeTutorFallback, validateTutorResponse } from "./validator";
import type { TutorHintLevel } from "./types";

export async function generateValidatedText(input: { hintLevel: TutorHintLevel; generate: (retry: boolean) => Promise<string> }) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const message = await input.generate(attempt === 1);
      if (validateTutorResponse(message, input.hintLevel).valid) return { message, validated: true };
    } catch { break; }
  }
  return { message: safeTutorFallback(input.hintLevel), validated: false };
}
