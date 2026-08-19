"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { RotateCcw, ArrowRight, Brain, Clock, ShieldAlert } from "lucide-react";

const REVISION_ITEMS = [
  {
    id: 1,
    title: "Binary Search Boundaries",
    tag: "PATTERN RECURRENCE",
    reason: "You commonly update the boundary without excluding mid.",
    problems: ["First Bad Version", "Search Insert Position"],
    actionLabel: "Retry without guidance →",
    actionSlug: "search-in-rotated-sorted-array",
  },
  {
    id: 2,
    title: "Sliding Window Shrink Condition",
    tag: "HIGH GUIDANCE DEPENDENCY",
    reason: "Your last solve required Guidance Level 04 scaffold.",
    problems: ["Longest Substring Without Repeating Characters"],
    actionLabel: "Retry independently →",
    actionSlug: "longest-substring-without-repeating-characters",
  },
  {
    id: 3,
    title: "Long-term Recall — Hash Mapping",
    tag: "SPACED REPETITION (21 DAYS)",
    reason: "You solved this 21 days ago and haven't revisited the frequency-map pattern.",
    problems: ["Valid Anagram", "Group Anagrams"],
    actionLabel: "Quick revisit →",
    actionSlug: "two-sum",
  },
];

export default function RevisionPage() {
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-smoky/10 pb-6">
          <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
            SPACED REPETITION ENGINE
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-smoky">
            Revision Queue
          </h1>
          <p className="text-sm font-sans text-olive mt-1">
            Problems worth seeing again—not just problems you haven&apos;t solved.
          </p>
        </div>

        {/* Revision Queue List */}
        <div className="space-y-6">
          {REVISION_ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-[24px] border border-smoky/15 bg-floral hover:border-smoky/40 transition-all shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-bone border border-smoky/20 text-smoky font-bold uppercase">
                    {item.tag}
                  </span>
                </div>

                <h2 className="text-2xl font-bold font-sans text-smoky">
                  {item.title}
                </h2>

                <blockquote className="text-base font-serif italic text-olive">
                  &ldquo;{item.reason}&rdquo;
                </blockquote>

                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs text-olive">
                  <span>Related attempts:</span>
                  {item.problems.map((p) => (
                    <span key={p} className="px-2.5 py-0.5 rounded border border-smoky/15 bg-bone/20 text-smoky">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 md:pt-0 border-t md:border-t-0 border-smoky/10">
                <Link
                  href={`/problems/${item.actionSlug}` as any}
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-btn bg-smoky text-floral text-xs font-mono font-bold hover:bg-olive transition-colors shadow-md"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
