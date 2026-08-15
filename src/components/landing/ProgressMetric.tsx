"use client";

import React from "react";
import { motion } from "framer-motion";

const WEEKS_DATA = [
  { week: "Week 01", val: 3.8, percentage: "100%" },
  { week: "Week 02", val: 2.9, percentage: "76%" },
  { week: "Week 03", val: 2.1, percentage: "55%" },
  { week: "Week 04", val: 1.4, percentage: "36%" },
];

export function ProgressMetric() {
  return (
    <section className="relative bg-floral text-smoky py-28 px-6 md:px-12 border-t border-smoky/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="max-w-3xl mb-20">
          <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-3">
            AUTONOMY METRIC
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-smoky leading-[1.05]">
            Progress means needing us less.
          </h2>
        </div>

        {/* Metric Banner + Visual Canvas */}
        <div className="p-8 md:p-14 rounded-[28px] border border-smoky/20 bg-bone/30 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Big Number (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs text-olive tracking-widest uppercase block">
                AVERAGE HINTS PER SOLVED PROBLEM
              </span>

              <div className="flex items-baseline gap-4">
                <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold font-mono tracking-tighter text-smoky">
                  3.8
                </span>
                <span className="text-4xl lg:text-5xl font-serif italic text-olive">
                  →
                </span>
                <span className="text-6xl sm:text-7xl lg:text-8xl font-extrabold font-mono tracking-tighter text-smoky">
                  1.4
                </span>
              </div>

              <div className="pt-4 border-t border-smoky/15">
                <p className="text-sm font-sans text-olive leading-relaxed">
                  As students develop algorithmic intuition through Socratic questioning, hint dependency drops by 63% within the first 30 days.
                </p>
              </div>
            </div>

            {/* Right Trend Line Visualization (7 Cols) */}
            <div className="lg:col-span-7 p-8 rounded-[24px] border border-smoky/20 bg-floral space-y-8">
              <div className="flex items-center justify-between border-b border-smoky/10 pb-4">
                <span className="font-mono text-xs text-olive tracking-wider uppercase">
                  4-WEEK GUIDANCE DEPENDENCY TREND
                </span>
                <span className="font-mono text-xs text-smoky font-bold">
                  -63% HINT DEMAND
                </span>
              </div>

              {/* Custom Monochrome SVG Trend Path */}
              <div className="relative h-48 w-full flex items-end justify-between pt-6">
                {/* SVG Curve */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                  <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#565449" strokeOpacity="0.15" strokeDasharray="4 4" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#565449" strokeOpacity="0.15" strokeDasharray="4 4" />
                  <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#565449" strokeOpacity="0.15" strokeDasharray="4 4" />
                  
                  {/* Monochromatic Trend Line */}
                  <motion.path
                    d="M 40 30 Q 160 70, 280 110 T 520 150"
                    fill="none"
                    stroke="#11120D"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>

                {/* Bars / Nodes for weeks */}
                {WEEKS_DATA.map((w, idx) => (
                  <div key={w.week} className="relative z-10 flex flex-col items-center gap-2">
                    <span className="font-mono text-sm font-bold text-smoky">{w.val}</span>
                    <div
                      className="w-12 bg-bone border border-smoky/30 rounded-t-md transition-all hover:bg-smoky hover:text-floral group flex items-end justify-center pb-2"
                      style={{ height: `${w.val * 32}px` }}
                    >
                      <span className="font-mono text-[10px] text-olive group-hover:text-floral">
                        {w.week.slice(-2)}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-olive">{w.week}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Philosophical Caption Note */}
          <div className="mt-12 pt-8 border-t border-smoky/15 text-center max-w-3xl mx-auto">
            <blockquote className="text-xl sm:text-2xl font-serif italic text-smoky leading-relaxed">
              &ldquo;AlgoTrace isn&apos;t designed to make you dependent on a tutor. It&apos;s designed to gradually make the tutor unnecessary.&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
