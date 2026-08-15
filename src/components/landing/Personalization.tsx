"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Target, RefreshCw } from "lucide-react";

export function Personalization() {
  return (
    <section className="relative bg-smoky text-floral py-28 px-6 md:px-12 border-t border-bone/20">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-20">
          <span className="font-mono text-xs text-bone tracking-widest uppercase block mb-3">
            BEHAVIORAL REASONING MEMORY
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-floral leading-[1.05]">
            The tutor remembers how you think.
          </h2>
          <p className="text-lg text-bone/85 mt-4 font-normal max-w-xl">
            Instead of evaluating you on pass/fail speed, AlgoTrace models your recurring misconceptions across topics and adjusts its future Socratic prompts accordingly.
          </p>
        </div>

        {/* Dashboard Composition Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1: Pattern Detected — Binary Search Boundaries (7 Cols) */}
          <div className="lg:col-span-7 p-8 md:p-10 rounded-[28px] border border-bone/30 bg-[#171812] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-bone/20 pb-4 mb-6">
                <div className="flex items-center gap-2 font-mono text-xs text-bone font-semibold">
                  <span className="w-2 h-2 rounded-full bg-bone animate-pulse" />
                  <span>PATTERN DETECTED • COGNITIVE RECURRENCE</span>
                </div>
                <span className="font-mono text-xs text-bone/80">3 SESSIONS SAMPLED</span>
              </div>

              <h3 className="text-2xl font-bold font-sans text-floral mb-4">
                Binary Search Boundaries
              </h3>

              <blockquote className="text-lg font-serif italic text-bone/90 mb-6 leading-relaxed">
                &ldquo;Similar boundary-update mistakes appeared in 3 recent problems.&rdquo;
              </blockquote>

              {/* Related problems */}
              <div className="mb-8">
                <span className="font-mono text-xs text-bone/80 uppercase block mb-3">
                  AFFECTED RECENT ATTEMPTS:
                </span>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  <span className="px-3 py-1.5 rounded-full border border-bone/30 bg-smoky text-bone">
                    Search in Rotated Array
                  </span>
                  <span className="px-3 py-1.5 rounded-full border border-bone/30 bg-smoky text-bone">
                    First Bad Version
                  </span>
                  <span className="px-3 py-1.5 rounded-full border border-bone/30 bg-smoky text-bone">
                    Lower Bound
                  </span>
                </div>
              </div>
            </div>

            {/* Recommendation block */}
            <div className="p-5 rounded-btn border border-bone/30 bg-bone/5">
              <span className="font-mono text-xs text-bone font-semibold uppercase block mb-1">
                TUTOR RECOMMENDATION:
              </span>
              <p className="text-sm font-sans text-floral/90 leading-relaxed">
                &ldquo;Retry one boundary-focused problem without guidance to confirm off-by-one boundary state update independence.&rdquo;
              </p>
            </div>
          </div>

          {/* Card 2: Dynamic Programming State Modeling (5 Cols) */}
          <div className="lg:col-span-5 p-8 md:p-10 rounded-[28px] border border-bone/30 bg-[#191A14] flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-bone/20 pb-4 mb-6">
                <div className="flex items-center gap-2 font-mono text-xs text-bone font-semibold">
                  <span className="w-2 h-2 rounded-full bg-bone" />
                  <span>PATTERN DETECTED • CONCEPT GAP</span>
                </div>
                <span className="font-mono text-xs text-bone/80">DP RECURSION</span>
              </div>

              <h3 className="text-2xl font-bold font-sans text-floral mb-4">
                Dynamic Programming
              </h3>

              <blockquote className="text-lg font-serif italic text-bone/90 mb-6 leading-relaxed">
                &ldquo;You identify recursion correctly but struggle to define state.&rdquo;
              </blockquote>

              <p className="text-sm font-sans text-bone/85 leading-relaxed mb-6">
                When encountering subproblems, your code frequently recalculates parameters that could be mapped cleanly into a 1D state vector.
              </p>
            </div>

            {/* Analytical Note */}
            <div className="p-5 rounded-btn border border-bone/30 bg-smoky/80 font-mono text-xs text-bone">
              <span className="text-bone/80 block mb-1">ANALYTICAL DIAGNOSIS</span>
              <span>Next Socratic prompts will focus specifically on state transition table formulation.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
