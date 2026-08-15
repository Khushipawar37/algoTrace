import { InferenceClient } from "@huggingface/inference";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

import type { Problem, TutorHintLevel, WeaknessVector } from "@/lib/types";

type CoachInput = {
  problem: Problem;
  code: string;
  language: string;
  weakness: WeaknessVector;
  hintLevel: TutorHintLevel;
  userMessage: string;
  recentConversation: string;
  testContext?: string;
};

const SYSTEM_RULES = [
  "You are a professional DSA tutor.",
  "Use Socratic coaching: ask guiding questions before giving direct answers.",
  "Do not reveal full solutions unless the user explicitly asks for full solution.",
  "Keep response under 180 words and actionable.",
  "If there is a failing test context, prioritize debugging that failing input.",
  "Always include: (1) diagnosis (2) next step (3) one test case to try.",
].join("\n");

const promptTemplate = ChatPromptTemplate.fromTemplate(`
{systemRules}

Problem: {problemTitle}
Topic: {topic}
Difficulty: {tier}
Prompt: {prompt}
Constraints: {constraints}
Hint level requested: {hintLevel}
Language: {language}
Weakness profile: {weaknessSummary}

Recent conversation:
{recentConversation}

Latest user question:
{userMessage}

Current code:
{code}

Test context (if present):
{testContext}
`);

function summarizeWeakness(weakness: WeaknessVector) {
  const entries = Object.entries(weakness).sort((a, b) => b[1] - a[1]);
  return entries
    .slice(0, 3)
    .map(([k, v]) => `${k}:${Math.round(v)}`)
    .join(", ");
}

export async function generateLangChainHuggingFaceReply(input: CoachInput): Promise<string> {
  const hfToken = process.env.HUGGINGFACE_API_KEY;
  if (!hfToken) {
    throw new Error("HUGGINGFACE_API_KEY is missing.");
  }

  const model = process.env.HF_CHAT_MODEL ?? "HuggingFaceH4/zephyr-7b-beta";
  const hf = new InferenceClient(hfToken);
  const parser = new StringOutputParser();

  const chain = RunnableSequence.from([
    promptTemplate,
    async (promptValue) => {
      const text = promptValue.toString();
      const response = await hf.textGeneration({
        model,
        inputs: text,
        parameters: {
          max_new_tokens: 320,
          temperature: 0.45,
          return_full_text: false,
        },
      });
      return response.generated_text ?? "";
    },
    parser,
  ]);

  return chain.invoke({
    systemRules: SYSTEM_RULES,
    problemTitle: input.problem.title,
    topic: input.problem.topic,
    tier: input.problem.tier,
    prompt: input.problem.prompt,
    constraints: input.problem.constraints.join("; "),
    hintLevel: input.hintLevel,
    language: input.language,
    weaknessSummary: summarizeWeakness(input.weakness),
    recentConversation: input.recentConversation || "No prior context.",
    userMessage: input.userMessage,
    code: input.code,
    testContext: input.testContext ?? "No test context provided.",
  });
}
