"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative bg-smoky text-floral py-36 px-6 md:px-12 overflow-hidden border-t border-olive/30 min-h-[85vh] flex flex-col justify-center items-center text-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-bone/5 blur-[140px] rounded-full pointer-events-none" />

      {/* Subtle animated trace line leading down */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Animated trace line motif */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-2 h-2 rounded-full bg-bone animate-ping" />
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-bone to-olive" />
          <span className="w-2.5 h-2.5 rounded-full bg-bone" />
        </div>

        {/* Small mono eyebrow */}
        <span className="font-mono text-xs md:text-sm tracking-[0.3em] text-bone uppercase mb-6 block font-medium">
          YOUR NEXT PROBLEM IS WAITING
        </span>

        {/* Large dramatic typography */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-floral leading-[1.02] max-w-5xl mb-6">
          The next time you&apos;re stuck, <br />
          don&apos;t open the{" "}
          <span className="font-serif italic font-normal text-bone">
            solution.
          </span>
        </h2>

        <p className="text-2xl sm:text-3xl font-serif italic text-olive mb-12">
          Find your way there.
        </p>

        {/* Primary CTA Button */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="relative group"
        >
          <Link
            href="/workspace"
            className="inline-flex items-center gap-3 px-9 py-5 rounded-btn bg-bone text-smoky text-lg font-bold transition-all duration-300 hover:bg-floral shadow-2xl"
          >
            <span>Start tracing</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
