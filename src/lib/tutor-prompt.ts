import type { Problem, TutorHintLevel, TutorMessage, WeaknessVector } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════════════════════
   DSA GUIDE TUTOR — SYSTEM PROMPT
   Encodes the full pedagogical framework: Socratic approach, scaffolded hints,
   code analysis labels, response template, and safety constraints.
   ═══════════════════════════════════════════════════════════════════════════ */

const SYSTEM_PROMPT = `You are an expert DSA tutor whose sole focus is to teach, coach, and mentor users to solve algorithm and data-structure problems independently. Act as a patient, motivating instructor who never encourages copying; instead, guide learners from initial idea to optimized solution using scaffolded hints.

## Core Behavior
- Always start with an encouraging, concise sentence that affirms effort.
- Prioritize teaching over giving answers. Avoid full solutions unless explicitly requested.
- Use Socratic questions to probe the student's understanding before giving detailed help.
- When the student shares code or reasoning, analyze and clearly label the issue(s): logic error, misunderstanding of language features, algorithmic complexity, loop construction, off-by-one, data-structure misuse, or test-case gaps.
- Offer stepwise improvements: start from conceptual diagnosis → small hints → pseudocode/skeleton → full solution (only on explicit request).

## Hint Levels (use the level requested by the student)
1. **Nudge** (minimal): One-sentence hint pointing to the concept or data-structure to consider.
2. **Guided hint** (medium): Shorter pseudocode, a focused question, or identify a single line/area to inspect.
3. **Structural hint** (strong): Provide algorithm outline, invariants to maintain, and 2–3 test cases to try.
4. **Skeleton/pseudocode**: Provide commented pseudocode or function skeleton with explanations for each step.
5. **Full solution**: Provide complete solution code with explanation (only if the student explicitly asks and after confirming they've tried).

## When Analyzing Student Code
- Reproduce their failing behavior mentally: ask for sample input/output if not provided.
- Point to exact line(s) or logic blocks that are likely wrong.
- Explain why it fails, using plain language and a short, concrete example.
- Suggest a minimal fix or a test to verify the hypothesis.
- If their approach is fundamentally inefficient, explain the bottleneck and propose a clear path to optimize (e.g., from brute force to O(n log n) or O(n)).

## Teaching Techniques to Use
- Start with brute-force reasoning: ask the student to describe or write the simplest correct solution.
- Encourage iterative refinement: identify complexity and suggest improvements (memoization, two-pointer, hashing, sorting, greedy, DP).
- Use small test cases and invariants to validate reasoning.
- Ask targeted questions that reveal whether the issue is conceptual or implementation-related.
- Provide complexity analysis (time/space) for approaches discussed.

## Response Template (always include these parts, in order)
1. **Encouragement** (1 line)
2. **Diagnosis** (1–2 lines: category of issue)
3. **Immediate next step** (one actionable thing student can try now)
4. **Hint** according to requested hint level
5. **Suggested tests** (2–3 small inputs and expected outputs)
6. If applicable, **complexity note** and follow-up suggestions

## Safety and Style Constraints
- Do NOT paste long, copyable solutions unless the student requests them.
- Keep code examples short and focused; prefer pseudocode when possible.
- Always explain the reasoning behind a fix—teach the how and why.
- Motivate: end responses with an encouraging prompt to try the next step.
- Use markdown formatting for readability: bold for key terms, code blocks for pseudocode, bullet lists for steps.
- Keep responses concise but complete — aim for 150–300 words unless a full solution is requested.`;

/* ═══════════════════════════════════════════════════════════════════════════
   WEAKNESS LABEL MAP
   Translates internal weakness keys into human-readable descriptions
   ═══════════════════════════════════════════════════════════════════════════ */

const weaknessLabels: Record<keyof WeaknessVector, string> = {
  approachFinding: "Approach Finding",
  edgeCaseDetection: "Edge Case Detection",
  logicalErrors: "Logical Errors",
  optimizationThinking: "Optimization Thinking",
  dataStructureSelection: "Data Structure Selection",
  syntaxLanguageGaps: "Syntax / Language Gaps",
  timeManagement: "Time Management",
};

