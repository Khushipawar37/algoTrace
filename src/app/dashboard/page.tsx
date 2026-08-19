"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { ArrowRight, RotateCcw, ChevronRight } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

const RECOMMENDED_PROBLEMS = [
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",
    topic: "Hashing",
    reason: "Reinforce frequency-map reasoning.",
  },
  {
    title: "Longest Repeating Character Replacement",
    slug: "longest-repeating-character-replacement",
    difficulty: "Medium",
    topic: "Sliding Window",
    reason: "Practice defining shrink conditions.",
  },
  {
    title: "Search in Rotated Sorted Array",
    slug: "search-in-rotated-sorted-array",
    difficulty: "Medium",
    topic: "Binary Search",
    reason: "Revisit boundary updates.",
  },
];

const LEARNING_SIGNALS = [
  {
    topic: "Binary Search",
    status: "Needs attention",
    detail: "Boundary updates caused issues in 3 recent attempts.",
    level: "warning",
  },
  {
    topic: "Hashing",
    status: "Strong",
    detail: "Recent problems solved with little or no guidance.",
    level: "success",
  },
  {
    topic: "Dynamic Programming",
    status: "Developing",
    detail: "Recurrence is usually identified before the state definition.",
    level: "info",
  },
];

function DashboardHeader() {
  const { displayName } = useCurrentUser();
  return (
    <div>
      <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
        STUDENT DASHBOARD
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-smoky">
        {displayName ? `Good evening, ${displayName}.` : `Welcome to AlgoTrace.`}
      </h1>
      <p className="text-sm font-sans text-olive mt-1.5">
        Continue building the thinking patterns behind your solutions.
      </p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <Suspense fallback={
          <div>
            <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">STUDENT DASHBOARD</span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-smoky">Welcome to AlgoTrace.</h1>
          </div>
        }>
          <DashboardHeader />
        </Suspense>

        {/* Section 7: CONTINUE SOLVING (Dominant Block) */}
        <div className="p-8 md:p-10 rounded-[28px] border border-smoky/20 bg-smoky text-floral shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-bone/20 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-bone animate-pulse" />
              <span className="font-mono text-xs text-bone uppercase tracking-widest font-semibold">
                CONTINUE SOLVING
              </span>
            </div>
            <span className="font-mono text-xs text-bone/70">IN PROGRESS</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Content (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded-full border border-bone/30 text-bone uppercase">
                    Medium
                  </span>
                  <span className="text-bone/70">•</span>
                  <span className="text-bone/80">Sliding Window</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-sans text-floral">
                  Longest Substring Without Repeating Characters
                </h2>
              </div>

              {/* Diagnostic Box */}
              <div className="p-5 rounded-btn bg-[#171812] border border-bone/30 space-y-2">
                <span className="font-mono text-[10px] text-bone/70 uppercase tracking-wider block">
                  ALGOTRACE DIAGNOSTIC STATUS:
                </span>
                <blockquote className="text-base font-serif italic text-floral">
                  &ldquo;You identified the window, but haven&apos;t yet defined when the left pointer should move.&rdquo;
                </blockquote>
              </div>

              {/* Status Metadata & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-4 text-xs font-mono text-bone/80">
                  <span>Last attempt · 2 hours ago</span>
                  <span>•</span>
                  <span>Guidance reached · 02 / 05</span>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-btn border border-bone/30 text-bone text-xs font-mono hover:text-floral hover:bg-bone/10 transition-colors flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Start over</span>
                  </button>

                  <Link
                    href={"/problems/longest-substring-without-repeating-characters" as any}
                    className="group px-6 py-2.5 rounded-btn bg-bone text-smoky text-xs font-mono font-bold hover:bg-floral transition-all flex items-center gap-2 shadow-md"
                  >
                    <span>Continue problem</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Trace Mini Timeline (4 Cols) */}
            <div className="lg:col-span-4 p-5 rounded-btn border border-bone/20 bg-[#191A14] space-y-4">
              <span className="font-mono text-xs text-bone tracking-wider uppercase block border-b border-bone/15 pb-2">
                SESSION TRACE SNEAK PEEK
              </span>

              <div className="relative pl-4 space-y-3 font-mono text-xs">
                <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-bone/20" />

                <div className="relative flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-bone/40 -ml-[11px]" />
                  <span className="text-bone/70">16:10 Attempt 01 (Nested loop)</span>
                </div>

                <div className="relative flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-bone -ml-[11px]" />
                  <span className="text-bone font-semibold">16:14 Guidance 01 (Window expansion)</span>
                </div>

                <div className="relative flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-bone/60 -ml-[11px]" />
                  <span className="text-bone/90">16:22 Attempt 02 (Map insert)</span>
                </div>

                <div className="relative flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-bone -ml-[11px]" />
                  <span className="text-bone font-semibold">16:28 Guidance 02 (Shrink condition)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 8: RECOMMENDED NEXT */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-smoky/10 pb-3">
            <div>
              <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-0.5">
                PEDAGOGICAL REASONING PATHWAY
              </span>
              <h2 className="text-xl font-bold tracking-tight text-smoky">
                Recommended next
              </h2>
            </div>
            <Link
              href={"/problems" as any}
              className="font-mono text-xs text-olive hover:text-smoky transition-colors flex items-center gap-1"
            >
              <span>View all problems</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECOMMENDED_PROBLEMS.map((prob) => (
              <Link
                key={prob.slug}
                href={`/problems/${prob.slug}` as any}
                className="p-6 rounded-[22px] border border-smoky/15 bg-bone/20 hover:border-smoky/40 hover:bg-bone/40 transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3 font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded-full border border-smoky/20 bg-floral text-smoky uppercase">
                      {prob.difficulty}
                    </span>
                    <span className="text-olive">{prob.topic}</span>
                  </div>

                  <h3 className="text-lg font-bold font-sans text-smoky group-hover:text-olive transition-colors mb-2">
                    {prob.title}
                  </h3>
                </div>

                <div className="pt-3 border-t border-smoky/10">
                  <span className="font-mono text-[10px] text-olive uppercase block mb-1">
                    WHY THIS PROBLEM:
                  </span>
                  <p className="text-xs font-sans text-smoky/90 font-medium">
                    &ldquo;{prob.reason}&rdquo;
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 9: CURRENT LEARNING SIGNALS */}
        <div className="p-8 rounded-[24px] border border-smoky/15 bg-floral space-y-6">
          <div className="flex items-center justify-between border-b border-smoky/10 pb-4">
            <div>
              <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
                COGNITIVE OBSERVATION LOG
              </span>
              <h2 className="text-xl font-bold tracking-tight text-smoky">
                What AlgoTrace has noticed
              </h2>
            </div>
            <span className="font-mono text-xs text-olive">UPDATED RECENTLY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LEARNING_SIGNALS.map((sig, idx) => (
              <div
                key={idx}
                className="p-5 rounded-btn border border-smoky/15 bg-bone/30 space-y-3"
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-smoky">{sig.topic}</span>
                  <span className="px-2 py-0.5 rounded border border-smoky/20 bg-floral text-smoky text-[10px] uppercase font-semibold">
                    {sig.status}
                  </span>
                </div>
                <p className="text-xs font-sans text-olive leading-relaxed">
                  {sig.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
