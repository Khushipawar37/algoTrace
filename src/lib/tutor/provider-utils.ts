export class TutorProviderConfigurationError extends Error {
  constructor() { super("Tutor model is not configured"); this.name = "TutorProviderConfigurationError"; }
}

export function requireGroqApiKey(value: string | undefined): string {
  if (!value?.trim()) throw new TutorProviderConfigurationError();
  return value;
}

export function extractGroqCompletionText(completion: { choices?: Array<{ message?: { content?: string | null } }> }): string {
  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Tutor provider returned no text");
  return text;
}
