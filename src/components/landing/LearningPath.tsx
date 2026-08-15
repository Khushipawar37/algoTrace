"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";

interface PathNode {
  id: string;
  name: string;
  count: string;
  mastery: string;
  weakSpot: string;
  status: "completed" | "in-progress" | "up-next";
}

const TOPIC_PATH: PathNode[] = [
  {
    id: "arrays",
    name: "Arrays",
    count: "24 / 24 problems",
    mastery: "Mastered boundary scanning & indexing",
    weakSpot: "In-place rotation subtle logic",
    status: "completed",
  },
  {
    id: "hashing",
    name: "Hashing",
    count: "18 / 25 problems",
    mastery: "Strong concept understanding & lookup mapping",
    weakSpot: "Needs work: state modelling in custom keys",
    status: "in-progress",
  },
  {
    id: "two-pointers",
    name: "Two Pointers",
    count: "15 / 20 problems",
    mastery: "Symmetric scan logic acquired",
    weakSpot: "3-sum duplicate skip condition",
    status: "in-progress",
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    count: "12 / 18 problems",
    mastery: "Dynamic expansion & shrink state",
    weakSpot: "At most K distinct elements boundary",
    status: "in-progress",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    count: "10 / 22 problems",
    mastery: "Standard monotonically sorted range",
    weakSpot: "Rotated array pivot detection",
    status: "in-progress",
  },
  {
    id: "stacks",
    name: "Stacks & Queues",
    count: "8 / 16 problems",
    mastery: "LIFO pattern recognition",
    weakSpot: "Monotonic stack boundary condition",
    status: "up-next",
  },
  {
    id: "trees",
    name: "Trees & Binary Search Trees",
    count: "0 / 28 problems",
    mastery: "Prerequisites in progress",
    weakSpot: "Lowest common ancestor recursion",
    status: "up-next",
  },
  {
    id: "graphs",
    name: "Graphs & BFS/DFS",
    count: "0 / 30 problems",
    mastery: "Prerequisites in progress",
    weakSpot: "Cycle detection & topological sort",
    status: "up-next",
  },
  {
    id: "dp",
    name: "Dynamic Programming",
    count: "0 / 35 problems",
    mastery: "Prerequisites in progress",
    weakSpot: "Defining overlapping subproblem state",
    status: "up-next",
  },
];

export function LearningPath() {
  const [selectedId, setSelectedId] = useState<string>("hashing");
  const selectedNode = TOPIC_PATH.find((n) => n.id === selectedId) || TOPIC_PATH[1];

  return (
    <section id="learning-paths" className="relative bg-floral text-smoky py-28 px-6 md:px-12 border-t border-smoky/10">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-3">
              CURATED CURRICULUM TRAJECTORY
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-smoky leading-[1.05]">
              Practice should have direction.
            </h2>
            <p className="text-lg text-olive mt-4 font-normal">
              Instead of random problem solving, follow connected cognitive pathways designed to build algorithm intuition layer by layer.
            </p>
          </div>

          <div className="mt-6 md:mt-0">
            <a
              href="#practice"
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-btn bg-smoky text-floral text-sm font-medium transition-all duration-300 hover:bg-olive"
            >
              <span>Explore learning paths</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Connected Node Pathway Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Node Flow Map (7 Cols) */}
          <div className="lg:col-span-7 relative p-8 rounded-[24px] border border-smoky/15 bg-bone/20">
            <span className="font-mono text-xs text-olive uppercase tracking-wider block mb-6">
              INTERACTIVE PATH MAP (CLICK NODE TO INSPECT)
            </span>

            <div className="relative space-y-4">
              {/* Vertical connecting trace line */}
              <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-smoky/20 z-0" />

              {TOPIC_PATH.map((node, idx) => {
                const isSelected = node.id === selectedId;
                const isCompleted = node.status === "completed";
                const isInProgress = node.status === "in-progress";

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedId(node.id)}
                    className={`relative z-10 flex items-center justify-between p-4 rounded-btn border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "border-smoky bg-smoky text-floral shadow-xl translate-x-2"
                        : "border-smoky/10 bg-floral text-smoky hover:border-smoky/40 hover:bg-bone/40"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Node badge */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center font-mono text-[10px] ${
                          isSelected
                            ? "border-bone bg-bone text-smoky font-bold"
                            : isCompleted
                            ? "border-smoky bg-smoky text-floral"
                            : isInProgress
                            ? "border-olive bg-bone text-smoky"
                            : "border-smoky/30 bg-floral text-olive"
                        }`}
                      >
                        {idx + 1}
                      </div>

                      <span
                        className={`font-sans font-semibold text-base md:text-lg ${
                          isSelected ? "text-floral" : "text-smoky"
                        }`}
                      >
                        {node.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span
                        className={
                          isSelected
                            ? "text-bone/80"
                            : isCompleted
                            ? "text-smoky font-semibold"
                            : "text-olive"
                        }
                      >
                        {node.count}
                      </span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 ${
                          isSelected ? "text-bone" : "text-olive"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Inspector Panel (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-[24px] border border-smoky bg-smoky text-floral shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between border-b border-olive/30 pb-4">
                  <span className="font-mono text-xs text-bone tracking-widest uppercase">
                    NODE DIAGNOSTICS
                  </span>
                  <span className="font-mono text-xs text-olive uppercase">
                    STATUS: {selectedNode.status}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-xs text-olive block mb-1 uppercase">
                    SELECTED TOPIC
                  </span>
                  <h3 className="text-3xl font-bold font-sans text-floral">
                    {selectedNode.name}
                  </h3>
                </div>

                <div className="p-4 rounded-btn border border-olive/30 bg-[#171812] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-olive">SOLVED TARGET:</span>
                    <span className="text-bone font-semibold">{selectedNode.count}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-olive/20">
                    <span className="text-olive">TRAINED MASTERY:</span>
                    <span className="text-floral font-semibold">82%</span>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <span className="font-mono text-xs text-bone/70 uppercase block mb-1">
                      CONCEPT STRENGTH
                    </span>
                    <p className="text-sm font-sans text-floral/90 leading-relaxed">
                      {selectedNode.mastery}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-olive/30">
                    <span className="font-mono text-xs text-bone/70 uppercase block mb-1">
                      NEEDS WORK / TARGETED REASONING:
                    </span>
                    <p className="text-sm font-mono text-bone leading-relaxed">
                      {selectedNode.weakSpot}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-olive/30">
                  <a
                    href="#workspace"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-btn bg-bone text-smoky font-semibold text-sm transition-all hover:bg-floral"
                  >
                    <span>Practice {selectedNode.name} Problems</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
