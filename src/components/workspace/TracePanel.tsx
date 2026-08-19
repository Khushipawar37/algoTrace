"use client";

import React, { useState } from "react";
import { Check, Brain, ChevronDown, ChevronUp } from "lucide-react";

interface TraceEvent {
  time: string;
  title: string;
  description: string;
  type: "open" | "attempt" | "guidance" | "warning" | "accepted";
  diffSnippet?: string;
}

const TRACE_EVENTS: TraceEvent[] = [
  {
    time: "18:32",
    title: "OPENED",
    description: "Two Sum • Arrays & Hashing",
    type: "open",
  },
  {
    time: "18:35",
    title: "ATTEMPT 01",
    description: "Nested loop approach • O(n²) baseline",
    type: "attempt",
    diffSnippet: `for (int i = 0; i < nums.size(); i++) {\n    for (int j = i + 1; j < nums.size(); j++) {\n        if (nums[i] + nums[j] == target) return {i, j};\n    }\n}`,
  },
  {
    time: "18:39",
    title: "GUIDANCE 01",
    description: "Repeated search identified without solution leak",
    type: "guidance",
  },
  {
    time: "18:43",
    title: "ATTEMPT 02",
    description: "Introduced stored hash map lookup",
    type: "attempt",
    diffSnippet: `unordered_map<int, int> seen;\nfor (int i = 0; i < nums.size(); i++) {\n    seen[nums[i]] = i;\n    int comp = target - nums[i];\n    if (seen.count(comp)) return {seen[comp], i};\n}`,
  },
  {
    time: "18:46",
    title: "FAILED CASE",
    description: "Duplicate input [3,3] with target = 6 failed due to immediate self-indexing",
    type: "warning",
  },
  {
    time: "18:49",
    title: "GUIDANCE 02",
    description: "Insertion order reconsidered (check memory before map insertion)",
    type: "guidance",
  },
  {
    time: "18:52",
    title: "ACCEPTED",
    description: "O(n) time · O(n) space solution verified",
    type: "accepted",
    diffSnippet: `unordered_map<int, int> seen;\nfor (int i = 0; i < nums.size(); i++) {\n    int comp = target - nums[i];\n    if (seen.count(comp)) return {seen[comp], i};\n    seen[nums[i]] = i;\n}`,
  },
];

export function TracePanel() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(1);

  return (
    <div className="h-full bg-smoky text-floral flex flex-col justify-between p-6 overflow-y-auto font-mono text-xs space-y-6">
      <div>
        <div className="flex items-center justify-between border-b border-bone/20 pb-4 mb-6">
          <span className="font-mono text-xs tracking-widest text-bone uppercase font-semibold">
            PROBLEM REASONING TRACE
          </span>
          <span className="text-bone/70">7 EVENTS RECORDED</span>
        </div>

        {/* Timeline List */}
        <div className="relative pl-6 space-y-6">
          <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-bone/30" />

          {TRACE_EVENTS.map((event, idx) => {
            const isExpanded = expandedIndex === idx;
            const isAccepted = event.type === "accepted";
            const isGuidance = event.type === "guidance";

            return (
              <div key={idx} className="relative group">
                {/* Node motif */}
                <div
                  className={`absolute -left-[30px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                    isAccepted
                      ? "border-bone bg-bone text-smoky"
                      : isGuidance
                      ? "border-bone bg-smoky"
                      : "border-bone/40 bg-smoky"
                  }`}
                />

                <div className="p-3.5 rounded-btn bg-[#171812] border border-bone/20 space-y-2">
                  <div
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-bone/60">{event.time}</span>
                      <span className={`font-bold uppercase ${isAccepted ? "text-bone" : "text-floral"}`}>
                        {event.title}
                      </span>
                    </div>

                    {event.diffSnippet && (
                      <button className="text-bone/60 hover:text-floral">
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  <p className="text-bone/80 font-sans text-xs">{event.description}</p>

                  {isExpanded && event.diffSnippet && (
                    <div className="pt-2 border-t border-bone/15 font-mono text-[11px] text-bone/90 bg-smoky p-3 rounded">
                      <pre className="whitespace-pre overflow-x-auto">{event.diffSnippet}</pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-bone/20 text-[11px] text-bone/70">
        Reasoning history recorded locally for progressive review &amp; spaced revision.
      </div>
    </div>
  );
}
