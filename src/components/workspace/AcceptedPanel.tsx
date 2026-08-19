"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw, Brain, BookmarkPlus } from "lucide-react";

interface AcceptedPanelProps {
  onClose?: () => void;
  nextProblemSlug?: string;
}

const REASONING_EVOLUTION = [
  "Pairwise search baseline",
  "Repeated lookup recognised",
  "Previous values stored",
  "Duplicate case handled",
  "Accepted solution",
];

export function AcceptedPanel({ onClose, nextProblemSlug = "longest-substring-without-repeating-characters" }: AcceptedPanelProps) {
  return (
    <div className="fixed inset-0 z-50 bg-smoky/90 backdrop-blur-md flex items-center justify-center p-6 text-floral font-sans">
      <div className="max-w-2xl w-full p-8 md:p-10 rounded-[28px] border border-bone/40 bg-[#171812] shadow-2xl space-y-8 relative overflow-hidden">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-bone/20 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-bone animate-pulse" />
            <span className="font-mono text-xs text-bone uppercase tracking-widest font-bold">
              ACCEPTED • VERIFIED O(N)
            </span>
          </div>
          <span className="font-mono text-xs text-bone/70">2 GUIDANCE STEPS USED</span>
        </div>

        {/* Headline */}
        <div>
          <h2 className="text-4xl sm:text-5xl font-serif italic text-floral mb-2">
            You found it.
          </h2>
          <p className="text-sm font-sans text-bone/80">
            You transformed an O(N²) nested scan into an optimal O(N) linear solution without sacrificing your mental effort.
          </p>
        </div>

        {/* Reasoning Evolution Flowchart */}
        <div className="p-5 rounded-btn border border-bone/25 bg-smoky space-y-3 font-mono text-xs">
          <span className="text-bone/70 uppercase tracking-wider block font-semibold text-[10px]">
            REASONING EVOLUTION PATH
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {REASONING_EVOLUTION.map((step, i) => (
              <React.Fragment key={i}>
                <span className={`px-2.5 py-1 rounded border ${i === REASONING_EVOLUTION.length - 1 ? "bg-bone text-smoky font-bold border-bone" : "border-bone/30 text-bone/90"}`}>
                  {step}
                </span>
                {i < REASONING_EVOLUTION.length - 1 && (
                  <span className="text-bone/40">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Tags Reinforced */}
        <div>
          <span className="font-mono text-xs text-bone/70 uppercase tracking-wider block mb-2 font-semibold">
            WHAT THIS PROBLEM REINFORCED:
          </span>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-full border border-bone/30 bg-bone/10 text-bone">
              Complement reasoning
            </span>
            <span className="px-3 py-1 rounded-full border border-bone/30 bg-bone/10 text-bone">
              Hash lookup O(1)
            </span>
            <span className="px-3 py-1 rounded-full border border-bone/30 bg-bone/10 text-bone">
              Duplicate handling
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-bone/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-btn border border-bone/30 text-bone hover:text-floral hover:bg-bone/10 transition-colors flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              <span>Review trace</span>
            </button>

            <button className="px-4 py-2.5 rounded-btn border border-bone/30 text-bone hover:text-floral hover:bg-bone/10 transition-colors flex items-center gap-2">
              <BookmarkPlus className="w-4 h-4" />
              <span>Add to revision</span>
            </button>
          </div>

          <Link
            href={`/problems/${nextProblemSlug}` as any}
            className="px-7 py-3 rounded-btn bg-bone text-smoky font-bold hover:bg-floral transition-colors flex items-center gap-2 shadow-lg"
          >
            <span>Next problem</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
