"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronRight, Check } from "lucide-react";

interface DemoStep {
  id: number;
  code: string;
  highlightLine?: number;
  analyzing?: boolean;
  guidanceStep: string;
  guidanceText1: string;
  guidanceText2: string;
  guidanceFooter: string;
  studentAddition?: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    code: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        // what should happen next?
    }
}`,
    highlightLine: 2,
    guidanceStep: "GUIDANCE 01 / 05",
    guidanceText1: "Your outer loop already chooses the first value.",
    guidanceText2: "For nums[i], what value would complete the target?",
    guidanceFooter: "Think about repeated work.",
  },
  {
    id: 2,
    code: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        // Tracing outer loop logic...
    }
}`,
    analyzing: true,
    highlightLine: 2,
    guidanceStep: "ANALYZING APPROACH...",
    guidanceText1: "Observing iteration pattern across array elements.",
    guidanceText2: "Are you planning a second loop to search for the complement?",
    guidanceFooter: "Consider the time complexity of nested iteration.",
  },
  {
    id: 3,
    code: `vector<int> twoSum(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
    }
}`,
    highlightLine: 3,
    guidanceStep: "GUIDANCE 02 / 05",
    guidanceText1: "Complement derived for current element.",
    guidanceText2: "Instead of scanning the remaining array, where could past values live?",
    guidanceFooter: "What data structure offers O(1) lookup?",
  },
  {
    id: 4,
    code: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
}`,
    highlightLine: 5,
    guidanceStep: "GUIDANCE 03 / 05 — OPTIMAL",
    guidanceText1: "Good. Now ask where previously seen values could be remembered.",
    guidanceText2: "You transformed nested O(n²) scans into a single linear O(n) pass.",
    guidanceFooter: "Reasoning preserved. Solution independently achieved.",
  },
];

export function HeroDemo() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const step = DEMO_STEPS[currentStepIndex];

  return (
    <section id="demo" className="relative bg-smoky text-floral py-24 px-6 md:px-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-olive/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-olive/30 pb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-bone tracking-widest uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-bone animate-pulse" />
              <span>LIVE SOCRATIC TUTOR INTERFACE</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-floral">
              How AlgoTrace guides your reasoning
            </h2>
          </div>

          {/* Controls */}
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-olive/40 bg-smoky text-xs font-mono text-bone hover:border-bone transition-colors"
            >
              {isAutoPlaying ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-bone" />
                  <span>PAUSE AUTO-DEMO</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  <span>PLAY AUTO-DEMO</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1 bg-olive/20 p-1 rounded-md border border-olive/40">
              {DEMO_STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentStepIndex(idx);
                  }}
                  className={`w-6 h-6 rounded text-xs font-mono transition-all ${
                    currentStepIndex === idx
                      ? "bg-bone text-smoky font-bold"
                      : "text-olive hover:text-floral"
                  }`}
                >
                  0{s.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Large Editor Canvas Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 rounded-[24px] border border-olive/40 bg-smoky/90 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Left: Code Editor Surface (7 Cols) */}
          <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-olive/30 p-6 md:p-8 flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Header metadata */}
              <div className="flex items-center justify-between border-b border-olive/20 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-olive/60" />
                    <span className="w-3 h-3 rounded-full bg-olive/40" />
                    <span className="w-3 h-3 rounded-full bg-olive/20" />
                  </div>
                  <span className="font-mono text-sm text-floral font-semibold ml-2">
                    Two Sum
                  </span>
                  <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full border border-olive/40 text-bone uppercase">
                    ARRAYS • EASY
                  </span>
                </div>
                <span className="font-mono text-xs text-olive">C++20</span>
              </div>

              {/* Code Snippet Area */}
              <div className="relative font-mono text-sm leading-relaxed tracking-wide">
                {step.analyzing && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                    className="absolute inset-x-0 h-[2px] bg-bone top-14 shadow-[0_0_12px_#D8CFBC]"
                  />
                )}

                <pre className="text-floral/90 overflow-x-auto whitespace-pre">
                  {step.code.split("\n").map((line, index) => {
                    const lineNum = index + 1;
                    const isHighlighted = step.highlightLine === lineNum;

                    return (
                      <div
                        key={index}
                        className={`flex items-start px-3 py-1 rounded transition-colors duration-300 ${
                          isHighlighted
                            ? "bg-bone/15 border-l-2 border-bone text-floral"
                            : "hover:bg-olive/10"
                        }`}
                      >
                        <span className="w-8 select-none text-olive/60 text-xs text-right pr-4 pt-0.5">
                          {lineNum}
                        </span>
                        <span className="flex-1 font-mono">{line}</span>
                      </div>
                    );
                  })}
                </pre>
              </div>
            </div>

            {/* Trace status banner */}
            <div className="mt-8 pt-4 border-t border-olive/20 flex items-center justify-between text-xs font-mono text-olive">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${step.analyzing ? "bg-bone animate-ping" : "bg-olive"}`} />
                <span>{step.analyzing ? "TRACING EXECUTION PATH..." : "AST & RUNTIME VERIFIED"}</span>
              </div>
              <span>COMPLEXITY: {currentStepIndex === 3 ? "O(N)" : "O(N²)"}</span>
            </div>
          </div>

          {/* Right: AlgoTrace Tutor Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-[#171812] p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Header badge */}
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs tracking-widest text-bone font-semibold uppercase px-2.5 py-1 rounded border border-bone/30 bg-bone/5">
                  {step.guidanceStep}
                </span>
                <span className="font-mono text-xs text-olive">REASONING GUARDIAN</span>
              </div>

              {/* Guidance content with animated transitions */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <p className="text-sm font-sans text-bone/80 leading-relaxed">
                    {step.guidanceText1}
                  </p>

                  <h3 className="text-xl md:text-2xl font-sans font-semibold text-floral leading-snug">
                    &ldquo;{step.guidanceText2}&rdquo;
                  </h3>

                  <div className="p-4 rounded-btn border border-olive/30 bg-smoky/60">
                    <p className="text-xs font-mono text-bone/90 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-bone" />
                      <span>{step.guidanceFooter}</span>
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Interactive button trigger */}
            <div className="mt-8 pt-6 border-t border-olive/30 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentStepIndex((prev) => (prev + 1) % DEMO_STEPS.length);
                }}
                className="w-full group inline-flex items-center justify-between px-5 py-3.5 rounded-btn bg-bone text-smoky text-sm font-semibold transition-all duration-300 hover:bg-floral"
              >
                <span>
                  {currentStepIndex === DEMO_STEPS.length - 1
                    ? "Restart Trace Sequence"
                    : "I need another nudge"}
                </span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
