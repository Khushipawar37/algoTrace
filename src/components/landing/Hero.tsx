"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronRight, Play, Sparkles, Check, Code2 } from "lucide-react";

interface HeroDemoStep {
  id: number;
  label: string;
  code: string;
  highlightLine: number;
  guidanceText1: string;
  guidanceText2: string;
  footerNote: string;
  complexity: string;
}

const HERO_DEMO_STEPS: HeroDemoStep[] = [
  {
    id: 1,
    label: "GUIDANCE 01",
    code: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        // what should happen next?
    }
}`,
    highlightLine: 2,
    guidanceText1: "Outer loop selects the current element nums[i].",
    guidanceText2: "For nums[i], what value would complete the target?",
    footerNote: "Think about repeated work in nested loops.",
    complexity: "O(N²)",
  },
  {
    id: 2,
    label: "GUIDANCE 02",
    code: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
    }
}`,
    highlightLine: 3,
    guidanceText1: "Complement derived for current element.",
    guidanceText2: "Where could past values live for instant lookup?",
    footerNote: "What data structure enables O(1) retrieval?",
    complexity: "O(N²)",
  },
  {
    id: 3,
    label: "GUIDANCE 03 — OPTIMAL",
    code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
}`,
    highlightLine: 5,
    guidanceText1: "Hash map memoization introduced.",
    guidanceText2: "Nested O(N²) scans transformed into a single linear O(N) pass.",
    footerNote: "Reasoning preserved. Solution achieved.",
    complexity: "O(N)",
  },
];

export function Hero() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAutoCycling, setIsAutoCycling] = useState(true);

  useEffect(() => {
    if (!isAutoCycling) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % HERO_DEMO_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoCycling]);

  const step = HERO_DEMO_STEPS[activeStepIndex];

  return (
    <section className="relative min-h-[92vh] bg-floral text-smoky pt-32 pb-16 px-6 md:px-12 flex flex-col justify-between overflow-hidden">
      {/* Subtle background grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#11120D_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center py-6 z-10">
        {/* 2-Column Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Editorial Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Eyebrow Tag */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-smoky/15 bg-bone/30"
            >
              <span className="w-2 h-2 rounded-full bg-smoky animate-pulse" />
              <span className="font-mono text-xs tracking-wider text-smoky font-semibold uppercase">
                THE DSA TUTOR THAT DOESN&apos;T GIVE AWAY THE ANSWER
              </span>
            </motion.div>

            {/* Giant Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.2rem] font-bold tracking-tight leading-[0.96]"
            >
              Get unstuck. <br />
              Without giving up <br />
              <span className="font-serif italic font-normal text-olive block mt-1">
                the answer.
              </span>
            </motion.h1>

            {/* Subheading / Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-olive max-w-xl font-normal leading-relaxed"
            >
              AlgoTrace studies your reasoning, code, errors and attempts to give you the next useful hint—not the final solution.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                href="/workspace"
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-btn bg-smoky text-floral text-base font-semibold transition-all duration-300 hover:bg-olive hover:-translate-y-0.5 active:translate-y-0 shadow-md"
              >
                <span>Solve your first problem</span>
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <a
                href="#how-it-works"
                className="group inline-flex items-center gap-2 px-6 py-4 rounded-btn border border-smoky/20 text-smoky text-base font-medium transition-all duration-300 hover:border-smoky hover:bg-bone/30"
              >
                <span>See how AlgoTrace thinks</span>
                <span className="font-mono text-sm group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </motion.div>

            {/* Philosophy Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 border-t border-smoky/10 flex flex-wrap items-center gap-6 text-xs font-mono text-olive uppercase tracking-wider"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-smoky" />
                <span>NO SOLUTION LEAKS</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-smoky" />
                <span>SOCRATIC AST TRACE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-smoky" />
                <span>PRESERVED STRUGGLE</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive Tutor Simulation Widget (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            {/* Outer Glow */}
            <div className="absolute -inset-2 bg-bone/40 rounded-[28px] blur-xl opacity-60 pointer-events-none" />

            {/* Main Interactive Widget Canvas */}
            <div className="relative rounded-[24px] border border-bone/30 bg-smoky text-floral p-6 md:p-7 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-bone/20 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-bone animate-pulse" />
                  <span className="font-mono text-xs text-bone uppercase tracking-widest font-semibold">
                    LIVE TUTOR DEMO
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-bone/10 px-2.5 py-1 rounded border border-bone/20">
                  <Code2 className="w-3.5 h-3.5 text-bone" />
                  <span className="font-mono text-[11px] text-bone font-semibold">Two Sum</span>
                </div>
              </div>

              {/* Guidance Step Tabs */}
              <div className="flex items-center gap-1.5 bg-bone/10 p-1 rounded-btn border border-bone/20 mb-5">
                {HERO_DEMO_STEPS.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setIsAutoCycling(false);
                      setActiveStepIndex(idx);
                    }}
                    className={`flex-1 py-1.5 px-2 rounded font-mono text-[11px] font-semibold transition-all ${
                      activeStepIndex === idx
                        ? "bg-bone text-smoky shadow-sm"
                        : "text-bone/70 hover:text-floral"
                    }`}
                  >
                    0{s.id}
                  </button>
                ))}
              </div>

              {/* Code Snippet Box */}
              <div className="p-4 rounded-btn bg-[#171812] border border-bone/25 font-mono text-xs leading-relaxed text-bone/95 mb-5 overflow-x-auto relative">
                <div className="flex items-center justify-between text-[10px] text-bone/60 border-b border-bone/15 pb-2 mb-3">
                  <span>workspace.cpp</span>
                  <span>C++20</span>
                </div>

                <pre className="whitespace-pre">
                  {step.code.split("\n").map((line, idx) => {
                    const lineNum = idx + 1;
                    const isHigh = lineNum === step.highlightLine;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                          isHigh ? "bg-bone/20 text-floral border-l-2 border-bone" : ""
                        }`}
                      >
                        <span className="w-6 text-bone/40 select-none text-[10px] text-right pr-3 pt-0.5">
                          {lineNum}
                        </span>
                        <span className="flex-1 font-mono">{line}</span>
                      </div>
                    );
                  })}
                </pre>
              </div>

              {/* Guidance Response Container */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3.5"
                >
                  <div className="p-4 rounded-btn border border-bone/30 bg-bone/10">
                    <span className="font-mono text-[10px] text-bone/70 uppercase tracking-wider block mb-1">
                      {step.label} • SOCRATIC PROMPT
                    </span>
                    <p className="text-sm font-serif italic text-floral leading-snug">
                      &ldquo;{step.guidanceText2}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-bone/80 px-1">
                    <span>COMPLEXITY: {step.complexity}</span>
                    <span>AST VERIFIED</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Button to Next Step */}
              <div className="mt-5 pt-4 border-t border-bone/20 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsAutoCycling(false);
                    setActiveStepIndex((prev) => (prev + 1) % HERO_DEMO_STEPS.length);
                  }}
                  className="w-full group inline-flex items-center justify-between px-4 py-2.5 rounded-btn bg-bone text-smoky text-xs font-semibold transition-all hover:bg-floral"
                >
                  <span>Need another nudge?</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
