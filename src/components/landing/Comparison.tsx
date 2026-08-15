"use client";

import React from "react";
import { Check, Minus } from "lucide-react";

interface ComparisonRow {
  feature: string;
  videos: boolean;
  staticHints: boolean;
  generalAI: boolean;
  algoTrace: boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Understands student's current code AST",
    videos: false,
    staticHints: false,
    generalAI: true,
    algoTrace: true,
  },
  {
    feature: "Uses exact failed test cases & errors",
    videos: false,
    staticHints: false,
    generalAI: true,
    algoTrace: true,
  },
  {
    feature: "Progressive ladder assistance (no solution leak)",
    videos: false,
    staticHints: false,
    generalAI: false,
    algoTrace: true,
  },
  {
    feature: "Tracks recurring cognitive misconceptions",
    videos: false,
    staticHints: false,
    generalAI: false,
    algoTrace: true,
  },
  {
    feature: "Preserves student mental effort & reasoning",
    videos: false,
    staticHints: false,
    generalAI: false,
    algoTrace: true,
  },
  {
    feature: "Adapts future practice pathway dynamically",
    videos: false,
    staticHints: false,
    generalAI: false,
    algoTrace: true,
  },
];

export function Comparison() {
  return (
    <section className="relative bg-smoky text-floral py-28 px-6 md:px-12 border-t border-bone/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-4xl mb-20">
          <span className="font-mono text-xs text-bone tracking-widest uppercase block mb-3">
            METHODOLOGY COMPARISON
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-floral leading-[1.05]">
            Built for the moment between <br />
            <span className="font-serif italic font-normal text-bone">
              &ldquo;I understand the problem&rdquo;
            </span>{" "}
            and{" "}
            <span className="font-serif italic font-normal text-bone">
              &ldquo;I can solve it.&rdquo;
            </span>
          </h2>
        </div>

        {/* Minimal Editorial Comparison Table */}
        <div className="overflow-x-auto rounded-[28px] border border-bone/30 bg-[#171812] shadow-2xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-bone/20 font-mono text-xs text-bone/80 uppercase tracking-wider">
                <th className="py-6 px-8 font-normal">CAPABILITY</th>
                <th className="py-6 px-4 font-normal text-center">VIDEOS</th>
                <th className="py-6 px-4 font-normal text-center">STATIC HINTS</th>
                <th className="py-6 px-4 font-normal text-center">GENERAL AI</th>
                <th className="py-6 px-6 font-bold text-center text-smoky bg-bone rounded-t-xl">
                  ALGOTRACE
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bone/20 font-sans text-sm">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-bone/5 transition-colors">
                  <td className="py-5 px-8 font-medium text-floral">
                    {row.feature}
                  </td>

                  {/* Videos */}
                  <td className="py-5 px-4 text-center">
                    {row.videos ? (
                      <Check className="w-4 h-4 mx-auto text-bone" />
                    ) : (
                      <Minus className="w-4 h-4 mx-auto text-bone/30" />
                    )}
                  </td>

                  {/* Static Hints */}
                  <td className="py-5 px-4 text-center">
                    {row.staticHints ? (
                      <Check className="w-4 h-4 mx-auto text-bone" />
                    ) : (
                      <Minus className="w-4 h-4 mx-auto text-bone/30" />
                    )}
                  </td>

                  {/* General AI */}
                  <td className="py-5 px-4 text-center">
                    {row.generalAI ? (
                      <Check className="w-4 h-4 mx-auto text-bone" />
                    ) : (
                      <Minus className="w-4 h-4 mx-auto text-bone/30" />
                    )}
                  </td>

                  {/* AlgoTrace Highlighted Column */}
                  <td className="py-5 px-6 text-center bg-bone text-smoky font-bold">
                    <Check className="w-5 h-5 mx-auto stroke-[2.5]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
