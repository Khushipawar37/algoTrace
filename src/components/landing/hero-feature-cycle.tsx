"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const ROTATE_EVERY_MS = 3000;

const features = [
  {
    id: "01",
    title: "You start coding",
    desc: "The system captures your first keystroke latency and approach confidence.",
    panel: "code",
  },
  {
    id: "02",
    title: "Behavior is streamed as events",
    desc: "Pauses, rewrites, hint taps, and run attempts become timestamped signals.",
    panel: "events",
  },
  {
    id: "03",
    title: "ML model predicts weakness",
    desc: "Random Forest returns probability scores across core cognitive dimensions.",
    panel: "weakness",
  },
  {
    id: "04",
    title: "Coach intervenes intelligently",
    desc: "Socratic coach nudges with context-aware questions instead of direct answers.",
    panel: "coach",
  },
];

function renderPanel(panel: string) {
  if (panel === "code") {
    return (
      <div className="space-y-2 font-mono text-sm text-[#d7d7cf]">
        <p className="text-[#9e9e91]">def two_sum(nums, target):</p>
        <p>&nbsp;&nbsp;seen = &#123;&#125;</p>
        <p>&nbsp;&nbsp;for i, num in enumerate(nums):</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;comp = target - num</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;if comp in seen:</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;return [seen[comp], i]</p>
      </div>
    );
  }
  if (panel === "events") {
    return (
      <div className="space-y-2 font-mono text-sm text-[#d7d7cf]">
        <p>start_coding t+4.2s</p>
        <p>long_pause t+38s gap:35s</p>
        <p>run_attempt t+92s</p>
        <p>delete_heavy t+95s</p>
        <p>approach_change t+102s</p>
      </div>
    );
  }
  if (panel === "weakness") {
    return (
      <div className="space-y-3 text-sm text-[#d7d7cf]">
        {[
          ["Approach Finding", 62],
          ["Edge Case Detection", 78],
          ["Optimization", 41],
          ["Logical Errors", 26],
        ].map(([name, value]) => (
          <div key={String(name)}>
            <div className="mb-1 flex justify-between text-xs text-[#b2b2a7]">
              <span>{name}</span>
              <span>{value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#24241f]">
              <div className="h-1.5 rounded-full bg-[#d7b676]" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2 text-[15px] text-[#d7d7cf]">
      <p className="rounded-xl border border-[#2b2b26] bg-[#161612] p-3">
        I noticed a long pause after your loop. What uncertainty are you feeling right now?
      </p>
      <p className="rounded-xl border border-[#2b2b26] bg-[#161612] p-3">
        You are using nested loops. Can you reduce repeated lookup cost?
      </p>
      <p className="rounded-xl border border-[#3a311f] bg-[#18140f] p-3 text-[#d8bf8b]">
        maybe I can use a hashmap to store values I&apos;ve seen?
      </p>
    </div>
  );
}

export function HeroFeatureCycle() {
  const [active, setActive] = useState(0);
  const [remaining, setRemaining] = useState(ROTATE_EVERY_MS);
  const total = features.length;

  useEffect(() => {
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const left = ROTATE_EVERY_MS - elapsed;
      if (left <= 0) {
        setActive((prev) => (prev + 1) % total);
        setRemaining(ROTATE_EVERY_MS);
      } else {
        setRemaining(left);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [active, total]);

  const countdown = Math.max(1, Math.ceil(remaining / 1000));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-2">
        {features.map((feature, index) => (
          <button
            key={feature.title}
            onClick={() => setActive(index)}
            className={cn(
              "w-full rounded-2xl border p-6 text-left transition-all duration-300",
              active === index
                ? "border-primary/40 bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)_inset] dark:border-[#75613a] dark:bg-[#17140f]/70 dark:shadow-[0_0_0_1px_rgba(189,151,83,0.35)_inset]"
                : "border-border/60 bg-card/50 hover:border-primary/30 hover:bg-card/80",
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-xs text-primary/70 dark:text-[#8f8061]">{feature.id}</p>
              {active === index && (
                <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 font-mono text-[11px] text-primary dark:border-[#6f5a35] dark:bg-[#1b150d] dark:text-[#c9ab74]">
                  next in {countdown}s
                </span>
              )}
            </div>
            <p className="text-2xl font-semibold text-foreground">{feature.title}</p>
            <p className="mt-2 text-base text-muted-foreground">{feature.desc}</p>
          </button>
        ))}
      </div>

      {/* Terminal mock — always dark for authenticity */}
      <div className="overflow-hidden rounded-3xl border border-[#393225] bg-[#0f0d09]">
        <div className="flex items-center gap-2 border-b border-[#2b261d] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
          <span className="ml-3 font-mono text-sm text-[#8d887d]">two_sum.py — AlgoTrace</span>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2d2111] font-semibold text-[#ebca87]">
              A
            </div>
            <p className="font-semibold text-[#d9d7cf]">AlgoTrace Coach</p>
            <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
          </div>
          {renderPanel(features[active].panel)}
        </div>
      </div>
    </div>
  );
}
