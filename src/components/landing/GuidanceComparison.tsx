"use client";

import React from "react";
import { motion } from "framer-motion";

export function GuidanceComparison() {
  return (
    <section className="relative bg-floral text-smoky py-28 px-6 md:px-12 border-t border-smoky/10">
      <div className="max-w-7xl mx-auto">
        {/* Large Section Title */}
        <div className="max-w-3xl mb-20">
          <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-3">
            PEDAGOGICAL PHILOSOPHY
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-smoky leading-[1.05]">
            Not every hint teaches you something.
          </h2>
        </div>

        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-stretch relative">
          {/* Vertical divider line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-smoky/15 -translate-x-1/2" />

          {/* Left Column: Typical Platform */}
          <div className="flex flex-col justify-between pr-0 md:pr-6 pb-12 md:pb-0 border-b md:border-b-0 border-smoky/10">
            <div>
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-smoky/10">
                <span className="font-mono text-xs text-olive uppercase tracking-wider">
                  TYPICAL PLATFORM HINT
                </span>
                <span className="font-mono text-xs text-olive/60">CONVENTIONAL AI</span>
              </div>

              <div className="mb-6">
                <span className="font-mono text-xs text-olive block mb-1 uppercase">
                  PROBLEM CONTEXT
                </span>
                <p className="font-mono text-base font-semibold text-smoky">
                  Next Greater Element
                </p>
              </div>

              <div className="p-6 rounded-btn bg-bone/30 border border-smoky/10 mb-8">
                <span className="font-mono text-xs text-olive/80 block mb-2">
                  DIRECT HINT OUTPUT:
                </span>
                <blockquote className="text-2xl font-serif italic text-smoky">
                  &ldquo;Use a stack.&rdquo;
                </blockquote>
              </div>
            </div>

            <div className="pt-6 border-t border-smoky/10">
              <span className="font-mono text-xs text-olive uppercase block mb-1">
                ANALYSIS OF EFFECT
              </span>
              <p className="text-sm text-olive leading-relaxed">
                The technique was revealed before the reasoning. The student learns the solution key for this exact problem, but gains no instinct for when to apply monotonic properties elsewhere.
              </p>
            </div>
          </div>

          {/* Right Column: AlgoTrace Progressive Guidance */}
          <div className="flex flex-col justify-between pl-0 md:pl-6">
            <div>
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-smoky/10">
                <span className="font-mono text-xs text-smoky font-bold uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-smoky" />
                  <span>ALGOTRACE REASONING GUIDANCE</span>
                </span>
                <span className="font-mono text-xs text-smoky font-semibold px-2.5 py-0.5 rounded border border-smoky/20 bg-bone/50">
                  GUIDANCE LEVEL 02
                </span>
              </div>

              <div className="mb-6">
                <span className="font-mono text-xs text-olive block mb-1 uppercase">
                  PROBLEM CONTEXT
                </span>
                <p className="font-mono text-base font-semibold text-smoky">
                  Next Greater Element
                </p>
              </div>

              <div className="p-8 rounded-btn bg-smoky text-floral border border-smoky mb-8 shadow-lg">
                <span className="font-mono text-xs text-bone/70 block mb-3 uppercase tracking-wider">
                  OBSERVATION &amp; PROMPT:
                </span>
                <p className="text-sm font-mono text-bone leading-relaxed mb-4">
                  You&apos;re repeatedly searching the elements to the right.
                </p>
                <blockquote className="text-xl md:text-2xl font-serif italic text-floral leading-snug">
                  &ldquo;What if unresolved elements could remain available while you continue moving through the array?&rdquo;
                </blockquote>
              </div>
            </div>

            <div className="pt-6 border-t border-smoky/10">
              <span className="font-mono text-xs text-smoky font-semibold uppercase block mb-1">
                ANALYSIS OF EFFECT
              </span>
              <p className="text-sm text-smoky font-medium leading-relaxed">
                The student identifies the computational bottleneck first. By prompting state preservation instead of naming the data structure, the student discovers the stack pattern independently.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner Quote */}
        <div className="mt-20 pt-12 border-t border-smoky/10 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-smoky">
            Same destination.{" "}
            <span className="font-serif italic font-normal text-olive">
              More of the thinking stays yours.
            </span>
          </h3>
        </div>
      </div>
    </section>
  );
}
