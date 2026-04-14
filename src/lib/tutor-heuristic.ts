import type { Problem, TutorHintLevel, WeaknessVector } from "@/lib/types";

/* ═══════════════════════════════════════════════════════════════════════════
   DSA TUTOR — HEURISTIC FALLBACK ENGINE
   Provides intelligent tutor responses when no LLM API key is configured.
   Uses problem metadata, weakness vector, code patterns, and hint level
   to generate pedagogically sound responses.
   ═══════════════════════════════════════════════════════════════════════════ */

interface HeuristicInput {
  problem: Problem;
  code: string;
  language: string;
  weakness: WeaknessVector;
  hintLevel: TutorHintLevel;
  userMessage: string;
  hintCount: number;
}

/* — Encouragement pool — */
const encouragements = [
  "Nice effort — you're on the right track! 👍",
  "Great that you're thinking through this carefully! 🧠",
  "Good progress so far — let's keep building on it! 💪",
  "I can see you're putting in real thought here — that's exactly what grows skill! ✨",
  "Solid start — the fact that you're asking questions shows strong learning instincts! 🎯",
  "You're doing well — wrestling with the problem is where real learning happens! 🔥",
  "Keep going — every struggle here is making you a stronger problem solver! 💡",
];

/* — Detect common code patterns — */
function analyzeCode(code: string): {
  hasLoop: boolean;
  hasNestedLoop: boolean;
  hasRecursion: boolean;
  hasHashMap: boolean;
  hasSort: boolean;
  isMinimal: boolean;
  lineCount: number;
} {
  const lines = code.split("\n").filter((l) => l.trim().length > 0);
  const lowerCode = code.toLowerCase();
  return {
    hasLoop: /\b(for|while)\b/.test(code),
    hasNestedLoop: (code.match(/\b(for|while)\b/g) || []).length >= 2,
    hasRecursion: /\b(function|def|void|int)\b.*\(/.test(code) && code.includes("return") && /\w+\s*\(/.test(code.slice(code.indexOf("return"))),
    hasHashMap: /\b(Map|HashMap|dict|{}\s*;|new Map|new Set|set\(|map\(|hash|Object\.)/i.test(code),
    hasSort: /\.sort\b|sorted\b|Arrays\.sort|sort\(/i.test(lowerCode),
    isMinimal: lines.length <= 5 || code.includes("TODO") || code.includes("todo"),
    lineCount: lines.length,
  };
}

/* — Get the top weakness area — */
function getTopWeakness(weakness: WeaknessVector): { key: keyof WeaknessVector; label: string } {
  const labels: Record<keyof WeaknessVector, string> = {
    approachFinding: "finding the right approach",
    edgeCaseDetection: "edge case detection",
    logicalErrors: "logical errors",
    optimizationThinking: "optimization thinking",
    dataStructureSelection: "data structure selection",
    syntaxLanguageGaps: "syntax and language features",
    timeManagement: "time management",
  };

  const top = Object.entries(weakness).sort(([, a], [, b]) => b - a)[0];
  return { key: top[0] as keyof WeaknessVector, label: labels[top[0] as keyof WeaknessVector] };
}

/* — Main heuristic response generator — */
export function generateHeuristicResponse(input: HeuristicInput): string {
  const { problem, code, weakness, hintLevel, userMessage, hintCount } = input;
  const codeAnalysis = analyzeCode(code);
  const topWeakness = getTopWeakness(weakness);
  const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
  const lowerMsg = userMessage.toLowerCase();

  // Check if asking for code analysis
  const isCodeAnalysis = lowerMsg.includes("analyze") || lowerMsg.includes("review") ||
    lowerMsg.includes("what's wrong") || lowerMsg.includes("check my") || lowerMsg.includes("debug");

  // Check if asking about approach
  const isApproachQuestion = lowerMsg.includes("approach") || lowerMsg.includes("how to") ||
    lowerMsg.includes("strategy") || lowerMsg.includes("which") || lowerMsg.includes("what should");

  // Check if asking about complexity
  const isComplexityQuestion = lowerMsg.includes("complexity") || lowerMsg.includes("big o") ||
    lowerMsg.includes("time") || lowerMsg.includes("space") || lowerMsg.includes("efficient");

  const parts: string[] = [];

  // 1. Encouragement
  parts.push(encouragement);
  parts.push("");

  // 2. Diagnosis
  if (isCodeAnalysis) {
    if (codeAnalysis.isMinimal) {
      parts.push("**📋 Diagnosis:** Your code is still at the starter/skeleton stage. Let's work on building out the logic first.");
    } else if (codeAnalysis.hasNestedLoop && problem.tier !== "Hard") {
      parts.push("**📋 Diagnosis:** I notice nested loops in your code — this suggests a brute-force approach. There might be a more efficient path.");
    } else if (!codeAnalysis.hasHashMap && problem.tags.includes("hash-map")) {
      parts.push("**📋 Diagnosis:** This problem benefits from a hash-based data structure, but I don't see one in your code yet.");
    } else {
      parts.push(`**📋 Diagnosis:** Based on your weakness profile, your current challenge area is **${topWeakness.label}**. Let's focus there.`);
    }
  } else if (isApproachQuestion) {
    parts.push(`**📋 Diagnosis:** Approach question — this is a **${problem.topic}** problem (${problem.tier}). Let me guide you to the right pattern.`);
  } else if (isComplexityQuestion) {
    parts.push(`**📋 Diagnosis:** Complexity analysis question — let's think about how your current approach scales.`);
  } else {
    parts.push(`**📋 Diagnosis:** Based on your profile, let's focus on **${topWeakness.label}** for this problem.`);
  }
  parts.push("");

  // 3. Immediate next step
  if (codeAnalysis.isMinimal) {
    parts.push("**🎯 Next step:** Before writing any code, describe in one sentence what the brute-force solution would do.");
  } else if (isComplexityQuestion) {
    parts.push("**🎯 Next step:** Count how many times your innermost operation runs relative to input size n.");
  } else {
    parts.push(`**🎯 Next step:** Try running your code mentally with the first example: \`${problem.examples[0]?.input}\` — what do you expect at each step?`);
  }
  parts.push("");

  // 4. Hint at the requested level
  parts.push(generateHintAtLevel(hintLevel, problem, codeAnalysis, hintCount));
  parts.push("");

  // 5. Suggested tests
  parts.push("**🧪 Try these test cases:**");
  for (const ex of problem.examples.slice(0, 2)) {
    parts.push(`- Input: \`${ex.input}\` → Expected: \`${ex.output}\``);
  }
  // Add an edge case suggestion
  if (problem.tags.includes("array") || problem.tags.includes("string")) {
    parts.push("- Try with an empty or single-element input — does your code handle it?");
  }
  parts.push("");

  // 6. Complexity note
  if (isComplexityQuestion || hintLevel === "structural" || hintLevel === "skeleton") {
    if (codeAnalysis.hasNestedLoop) {
      parts.push("**⏱ Complexity note:** Nested loops typically give O(n²). For this problem, think about whether a hash map or sorting could bring it down to O(n) or O(n log n).");
    } else if (codeAnalysis.hasSort) {
      parts.push("**⏱ Complexity note:** Sorting gives O(n log n). Consider if that's optimal for this problem, or if a single-pass O(n) approach exists.");
    } else {
      parts.push(`**⏱ Complexity note:** Think about the target complexity for a ${problem.tier} problem in the "${problem.topic}" category.`);
    }
    parts.push("");
  }

  // Motivational close
  parts.push("Try that and tell me what you get — I'm right here to help! 🚀");

  return parts.join("\n");
}

/* — Generate hint at the exact requested level — */
function generateHintAtLevel(
  level: TutorHintLevel,
  problem: Problem,
  codeAnalysis: ReturnType<typeof analyzeCode>,
  hintCount: number,
): string {
  const hint = problem.hints[Math.min(hintCount, 2)];

  switch (level) {
    case "nudge":
      return `**💡 Nudge:** ${hint}`;

    case "guided":
      return `**💡 Guided hint:** ${hint}\n\nAsk yourself: *What invariant must be true at the start of each iteration?* Focus on identifying the key operation that happens in each step.`;

    case "structural": {
      const allHints = problem.hints.map((h, i) => `${i + 1}. ${h}`).join("\n");
      return `**💡 Structural hint:**\n\n**Algorithm outline:**\n${allHints}\n\n**Invariants to maintain:**\n- What property must hold before/after each loop iteration?\n- What are your base cases?`;
    }

    case "skeleton": {
      return `**💡 Skeleton approach:**\n\n\`\`\`\n// Step 1: Initialize your data structure(s)\n//   → Think: what do you need to track?\n\n// Step 2: Iterate through the input\n//   → For each element, what decision do you make?\n\n// Step 3: Apply the core logic\n//   → ${hint}\n\n// Step 4: Return the result\n//   → What exactly needs to be returned?\n\`\`\`\n\nFill in each step with actual code — what goes in Step 1 for this problem?`;
    }

    case "full_solution":
      if (codeAnalysis.isMinimal) {
        return "**⚠️ I'd love to help with the full solution, but I notice you haven't attempted much yet.** Try writing out even a brute-force approach first — that's where the real learning happens. Once you've tried, I'll be happy to walk through the complete solution with you!";
      }
      return `**💡 Full solution walkthrough:**\n\nBefore I share the complete solution, here are all three insight levels:\n1. ${problem.hints[0]}\n2. ${problem.hints[1]}\n3. ${problem.hints[2]}\n\nGive it one more try with these hints — if you still need the full solution, ask again and I'll provide it with a step-by-step explanation.`;
  }
}
