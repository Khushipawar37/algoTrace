import { NextResponse } from "next/server";
import { z } from "zod";

import { buildTutorMessages } from "@/lib/tutor-prompt";
import { generateHeuristicResponse } from "@/lib/tutor-heuristic";
import type { Problem } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════════════════════
   /api/coach — DSA Tutor API Route
   Accepts conversation context and returns a tutor response.
   Uses Gemini API when GEMINI_API_KEY is set, otherwise falls back to
   the heuristic response engine.
   ═══════════════════════════════════════════════════════════════════════════ */

const exampleSchema = z.object({
  input: z.string(),
  output: z.string(),
  explanation: z.string().optional(),
});

const problemSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  tier: z.enum(["Easy", "Medium", "Hard"]),
  topic: z.string(),
  tags: z.array(z.string()),
  weaknessAreas: z.array(z.string()),
  prompt: z.string(),
  description: z.string(),
  examples: z.array(exampleSchema),
  constraints: z.array(z.string()),
  hints: z.tuple([z.string(), z.string(), z.string()]),
  starterCode: z.record(z.string(), z.string()),
});

const weaknessSchema = z.object({
  approachFinding: z.number(),
  edgeCaseDetection: z.number(),
  logicalErrors: z.number(),
  optimizationThinking: z.number(),
  dataStructureSelection: z.number(),
  syntaxLanguageGaps: z.number(),
  timeManagement: z.number(),
});

const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "tutor", "system"]),
  content: z.string(),
  timestamp: z.number(),
  hintLevel: z.enum(["nudge", "guided", "structural", "skeleton", "full_solution"]).optional(),
  codeSnapshot: z.string().optional(),
});

const requestSchema = z.object({
  problem: problemSchema,
  code: z.string(),
  language: z.string(),
  weakness: weaknessSchema,
  hintLevel: z.enum(["nudge", "guided", "structural", "skeleton", "full_solution"]),
  conversation: z.array(messageSchema),
  userMessage: z.string(),
  hintCount: z.number(),
});

/* — Call Gemini API — */
async function callGemini(
  system: string,
  messages: { role: string; content: string }[],
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("No GEMINI_API_KEY configured");
  }

  const geminiMessages = messages.map((msg) => ({
    role: msg.role === "model" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1500,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Gemini API error:", response.status, errorText);
    throw new Error(`Gemini API returned ${response.status}`);
  }

  const data = await response.json();
  const candidate = data?.candidates?.[0];
  if (!candidate?.content?.parts?.[0]?.text) {
    throw new Error("No content in Gemini response");
  }

  return candidate.content.parts[0].text;
}

/* — POST handler — */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = requestSchema.parse(body);

    const hasApiKey = !!process.env.GEMINI_API_KEY;

    if (hasApiKey) {
      // Use Gemini API
      try {
        const { system, messages } = buildTutorMessages({
          problem: parsed.problem as unknown as Problem,
          code: parsed.code,
          language: parsed.language,
          weakness: parsed.weakness,
          hintLevel: parsed.hintLevel,
          conversation: parsed.conversation,
          userMessage: parsed.userMessage,
        });

        const reply = await callGemini(system, messages);
        return NextResponse.json({ reply, source: "gemini" });
      } catch (geminiError) {
        console.error("Gemini call failed, falling back to heuristics:", geminiError);
        // Fall through to heuristic
      }
    }

    // Heuristic fallback
    const reply = generateHeuristicResponse({
      problem: parsed.problem as unknown as Problem,
      code: parsed.code,
      language: parsed.language,
      weakness: parsed.weakness,
      hintLevel: parsed.hintLevel,
      userMessage: parsed.userMessage,
      hintCount: parsed.hintCount,
    });

    return NextResponse.json({ reply, source: "heuristic" });
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json(
      { reply: "I had trouble processing that. Could you rephrase your question?", source: "error" },
      { status: 200 }, // Still 200 so the UI doesn't break
    );
  }
}
