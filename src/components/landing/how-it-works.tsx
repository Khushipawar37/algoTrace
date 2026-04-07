"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const steps = [
  {
    title: "You start coding",
    desc: "We capture time-to-first-keystroke, language choice, and first implementation pattern.",
    panel: [
      "def two_sum(nums, target):",
      "    seen = {}",
      "    for i, n in enumerate(nums):",
      "        comp = target - n",
      "        if comp in seen:",
      "            return [seen[comp], i]",
    ],
  },
  {
    title: "Behavior stream is logged",
    desc: "Pauses, deletions, run attempts, and approach pivots become timestamped events.",
    panel: [
      "start_coding t+4.2s",
      "long_pause t+38s gap:35s",
      "run_attempt t+92s",
      "delete_heavy t+95s",
      "approach_change t+102s",
    ],
  },
  {
    title: "Model predicts weakness",
    desc: "Feature vector is scored by Random Forest for 7 cognitive weakness dimensions.",
    panel: [
      "approachFinding: 62",
      "edgeCaseDetection: 78",
      "optimizationThinking: 41",
      "logicalErrors: 18",
      "dataStructureSelection: 35",
    ],
  },
  {
    title: "Coach intervenes",
    desc: "Socratic questions adapt to your top weakness and current code context.",
    panel: [
      "Coach: What edge case have you not tested yet?",
      "You: Empty input and duplicate values.",
      "Coach: Great. How would your invariant hold there?",
    ],
  },
  {
    title: "Session debrief",
    desc: "You get strengths, evidence-backed weaknesses, plan of action, and next problem.",
    panel: ["Top priority: Edge case detection", "Plan: 3 concrete drills", "Next: Valid Parentheses"],
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="space-y-2">
        {steps.map((step, i) => (
          <button
            key={step.title}
            onClick={() => setActive(i)}
            className={cn(
              "w-full rounded-xl border p-4 text-left transition",
              i === active
                ? "border-primary/60 bg-card shadow-[0_0_0_1px_hsl(var(--primary)/0.3)_inset]"
                : "border-border/60 bg-card/60 hover:border-border",
            )}
          >
            <p className="font-mono text-xs text-muted-foreground">0{i + 1}</p>
            <p className="mt-1 font-semibold">{step.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
          </button>
        ))}
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl border border-border/60 bg-[#10100f] p-5 text-[#e5e5de]"
      >
        <p className="mb-3 font-mono text-xs text-[#969688]">algoTrace_live_view.log</p>
        <div className="space-y-2 font-mono text-sm">
          {steps[active].panel.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

