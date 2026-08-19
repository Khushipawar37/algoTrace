"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell/AppShell";
import { ArrowLeft, ArrowUpRight, Compass, Target } from "lucide-react";

interface ProblemInSequence {
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  why: string;
}

const FOUNDATION_PROBLEMS: ProblemInSequence[] = [
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    difficulty: "Easy",
    why: "Introduces basic set membership lookup in O(1) time.",
  },
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    why: "Introduces value-to-index complement mapping.",
  },
  {
    title: "Valid Anagram",
    slug: "valid-anagram",
    difficulty: "Easy",
    why: "Demonstrates character frequency counting.",
  },
];

const APPLY_PROBLEMS: ProblemInSequence[] = [
  {
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: "Medium",
    why: "Practices custom tuple / sorted string keys as map targets.",
  },
  {
    title: "Top K Frequent Elements",
    slug: "top-k-frequent-elements",
    difficulty: "Medium",
    why: "Combines frequency hash map with bucket sorting.",
  },
];

const COMBINE_PROBLEMS: ProblemInSequence[] = [
  {
    title: "Subarray Sum Equals K",
    slug: "subarray-sum-equals-k",
    difficulty: "Medium",
    why: "Applies prefix sum differences inside a frequency map.",
  },
  {
    title: "Longest Consecutive Sequence",
    slug: "longest-consecutive-sequence",
    difficulty: "Medium",
    why: "Uses hash set for O(1) sequence boundary verification.",
  },
];

export default function TopicPage() {
  const params = useParams();
  const topicId = (params?.topic as string) || "hashing";

  const topicTitle = topicId.charAt(0).toUpperCase() + topicId.slice(1);

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
        {/* Top bar back button */}
        <div>
          <Link
            href={"/learn" as any}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-olive hover:text-smoky transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Learning Paths</span>
          </Link>

          {/* Hero Banner */}
          <div className="p-8 md:p-10 rounded-[28px] border border-smoky/20 bg-smoky text-floral shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-bone/20 pb-4">
              <div>
                <span className="font-mono text-xs text-bone tracking-widest uppercase block mb-1">
                  TOPIC MODULE
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold font-sans text-floral">
                  {topicTitle} &amp; State Lookup
                </h1>
              </div>

              <span className="font-mono text-xs px-3 py-1 rounded-full bg-bone text-smoky font-bold">
                18 / 25 PROBLEMS SOLVED
              </span>
            </div>

            <blockquote className="text-xl md:text-2xl font-serif italic text-bone">
              &ldquo;Use stored state to replace repeated search.&rdquo;
            </blockquote>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
              <div className="p-4 rounded-btn border border-bone/20 bg-[#171812]">
                <span className="text-bone/70 block uppercase mb-1">CONCEPT STRENGTH</span>
                <span className="font-bold text-floral text-sm">Strong (84%)</span>
              </div>
              <div className="p-4 rounded-btn border border-bone/20 bg-[#171812]">
                <span className="text-bone/70 block uppercase mb-1">TARGET WEAKNESS</span>
                <span className="font-bold text-bone text-sm">Prefix-state modelling</span>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Sequence Sections */}
        <div className="space-y-10">
          {/* Foundation */}
          <div className="space-y-4">
            <div className="border-b border-smoky/10 pb-2">
              <span className="font-mono text-xs text-olive tracking-widest uppercase font-bold">
                STAGE 01 • FOUNDATION PATTERNS
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FOUNDATION_PROBLEMS.map((prob) => (
                <Link
                  key={prob.slug}
                  href={`/problems/${prob.slug}` as any}
                  className="p-6 rounded-[22px] border border-smoky/15 bg-floral hover:border-smoky/40 hover:bg-bone/20 transition-all flex flex-col justify-between space-y-4 group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 font-mono text-xs">
                      <span className="px-2.5 py-0.5 rounded-full border border-smoky/20 bg-bone/30 text-smoky">
                        {prob.difficulty}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-olive group-hover:text-smoky" />
                    </div>
                    <h3 className="text-lg font-bold font-sans text-smoky mb-2">
                      {prob.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-smoky/10">
                    <span className="font-mono text-[10px] text-olive uppercase block mb-1">
                      WHY THIS PROBLEM:
                    </span>
                    <p className="text-xs font-sans text-smoky/90">
                      {prob.why}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Apply */}
          <div className="space-y-4">
            <div className="border-b border-smoky/10 pb-2">
              <span className="font-mono text-xs text-olive tracking-widest uppercase font-bold">
                STAGE 02 • APPLY PATTERNS
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {APPLY_PROBLEMS.map((prob) => (
                <Link
                  key={prob.slug}
                  href={`/problems/${prob.slug}` as any}
                  className="p-6 rounded-[22px] border border-smoky/15 bg-floral hover:border-smoky/40 hover:bg-bone/20 transition-all flex flex-col justify-between space-y-4 group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 font-mono text-xs">
                      <span className="px-2.5 py-0.5 rounded-full border border-smoky bg-smoky text-floral">
                        {prob.difficulty}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-olive group-hover:text-smoky" />
                    </div>
                    <h3 className="text-lg font-bold font-sans text-smoky mb-2">
                      {prob.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-smoky/10">
                    <span className="font-mono text-[10px] text-olive uppercase block mb-1">
                      WHY THIS PROBLEM:
                    </span>
                    <p className="text-xs font-sans text-smoky/90">
                      {prob.why}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Combine */}
          <div className="space-y-4">
            <div className="border-b border-smoky/10 pb-2">
              <span className="font-mono text-xs text-olive tracking-widest uppercase font-bold">
                STAGE 03 • COMBINE PATTERNS
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {COMBINE_PROBLEMS.map((prob) => (
                <Link
                  key={prob.slug}
                  href={`/problems/${prob.slug}` as any}
                  className="p-6 rounded-[22px] border border-smoky/15 bg-floral hover:border-smoky/40 hover:bg-bone/20 transition-all flex flex-col justify-between space-y-4 group shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 font-mono text-xs">
                      <span className="px-2.5 py-0.5 rounded-full border border-smoky bg-smoky text-floral">
                        {prob.difficulty}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-olive group-hover:text-smoky" />
                    </div>
                    <h3 className="text-lg font-bold font-sans text-smoky mb-2">
                      {prob.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-smoky/10">
                    <span className="font-mono text-[10px] text-olive uppercase block mb-1">
                      WHY THIS PROBLEM:
                    </span>
                    <p className="text-xs font-sans text-smoky/90">
                      {prob.why}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
