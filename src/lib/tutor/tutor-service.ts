import "server-only";
import { buildTutorSystemPrompt } from "./prompt";
import { generateTutorText, type TutorModelMessage } from "./provider";
import { generateValidatedText } from "./generation";
import type { StudentHelpIntent, TutorHintLevel, TutorProblemContext } from "./types";

export async function generateTutorResponse(input: { message: string; problem: TutorProblemContext; hintLevel: TutorHintLevel; intent: StudentHelpIntent; code?: string; history: TutorModelMessage[]; attemptAnalysis?: string; executionDiagnosis?: string; tutorDecision?: string }) {
  if (input.intent === "REQUEST_FULL_SOLUTION") return { message: "I won't jump straight to the full solution. Let's use stronger guidance first: tell me whether you want the approach, pseudocode, or help with one implementation step.", validated: true };
  const userContext = `${input.message}${input.code ? `\n\nStudent code:\n\`\`\`\n${input.code}\n\`\`\`` : ""}`;
  const messages = [...input.history, { role: "user" as const, content: userContext }];
  return generateValidatedText({ hintLevel: input.hintLevel, generate: async (retry) => generateTutorText(buildTutorSystemPrompt({ hintLevel: input.hintLevel, problem: input.problem, codeProvided: Boolean(input.code), attemptAnalysis: input.attemptAnalysis, executionDiagnosis: input.executionDiagnosis, tutorDecision: input.tutorDecision, retry }), messages) });
}
