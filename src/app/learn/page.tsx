"use client";

import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { ArrowRight, Compass, CheckCircle2, Circle } from "lucide-react";

interface TopicNode {
  id: string;
  number: string;
  name: string;
  desc: string;
  solved: string;
  strength: string;
  lastPracticed: string;
  recommended: boolean;
}

const TOPICS: TopicNode[] = [
  {
    id: "arrays",
    number: "01",
    name: "Arrays & Pre-computation",
    desc: "Index scanning, prefix sums, and frequency counts.",
    solved: "24 / 24",
    strength: "Mastered",
    lastPracticed: "Aug 10",
    recommended: false,
  },
  {
    id: "hashing",
    number: "02",
    name: "Hashing & State Lookup",
    desc: "Use stored state to replace repeated scans.",
    solved: "18 / 25",
    strength: "Strong",
    lastPracticed: "Today",
    recommended: true,
  },
  {
    id: "two-pointers",
    number: "03",
    name: "Two Pointers",
    desc: "Symmetric range narrowing in sorted sequences.",
    solved: "15 / 20",
    strength: "Developing",
    lastPracticed: "Aug 12",
    recommended: false,
  },
  {
    id: "sliding-window",
    number: "04",
    name: "Sliding Window",
    desc: "Dynamic window contraction & expansion criteria.",
    solved: "12 / 18",
    strength: "Developing",
    lastPracticed: "Aug 14",
    recommended: true,
  },
  {
    id: "binary-search",
    number: "05",
    name: "Binary Search",
    desc: "Monotonic search space reduction & boundary updating.",
    solved: "10 / 22",
    strength: "Needs Practice",
    lastPracticed: "Aug 09",
    recommended: true,
  },
  {
    id: "stacks",
    number: "06",
    name: "Stacks & Queues",
    desc: "Monotonic stack properties & LIFO state preservation.",
    solved: "8 / 16",
    strength: "Beginning",
    lastPracticed: "Aug 01",
    recommended: false,
  },
];

export default function LearnPage() {
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-smoky/10 pb-6">
          <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
            STRUCTURED CURRICULUM
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-smoky">
            Learning Paths
          </h1>
          <p className="text-sm font-sans text-olive mt-1">
            Build patterns in an order that makes the next one easier.
          </p>
        </div>

        {/* Visual Topic Path Stream */}
        <div className="relative pl-6 md:pl-10 space-y-8">
          {/* Connecting Vertical Trace Line */}
          <div className="absolute left-[29px] md:left-[45px] top-6 bottom-6 w-[2px] bg-smoky/20" />

          {TOPICS.map((topic, idx) => (
            <div key={topic.id} className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              {/* Node Bullet */}
              <div className="absolute -left-[30px] md:-left-[46px] top-6 z-10 w-4 h-4 rounded-full border-2 border-smoky bg-bone flex items-center justify-center font-mono text-[9px] font-bold text-smoky">
                {idx + 1}
              </div>

              {/* Topic Card */}
              <Link
                href={`/learn/${topic.id}` as any}
                className="flex-1 p-6 md:p-8 rounded-[24px] border border-smoky/15 bg-floral hover:border-smoky/40 hover:bg-bone/20 transition-all duration-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="font-bold text-olive">{topic.number}</span>
                    {topic.recommended && (
                      <span className="px-2.5 py-0.5 rounded-full bg-smoky text-floral font-bold uppercase text-[10px]">
                        RECOMMENDED NEXT
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold font-sans text-smoky group-hover:text-olive transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-xs font-sans text-olive leading-relaxed max-w-lg">
                    {topic.desc}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 font-mono text-xs pt-4 md:pt-0 border-t md:border-t-0 border-smoky/10">
                  <div className="text-right">
                    <span className="text-olive block text-[10px] uppercase">SOLVED</span>
                    <span className="font-bold text-smoky text-sm">{topic.solved}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-olive block text-[10px] uppercase">STRENGTH</span>
                    <span className="font-semibold text-smoky">{topic.strength}</span>
                  </div>

                  <ArrowRight className="w-5 h-5 text-olive transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
