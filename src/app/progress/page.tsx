"use client";

import React from "react";
import { AppShell } from "@/components/app-shell/AppShell";
import { TrendingDown, Award, Brain, CheckCircle2 } from "lucide-react";

const PRIMARY_METRICS = [
  { val: "42", label: "Problems solved" },
  { val: "18", label: "Independent solves" },
  { val: "16", label: "Light-guidance solves" },
  { val: "8", label: "Heavy-guidance solves" },
];

const GUIDANCE_TREND = [
  { week: "Week 1", val: 3.8 },
  { week: "Week 2", val: 2.9 },
  { week: "Week 3", val: 2.1 },
  { week: "Week 4", val: 1.4 },
];

const TOPIC_STRENGTHS = [
  { name: "Hashing", status: "Strong" },
  { name: "Arrays", status: "Strong" },
  { name: "Sliding Window", status: "Developing" },
  { name: "Binary Search", status: "Needs practice" },
  { name: "Dynamic Programming", status: "Beginning" },
];

const OBSERVED_PATTERNS = [
  "Boundary handling appears in 5 failed attempts across Binary Search.",
  "Duplicate handling has improved across the last 4 hashing problems.",
  "Your average time before requesting Hint 01 increased from 3.2m to 5.8m this week.",
];

export default function ProgressPage() {
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-smoky/10 pb-6">
          <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
            EDITORIAL METRICS
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-smoky">
            Progress &amp; Autonomy
          </h1>
          <p className="text-sm font-sans text-olive mt-1">
            Tracking your transition from guided assistance to independent algorithmic intuition.
          </p>
        </div>

        {/* Primary Metrics Grid (Section 31) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {PRIMARY_METRICS.map((m, i) => (
            <div
              key={i}
              className="p-6 rounded-[22px] border border-smoky/15 bg-bone/20 flex flex-col justify-between space-y-3"
            >
              <span className="font-mono text-4xl sm:text-5xl font-extrabold text-smoky">
                {m.val}
              </span>
              <span className="font-mono text-xs text-olive font-semibold uppercase">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Guidance Dependency Trend (Section 32) */}
        <div className="p-8 md:p-10 rounded-[28px] border border-smoky/20 bg-smoky text-floral shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-bone/20 pb-4">
            <div>
              <span className="font-mono text-xs text-bone uppercase tracking-widest block mb-1">
                AUTONOMY METRIC
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif italic text-floral">
                You&apos;re relying on hints less.
              </h2>
            </div>
            <span className="font-mono text-xs text-bone font-bold border border-bone/30 px-3 py-1 rounded-full">
              -63% GUIDANCE DEMAND
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            <span className="text-bone/70 uppercase tracking-wider block">
              AVERAGE GUIDANCE STEPS PER SOLVED PROBLEM
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {GUIDANCE_TREND.map((gt) => (
                <div key={gt.week} className="p-4 rounded-btn border border-bone/20 bg-[#171812] space-y-2">
                  <span className="text-bone/70 block">{gt.week}</span>
                  <span className="text-3xl font-bold font-mono text-floral block">{gt.val}</span>
                  <div className="w-full h-1.5 bg-smoky rounded-full overflow-hidden">
                    <div
                      className="h-full bg-bone"
                      style={{ width: `${(gt.val / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Topic Development (Section 33) */}
        <div className="p-8 rounded-[24px] border border-smoky/15 bg-floral space-y-6">
          <div className="border-b border-smoky/10 pb-4">
            <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
              TOPIC MASTERY STATUS
            </span>
            <h2 className="text-xl font-bold tracking-tight text-smoky">
              Topic Development
            </h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {TOPIC_STRENGTHS.map((t) => (
              <div
                key={t.name}
                className="p-4 rounded-btn border border-smoky/15 bg-bone/20 flex items-center justify-between"
              >
                <span className="font-bold text-smoky text-sm">{t.name}</span>
                <span className="px-3 py-1 rounded-full border border-smoky/20 bg-floral text-smoky font-semibold">
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recurring Patterns Observed (Section 34) */}
        <div className="p-8 rounded-[24px] border border-smoky/15 bg-bone/30 space-y-6">
          <div className="border-b border-smoky/10 pb-4">
            <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
              OBSERVATIONAL INSIGHTS
            </span>
            <h2 className="text-xl font-bold tracking-tight text-smoky">
              Patterns AlgoTrace has observed
            </h2>
          </div>

          <div className="space-y-3 font-sans text-sm">
            {OBSERVED_PATTERNS.map((p, i) => (
              <div key={i} className="p-4 rounded-btn bg-floral border border-smoky/15 text-smoky leading-relaxed flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-smoky mt-1.5 flex-shrink-0" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
