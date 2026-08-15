"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";

const BROKEN_LOOP = [
  { step: "WATCH", desc: "Watch video solution" },
  { step: "TRY", desc: "Attempt implementation" },
  { step: "GET STUCK", desc: "Hit boundary or logic error", accent: true },
  { step: "OPEN SOLUTION", desc: "Copy LeetCode solution" },
  { step: "UNDERSTAND", desc: "Feels clear in the moment" },
  { step: "FORGET", desc: "Stuck again 2 days later" },
];

const ALGOTRACE_LOOP = [
  { step: "GET STUCK", desc: "Hit boundary or logic error" },
  { step: "DIAGNOSE", desc: "AlgoTrace analyzes reasoning gap" },
  { step: "THINK", desc: "Minimal Socratic question asked" },
  { step: "TRY AGAIN", desc: "Student adjusts approach" },
  { step: "DISCOVER", desc: "Pattern recognized independently" },
  { step: "SOLVE", desc: "Enduring skill developed", success: true },
];

export function LearningLoop() {
  const [activeBrokenIndex, setActiveBrokenIndex] = useState(2);
  const [activeAlgoIndex, setActiveAlgoIndex] = useState(4);

  return (
    <section id="how-it-works" className="relative bg-smoky text-floral py-28 px-6 md:px-12 border-t border-olive/30">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Heading */}
        <div className="max-w-4xl mb-20">
          <div className="flex items-center gap-2 font-mono text-xs text-bone tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-bone" />
            <span>THE COGNITIVE CYCLE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-floral mb-6">
            Understanding someone else&apos;s solution isn&apos;t the same as learning to solve.
          </h2>
          <p className="text-lg text-bone/70 max-w-2xl font-normal leading-relaxed">
            Most platforms push students toward immediate code reveals. This bypasses the critical mental friction where actual algorithmic intuition is forged.
          </p>
        </div>

        {/* Part 1: The Broken Traditional Loop */}
        <div className="mb-20 p-8 md:p-12 rounded-[24px] border border-olive/30 bg-[#171812] relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-olive/30">
            <div>
              <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
                TRADITIONAL PRACTICE CYCLE
              </span>
              <h3 className="text-2xl font-bold text-floral">The Passive Loop</h3>
            </div>
            <span className="font-mono text-xs text-olive border border-olive/40 px-3 py-1 rounded-full">
              RESULT: PSEUDO-COMPREHENSION
            </span>
          </div>

          {/* Steps horizontal/grid flow */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
            {BROKEN_LOOP.map((item, idx) => {
              const isActive = idx === activeBrokenIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveBrokenIndex(idx)}
                  className={`p-4 rounded-btn border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[130px] ${
                    isActive
                      ? "border-bone bg-bone/10 text-floral shadow-lg"
                      : "border-olive/20 bg-smoky/60 text-olive hover:border-olive/60"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="opacity-50">0{idx + 1}</span>
                    {idx < BROKEN_LOOP.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-olive" />
                    )}
                    {idx === BROKEN_LOOP.length - 1 && (
                      <RotateCcw className="w-3 h-3 text-olive" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`font-mono text-sm font-bold tracking-wider uppercase mb-1 ${
                        item.accent ? "text-bone underline underline-offset-4" : ""
                      }`}
                    >
                      {item.step}
                    </h4>
                    <p className="text-xs text-bone/70 leading-snug">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-mono text-olive pt-4 border-t border-olive/20">
            <span>PASSTHROUGH MEMORIZATION</span>
            <span className="italic">&ldquo;I knew this solution on LeetCode yesterday, but I&apos;m stuck again.&rdquo;</span>
          </div>
        </div>

        {/* Interruption Statement */}
        <div className="my-16 text-center max-w-3xl mx-auto py-8 border-y border-olive/30 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-bone/10 blur-xl pointer-events-none" />
          <p className="font-mono text-xs tracking-[0.3em] text-bone uppercase mb-2">
            THE ALGOTRACE INTERVENTION
          </p>
          <h3 className="text-2xl sm:text-3xl font-serif italic text-floral">
            AlgoTrace changes what happens after &ldquo;Get stuck.&rdquo;
          </h3>
        </div>

        {/* Part 2: The AlgoTrace Loop */}
        <div className="p-8 md:p-12 rounded-[24px] border border-bone/40 bg-bone/5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-olive/30">
            <div>
              <span className="font-mono text-xs text-bone tracking-widest uppercase block mb-1">
                ALGOTRACE SOCRATIC CYCLE
              </span>
              <h3 className="text-2xl font-bold text-floral">The Productive Struggle Path</h3>
            </div>
            <span className="font-mono text-xs text-smoky bg-bone px-3 py-1 rounded-full font-semibold">
              RESULT: GENUINE RETENTION
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
            {ALGOTRACE_LOOP.map((item, idx) => {
              const isActive = idx === activeAlgoIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveAlgoIndex(idx)}
                  className={`p-4 rounded-btn border transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[130px] ${
                    isActive
                      ? "border-bone bg-bone text-smoky font-medium shadow-xl scale-[1.02]"
                      : "border-olive/30 bg-smoky/90 text-bone/80 hover:border-bone/60"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className={isActive ? "text-smoky/60" : "text-olive"}>
                      0{idx + 1}
                    </span>
                    {idx < ALGOTRACE_LOOP.length - 1 && (
                      <ArrowRight
                        className={`w-3 h-3 ${isActive ? "text-smoky" : "text-olive"}`}
                      />
                    )}
                    {idx === ALGOTRACE_LOOP.length - 1 && (
                      <Sparkles
                        className={`w-3 h-3 ${isActive ? "text-smoky" : "text-bone"}`}
                      />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`font-mono text-sm font-bold tracking-wider uppercase mb-1 ${
                        isActive ? "text-smoky" : "text-floral"
                      }`}
                    >
                      {item.step}
                    </h4>
                    <p
                      className={`text-xs leading-snug ${
                        isActive ? "text-smoky/80" : "text-bone/70"
                      }`}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-mono text-bone pt-4 border-t border-olive/30">
            <span>ACTIVE REASONING DISCOVERY</span>
            <span className="italic">&ldquo;I didn&apos;t just read the answer. I figured it out myself.&rdquo;</span>
          </div>
        </div>
      </div>
    </section>
  );
}