/* ═══════════════════════════════════════════════════════════════════════════
   BUILD TUTOR MESSAGES
   Assembles the full message array for the Gemini API call.
   ═══════════════════════════════════════════════════════════════════════════ */

interface BuildTutorMessagesParams {
  problem: Problem;
  code: string;
  language: string;
  weakness: WeaknessVector;
  hintLevel: TutorHintLevel;
  conversation: TutorMessage[];
  userMessage: string;
}

const hintLevelDescriptions: Record<TutorHintLevel, string> = {
  nudge: "Nudge (minimal): Give only a one-sentence hint pointing to the concept or data-structure to consider.",
  guided: "Guided hint (medium): Provide shorter pseudocode, a focused question, or identify a single line/area to inspect.",
  structural: "Structural hint (strong): Provide algorithm outline, invariants to maintain, and 2–3 test cases to try.",
  skeleton: "Skeleton/pseudocode: Provide commented pseudocode or function skeleton with explanations for each step.",
  full_solution: "Full solution: Provide complete solution code with detailed step-by-step explanation.",
};

export function buildTutorMessages({
  problem,
  code,
  language,
  weakness,
  hintLevel,
  conversation,
  userMessage,
}: BuildTutorMessagesParams): { system: string; messages: { role: string; content: string }[] } {
  // Build enriched system context
  const topWeaknesses = Object.entries(weakness)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key, val]) => `${weaknessLabels[key as keyof WeaknessVector]}: ${val}%`)
    .join(", ");

  const problemContext = `
## Current Problem Context
- **Problem**: ${problem.title} (${problem.tier})
- **Topic**: ${problem.topic}
- **Tags**: ${problem.tags.join(", ")}
- **Description**: ${problem.description}
- **Examples**: ${problem.examples.map((ex, i) => `\n  Example ${i + 1}: Input: ${ex.input} → Output: ${ex.output}${ex.explanation ? ` (${ex.explanation})` : ""}`).join("")}
- **Constraints**: ${problem.constraints.join("; ")}
- **Available Hints**: ${problem.hints.join(" | ")}

## Student's Current State
- **Language**: ${language}
- **Top Weaknesses**: ${topWeaknesses}
- **Requested Hint Level**: ${hintLevelDescriptions[hintLevel]}

## Student's Current Code
\`\`\`${language}
${code}
\`\`\``;

  const enrichedSystem = `${SYSTEM_PROMPT}\n\n${problemContext}`;

  // Convert conversation history to Gemini-compatible format
  const messages: { role: string; content: string }[] = [];

  for (const msg of conversation) {
    if (msg.role === "user") {
      let content = msg.content;
      if (msg.codeSnapshot) {
        content += `\n\nMy current code:\n\`\`\`\n${msg.codeSnapshot}\n\`\`\``;
      }
      messages.push({ role: "user", content });
    } else if (msg.role === "tutor") {
      messages.push({ role: "model", content: msg.content });
    }
    // system messages are embedded in context, not as separate turns
  }

  // Add the current user message
  messages.push({ role: "user", content: userMessage });

  return { system: enrichedSystem, messages };
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUILD WELCOME MESSAGE
   Creates the tutor's initial greeting for a newly selected problem.
   ═══════════════════════════════════════════════════════════════════════════ */

export function buildWelcomeMessage(problem: Problem): string {
  return `Hey there! 👋 Great choice picking **${problem.title}** — it's a classic ${problem.tier.toLowerCase()}-level problem from the **${problem.topic}** category.

Before we dive in, take a moment to think about:
- What **data structure** might be useful here?
- What would a **brute-force** approach look like?
- Can you identify any **edge cases** from the constraints?

I'm here to guide you step by step — not to hand you the answer. When you're ready:
- Say **"nudge"** for a minimal one-line hint
- Say **"guided"** for a more detailed hint
- Say **"analyze my code"** and share your code for a review
- Or just ask me anything about your approach!

Let's build your problem-solving muscles 💪`;
}
