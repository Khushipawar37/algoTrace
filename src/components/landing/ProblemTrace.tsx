"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Brain, Check, GitCommit } from "lucide-react";

const TIMELINE_EVENTS = [
  {
    time: "18:32",
    title: "Problem opened",
    subtitle: "Two Sum • Medium constraints",
    type: "event",
  },
  {
    time: "18:35",
    title: "Attempt 01 — Nested loops",
    subtitle: "Brute-force baseline implemented • Complexity O(n²)",
    type: "attempt",
  },
  {
    time: "18:39",
    title: "Guidance 01 — Socratic question",
    subtitle: "Repeated lookup bottleneck recognized without revealing code",
    type: "guidance",
  },
  {
    time: "18:43",
    title: "Attempt 02 — Hash map introduced",
    subtitle: "O(1) memory lookup integrated into iteration",
    type: "attempt",
  },
  {
    time: "18:46",
    title: "Failed edge case — Duplicates",
    subtitle: "Test input [3, 3] with target = 6 failed due to self-indexing",
    type: "warning",
  },
  {
    time: "18:49",
    title: "Guidance 02 — Insertion order",
    subtitle: "Prompted to check memory before map insertion",
    type: "guidance",
  },
  {
    time: "18:52",
    title: "Accepted — O(n) runtime",
    subtitle: "Optimal solution reached with preserved mental effort",
    type: "accepted",
  },
];

export function ProblemTrace() {
  return (
    <section className="relative bg-bone text-smoky py-28 px-6 md:px-12 border-t border-smoky/15">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Heading */}
        <div className="max-w-4xl mb-20">
          <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-3">
            REASONING HISTORY ARCHITECTURE
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-smoky leading-[1.05]">
            Don&apos;t just save the answer. <br />
            <span className="font-serif italic font-normal text-olive">
              Save how you reached it.
            </span>
          </h2>
          <p className="text-lg text-smoky/80 mt-4 font-normal max-w-xl">
            AlgoTrace automatically generates a behavioral trace of your problem-solving session—recording pivots, hints consumed, edge case fixes, and conceptual breakthroughs.
          </p>
        </div>

        {/* Vertical Timeline Card */}
        <div className="p-8 md:p-12 rounded-[28px] border border-smoky/20 bg-floral shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-smoky/15 mb-12">
            <div>
              <span className="font-mono text-xs text-olive uppercase tracking-widest block mb-1">
                SESSION RECORD • TWO SUM
              </span>
              <h3 className="text-2xl font-bold text-smoky">Problem Trace Log #4092</h3>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3 font-mono text-xs text-smoky">
              <span className="px-3 py-1 rounded-full border border-smoky/20 bg-bone/40">
                2 HINTS CONSUMED
              </span>
              <span className="px-3 py-1 rounded-full bg-smoky text-floral font-semibold">
                ACCEPTED O(N)
              </span>
            </div>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pl-6 md:pl-32 space-y-10">
            {/* Connecting Vertical Line */}
            <div className="absolute left-[31px] md:left-[143px] top-3 bottom-3 w-[2px] bg-smoky/20" />

            {TIMELINE_EVENTS.map((event, idx) => {
              const isAccepted = event.type === "accepted";
              const isGuidance = event.type === "guidance";

              return (
                <div key={idx} className="relative flex flex-col md:flex-row md:items-center gap-4 group">
                  {/* Timestamp for desktop */}
                  <div className="hidden md:block w-24 text-right font-mono text-xs text-olive font-medium">
                    {event.time}
                  </div>

                  {/* Node Dot */}
                  <div
                    className={`absolute -left-[32px] md:relative md:left-0 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isAccepted
                        ? "border-smoky bg-smoky text-floral"
                        : isGuidance
                        ? "border-olive bg-bone text-smoky"
                        : "border-smoky/40 bg-floral text-smoky/60"
                    }`}
                  >
                    {isAccepted ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : isGuidance ? (
                      <Brain className="w-3 h-3" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </div>

                  {/* Content Box */}
                  <div
                    className={`flex-1 p-5 rounded-btn border transition-all ${
                      isAccepted
                        ? "border-smoky bg-smoky text-floral shadow-md"
                        : isGuidance
                        ? "border-olive/40 bg-bone/30 text-smoky"
                        : "border-smoky/10 bg-floral text-smoky hover:border-smoky/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="md:hidden font-mono text-xs text-olive">
                        {event.time}
                      </span>
                      <h4
                        className={`font-sans font-bold text-base ${
                          isAccepted ? "text-floral" : "text-smoky"
                        }`}
                      >
                        {event.title}
                      </h4>
                    </div>
                    <p
                      className={`text-xs md:text-sm leading-relaxed ${
                        isAccepted ? "text-bone/90" : "text-olive"
                      }`}
                    >
                      {event.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Summary: What Was Learned */}
          <div className="mt-16 pt-8 border-t border-smoky/15 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="font-mono text-xs text-olive uppercase tracking-wider block mb-2">
                WHAT WAS LEARNED IN THIS SESSION:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full border border-smoky/20 bg-bone/60 font-mono text-xs text-smoky font-medium">
                  Complement reasoning
                </span>
                <span className="px-3.5 py-1.5 rounded-full border border-smoky/20 bg-bone/60 font-mono text-xs text-smoky font-medium">
                  Hash lookup O(1)
                </span>
                <span className="px-3.5 py-1.5 rounded-full border border-smoky/20 bg-bone/60 font-mono text-xs text-smoky font-medium">
                  Duplicate handling
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs text-olive block">REASONING RETENTION SCORE</span>
              <span className="text-2xl font-bold font-mono text-smoky">HIGH (94%)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
