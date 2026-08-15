"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-floral text-smoky pt-32 pb-20 px-6 md:px-12 flex flex-col justify-between overflow-hidden">
      {/* Background visual detail - extremely subtle trace grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#11120D_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center py-12 z-10">
        {/* Small Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
          <p className="font-mono text-xs md:text-sm tracking-[0.25em] text-olive uppercase font-medium">
            THE DSA TUTOR THAT DOESN&apos;T GIVE AWAY THE ANSWER
          </p>
        </motion.div>

        {/* Large Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-bold tracking-tight leading-[0.95] max-w-6xl mb-8"
        >
          Get unstuck. <br />
          Without giving up <br />
          <span className="font-serif italic font-normal text-olive block mt-1">
            the answer.
          </span>
        </motion.h1>

        {/* Description & CTAs Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4 border-t border-smoky/10 max-w-6xl"
        >
          <p className="text-lg md:text-xl text-olive max-w-[580px] leading-relaxed font-normal">
            AlgoTrace studies your reasoning, code, errors and attempts to give you the next useful hint—not the final solution.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/workspace"
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-btn bg-smoky text-floral text-base font-medium transition-all duration-300 hover:bg-olive hover:-translate-y-0.5 active:translate-y-0 shadow-md"
            >
              <span>Solve your first problem</span>
              <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <a
              href="#demo"
              className="group inline-flex items-center gap-2 px-6 py-4 rounded-btn border border-smoky/20 text-smoky text-base font-medium transition-all duration-300 hover:border-smoky hover:bg-bone/30"
            >
              <span>See how AlgoTrace thinks</span>
              <span className="font-mono text-sm group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Section 9: Scroll Indicator Motif */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-7xl mx-auto w-full flex items-center justify-between pt-8 border-t border-smoky/10 text-xs font-mono tracking-widest text-olive uppercase z-10"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-smoky" />
          <span>ALGORITHMIC SOCRATIC GUIDANCE</span>
        </div>

        <a
          href="#demo"
          className="flex items-center gap-2 hover:text-smoky transition-colors group cursor-pointer"
        >
          <span>SCROLL TO TRACE</span>
          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
        </a>
      </motion.div>
    </section>
  );
}
