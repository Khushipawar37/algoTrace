"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, ChevronRight, HelpCircle, AlertTriangle, XCircle, Clock } from "lucide-react";

interface TutorPanelProps {
  guidanceLevel?: number;
  onIncreaseGuidance?: () => void;
  currentState?: "normal" | "blank" | "partial" | "compile-error" | "wrong-answer" | "tle";
}

const LADDER = [
  { level: "01", name: "Socratic Prompt", desc: "Conceptual question" },
  { level: "02", name: "Observation", desc: "Bottleneck highlight" },
  { level: "03", name: "Direction", desc: "Algorithmic hint" },
  { level: "04", name: "Complexity", desc: "O(1) target" },
  { level: "05", name: "Scaffold", desc: "Abstract pseudocode" },
];

export function TutorPanel({
  guidanceLevel = 2,
  onIncreaseGuidance,
  currentState = "normal",
}: TutorPanelProps) {
  const [activeState, setActiveState] = useState<"normal" | "blank" | "partial" | "compile-error" | "wrong-answer" | "tle">(currentState);
  const [level, setLevel] = useState(guidanceLevel);

  const handleNextNudge = () => {
    const nextLevel = Math.min(5, level + 1);
    setLevel(nextLevel);
    if (onIncreaseGuidance) onIncreaseGuidance();
  };

  return (
    <div className="h-full bg-smoky text-floral flex flex-col justify-between p-6 space-y-6 overflow-y-auto font-sans">
      {/* Header Bar */}
      <div>
        <div className="flex items-center justify-between border-b border-bone/20 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-bone animate-pulse" />
            <span className="font-mono text-sm font-bold text-floral">
              Algo<span className="font-serif italic font-normal text-base text-bone">T</span>race
            </span>
          </div>
          <span className="font-mono text-xs text-bone/70 uppercase">
            FOLLOWING YOUR APPROACH
          </span>
        </div>

        {/* State Selector Quick Tabs */}
        <div className="flex items-center gap-1.5 bg-[#171812] p-1 rounded-btn border border-bone/20 font-mono text-[10px]">
          <button
            onClick={() => setActiveState("normal")}
            className={`px-2 py-1 rounded transition-colors ${activeState === "normal" ? "bg-bone text-smoky font-bold" : "text-bone/70"}`}
          >
            Normal
          </button>
          <button
            onClick={() => setActiveState("blank")}
            className={`px-2 py-1 rounded transition-colors ${activeState === "blank" ? "bg-bone text-smoky font-bold" : "text-bone/70"}`}
          >
            Blank
          </button>
          <button
            onClick={() => setActiveState("compile-error")}
            className={`px-2 py-1 rounded transition-colors ${activeState === "compile-error" ? "bg-bone text-smoky font-bold" : "text-bone/70"}`}
          >
            Error
          </button>
          <button
            onClick={() => setActiveState("wrong-answer")}
            className={`px-2 py-1 rounded transition-colors ${activeState === "wrong-answer" ? "bg-bone text-smoky font-bold" : "text-bone/70"}`}
          >
            Wrong
          </button>
          <button
            onClick={() => setActiveState("tle")}
            className={`px-2 py-1 rounded transition-colors ${activeState === "tle" ? "bg-bone text-smoky font-bold" : "text-bone/70"}`}
          >
            TLE
          </button>
        </div>
      </div>

      {/* Content depending on State */}
      <div className="flex-1 space-y-6">
        {activeState === "normal" && (
          <div className="space-y-6">
            {/* Current Understanding */}
            <div className="p-4 rounded-btn border border-bone/25 bg-[#171812] space-y-2">
              <span className="font-mono text-[10px] text-bone/70 uppercase tracking-wider block">
                CURRENT UNDERSTANDING
              </span>
              <p className="text-xs font-mono text-bone/90 leading-relaxed">
                &ldquo;You&apos;re checking each number against the elements that come after it.&rdquo;
              </p>
            </div>

            {/* What To Think About */}
            <div className="space-y-3">
              <span className="font-mono text-xs text-bone/80 uppercase tracking-widest block font-semibold">
                WHAT TO THINK ABOUT
              </span>

              <blockquote className="text-lg md:text-xl font-serif italic text-floral leading-snug">
                &ldquo;For nums[i], what value would complete the target?&rdquo;
              </blockquote>

              <p className="text-xs font-mono text-bone/80">
                Where could information about previously seen values live?
              </p>
            </div>
          </div>
        )}

        {activeState === "blank" && (
          <div className="space-y-4">
            <span className="font-mono text-xs text-bone tracking-widest uppercase block font-semibold border-b border-bone/20 pb-2">
              BEFORE YOU CODE
            </span>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-btn bg-[#171812] border border-bone/20">
                <span className="text-bone/60 block mb-1">STEP 01</span>
                <p className="text-bone">What exactly does the problem ask you to return?</p>
              </div>
              <div className="p-3 rounded-btn bg-[#171812] border border-bone/20">
                <span className="text-bone/60 block mb-1">STEP 02</span>
                <p className="text-bone">What would the brute-force approach do?</p>
              </div>
            </div>
          </div>
        )}

        {activeState === "compile-error" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-bone font-mono text-xs font-bold border-b border-bone/20 pb-2">
              <AlertTriangle className="w-4 h-4 text-bone" />
              <span>COMPILATION ISSUE</span>
            </div>
            <div className="p-4 rounded-btn bg-[#171812] border border-bone/30 font-mono text-xs text-bone space-y-2">
              <span className="text-bone/60 block">Line 14: Type Mismatch</span>
              <code className="block bg-smoky p-2 rounded text-floral font-bold">
                if (map.find(target) == true)
              </code>
              <p className="text-xs text-bone/90 pt-1 font-sans">
                &ldquo;find() doesn&apos;t return a boolean value. What does find() return when the key is present?&rdquo;
              </p>
            </div>
          </div>
        )}

        {activeState === "wrong-answer" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-bone font-mono text-xs font-bold border-b border-bone/20 pb-2">
              <XCircle className="w-4 h-4 text-bone" />
              <span>FAILED TEST CASE</span>
            </div>
            <div className="p-4 rounded-btn bg-[#171812] border border-bone/30 font-mono text-xs space-y-2">
              <div className="text-bone/80">Input: <code className="text-floral">[3,3], target = 6</code></div>
              <div className="text-bone/80">Expected: <code className="text-floral">[0,1]</code></div>
              <div className="text-bone/80">Received: <code className="text-floral">[]</code></div>
            </div>
            <p className="text-sm font-serif italic text-floral">
              &ldquo;What happens when both values needed for the answer are equal?&rdquo;
            </p>
          </div>
        )}

        {activeState === "tle" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-bone font-mono text-xs font-bold border-b border-bone/20 pb-2">
              <Clock className="w-4 h-4 text-bone" />
              <span>CORRECT, BUT TOO EXPENSIVE</span>
            </div>
            <div className="p-4 rounded-btn bg-[#171812] border border-bone/30 font-mono text-xs space-y-2">
              <span className="text-bone/80 block">Estimated Complexity: O(N²)</span>
              <p className="text-xs font-serif italic text-floral pt-1">
                &ldquo;Which repeated operation could be replaced by faster O(1) lookup?&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Guidance Ladder Display */}
        <div className="pt-4 border-t border-bone/20 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs text-bone">
            <span className="uppercase tracking-widest font-semibold">GUIDANCE LADDER</span>
            <span>LEVEL 0{level} / 05</span>
          </div>

          {/* Node Track */}
          <div className="relative flex items-center justify-between py-2">
            <div className="absolute left-0 right-0 h-[1.5px] bg-bone/20" />
            <div
              className="absolute left-0 h-[1.5px] bg-bone transition-all duration-300"
              style={{ width: `${((level - 1) / 4) * 100}%` }}
            />
            {LADDER.map((l, i) => {
              const idx = i + 1;
              const isCurrent = idx === level;
              const isPassed = idx <= level;
              return (
                <div
                  key={l.level}
                  onClick={() => setLevel(idx)}
                  className={`relative z-10 w-4 h-4 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
                    isCurrent
                      ? "border-bone bg-bone text-smoky font-bold scale-125 shadow-lg"
                      : isPassed
                      ? "border-bone bg-smoky text-bone"
                      : "border-bone/30 bg-smoky text-bone/40"
                  }`}
                  title={`${l.level} ${l.name}`}
                >
                  <span className="text-[9px] font-mono">{idx}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] text-bone/60">
            <span>Conceptual</span>
            <span>Explicit</span>
          </div>
        </div>
      </div>

      {/* Action Triggers */}
      <div className="pt-4 border-t border-bone/20 space-y-2">
        <button
          onClick={handleNextNudge}
          className="w-full group inline-flex items-center justify-between px-4 py-3 rounded-btn bg-bone text-smoky text-xs font-mono font-bold hover:bg-floral transition-colors shadow-md"
        >
          <span>Give me another nudge</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        <div className="flex items-center justify-between text-xs font-mono pt-1">
          <button className="text-bone/70 hover:text-floral transition-colors">
            I&apos;ve tried this
          </button>
          <button className="text-bone/70 hover:text-floral transition-colors underline underline-offset-2">
            Ask a specific question
          </button>
        </div>
      </div>
    </div>
  );
}
