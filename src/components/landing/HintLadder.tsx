"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LADDER_STEPS = [
  {
    level: "01",
    type: "Question",
    text: "What information are you recalculating?",
    caption: "Minimal intervention — directs attention to redundant computational steps.",
    tag: "LEVEL 01: SOCRATIC PROMPT",
  },
  {
    level: "02",
    type: "Observation",
    text: "You're searching previously visited values repeatedly.",
    caption: "Pattern identification — highlights the exact bottleneck in current code.",
    tag: "LEVEL 02: STRUCTURAL OBSERVATION",
  },
  {
    level: "03",
    type: "Direction",
    text: "Consider remembering information from values you've already seen.",
    caption: "Memory vs time trade-off — guides toward memoization concept without code.",
    tag: "LEVEL 03: ALGORITHMIC DIRECTION",
  },
  {
    level: "04",
    type: "Concept",
    text: "Constant-time lookup could remove the repeated scan.",
    caption: "Complexity target — sets clear computational expectation (O(1) search).",
    tag: "LEVEL 04: COMPLEXITY GOAL",
  },
  {
    level: "05",
    type: "Structure",
    text: "Abstract algorithmic scaffold",
    caption: "Abstract skeleton — structures reasoning without providing syntax.",
    tag: "LEVEL 05: ABSTRACT SCAFFOLD",
    isCode: true,
    codeSnippet: `FOR each value IN sequence
    derive complement target
    IF complement EXISTS IN memory THEN
        RETURN matched indices
    UPDATE memory WITH current value`,
  },
];

export function HintLadder() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="practice" className="relative bg-smoky text-floral py-28 px-6 md:px-12 border-t border-olive/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="max-w-3xl mb-20">
          <span className="font-mono text-xs text-bone tracking-widest uppercase block mb-3">
            SIGNATURE PROGRESSIVE LADDER
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-floral leading-[1.05]">
            Help should reveal itself slowly.
          </h2>
          <p className="text-lg text-bone/70 mt-4 font-normal max-w-xl">
            Each nudge moves you one step closer to the insight. You control how far down the ladder you need to descend.
          </p>
        </div>

        {/* Interactive Sticky / Ladder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Fixed Indicator (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 p-8 rounded-[24px] border border-olive/30 bg-[#171812]">
            <div className="flex items-center justify-between border-b border-olive/20 pb-4 mb-6">
              <span className="font-mono text-xs text-olive tracking-widest uppercase">
                PROGRESSION SCALE
              </span>
              <span className="font-mono text-xs text-bone font-bold">01 → 05</span>
            </div>

            <div className="space-y-3">
              {LADDER_STEPS.map((s, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={s.level}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full flex items-center justify-between p-4 rounded-btn border text-left transition-all duration-300 ${
                      isActive
                        ? "border-bone bg-bone text-smoky font-bold shadow-lg"
                        : "border-olive/20 bg-smoky/60 text-olive hover:border-olive/50 hover:text-floral"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs">{s.level}</span>
                      <span className="font-mono text-sm uppercase">{s.type}</span>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-smoky" : "bg-olive/40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-olive/20 text-xs font-mono text-olive leading-relaxed">
              Click or scroll to view how hints evolve from subtle Socratic questions to abstract scaffolding.
            </div>
          </div>

          {/* Right Steps Canvas (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {LADDER_STEPS.map((step, idx) => {
                const isActive = idx === activeIndex;
                if (!isActive) return null;

                return (
                  <motion.div
                    key={step.level}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="p-8 md:p-12 rounded-[24px] border border-bone/40 bg-[#191A14] text-floral shadow-2xl relative overflow-hidden min-h-[420px] flex flex-col justify-between"
                  >
                    {/* Background subtle watermark */}
                    <div className="absolute right-6 top-4 font-mono text-8xl font-black text-olive/10 select-none pointer-events-none">
                      {step.level}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-olive/30">
                        <span className="font-mono text-xs text-bone tracking-widest uppercase font-semibold">
                          {step.tag}
                        </span>
                        <span className="font-mono text-xs text-olive">
                          STEP {step.level} OF 05
                        </span>
                      </div>

                      {!step.isCode ? (
                        <h3 className="text-3xl md:text-4xl font-serif italic text-floral mb-8 leading-snug">
                          &ldquo;{step.text}&rdquo;
                        </h3>
                      ) : (
                        <div className="mb-8">
                          <p className="font-mono text-sm text-bone/90 mb-4">
                            {step.text}:
                          </p>
                          <div className="p-6 rounded-btn bg-smoky border border-olive/40 font-mono text-sm text-bone leading-relaxed">
                            <pre className="whitespace-pre overflow-x-auto">{step.codeSnippet}</pre>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-6 border-t border-olive/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-bone" />
                        <span className="font-mono text-xs text-bone">{step.caption}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={activeIndex === 0}
                          onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                          className="px-3 py-1.5 rounded border border-olive/40 text-xs font-mono text-olive hover:text-floral disabled:opacity-30 disabled:pointer-events-none"
                        >
                          ← PREV
                        </button>
                        <button
                          disabled={activeIndex === LADDER_STEPS.length - 1}
                          onClick={() => setActiveIndex((prev) => Math.min(LADDER_STEPS.length - 1, prev + 1))}
                          className="px-3 py-1.5 rounded bg-bone text-smoky font-bold text-xs font-mono hover:bg-floral disabled:opacity-30 disabled:pointer-events-none"
                        >
                          NEXT LEVEL →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
