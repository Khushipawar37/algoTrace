"use client";

import React from "react";
import { motion } from "framer-motion";

interface TraceLineProps {
  nodes?: number;
  activeIndex?: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
  dark?: boolean;
}

export function TraceLine({
  nodes = 4,
  activeIndex = 1,
  orientation = "horizontal",
  className = "",
  dark = false,
}: TraceLineProps) {
  const lineBg = dark ? "bg-olive/40" : "bg-smoky/20";
  const activeLineBg = dark ? "bg-bone" : "bg-smoky";
  const nodeInactive = dark ? "border-olive bg-smoky text-olive" : "border-smoky/30 bg-floral text-smoky/50";
  const nodeActive = dark ? "border-bone bg-bone text-smoky" : "border-smoky bg-smoky text-floral";

  if (orientation === "vertical") {
    return (
      <div className={`relative flex flex-col items-center py-2 ${className}`}>
        {/* Track line */}
        <div className={`absolute top-0 bottom-0 w-[1.5px] ${lineBg}`} />
        
        {/* Active line fill */}
        <motion.div
          className={`absolute top-0 w-[1.5px] ${activeLineBg}`}
          initial={{ height: "0%" }}
          animate={{ height: `${(activeIndex / (nodes - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Nodes */}
        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
          {Array.from({ length: nodes }).map((_, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full border flex items-center justify-center text-[8px] font-mono transition-all duration-300 ${
                i <= activeIndex ? nodeActive : nodeInactive
              }`}
              animate={{
                scale: i === activeIndex ? 1.25 : 1,
              }}
            >
              {i === activeIndex && (
                <span className="w-1 h-1 rounded-full bg-current" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center w-full my-4 ${className}`}>
      {/* Track line */}
      <div className={`absolute left-0 right-0 h-[1.5px] ${lineBg}`} />

      {/* Active line fill */}
      <motion.div
        className={`absolute left-0 h-[1.5px] ${activeLineBg}`}
        initial={{ width: "0%" }}
        animate={{ width: `${(activeIndex / Math.max(1, nodes - 1)) * 100}%` }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Nodes */}
      <div className="relative z-10 flex justify-between w-full items-center">
        {Array.from({ length: nodes }).map((_, i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-full border flex items-center justify-center text-[8px] font-mono transition-all duration-300 ${
              i <= activeIndex ? nodeActive : nodeInactive
            }`}
            animate={{
              scale: i === activeIndex ? 1.3 : 1,
            }}
          >
            {i === activeIndex && (
              <span className="w-1 h-1 rounded-full bg-current" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
