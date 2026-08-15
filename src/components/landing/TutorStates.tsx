"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, AlertTriangle, XCircle, Clock, FileCode } from "lucide-react";

interface TutorStateItem {
  id: string;
  number: string;
  title: string;
  icon: React.ElementType;
  editorContext: string;
  tutorResponse: string;
  detail: string;
  highlightSnippet?: string;
}

const STATES: TutorStateItem[] = [
  {
    id: "blank",
    number: "01",
    title: "Blank Editor",
    icon: FileCode,
    editorContext: `// Problem: Longest Substring Without Repeating Characters\nint lengthOfLongestSubstring(string s) {\n    // Empty workspace\n}`,
    tutorResponse: "Before writing code, what would the brute-force solution check?",
    detail: "Initial framing — encourages algorithm design before typing syntactic structures.",
  },
  {
    id: "partial",
    number: "02",
    title: "Partial Solution",
    icon: Code,
    editorContext: `for (int right = 0; right < s.length(); right++) {\n    charSet.insert(s[right]);\n    maxLen = max(maxLen, right - left + 1);\n}`,
    tutorResponse: "Your window expands correctly. What condition should make it shrink?",
    detail: "State awareness — acknowledges working logic while highlighting the missing contraction rule.",
  },
  {
    id: "compile",
    number: "03",
    title: "Compile Error",
    icon: AlertTriangle,
    editorContext: `unordered_map<int, vector<int>> mp;\n// Line 14: invalid type conversion\nint targetIndex = mp[target];`,
    highlightSnippet: "int targetIndex = mp[target];",
    tutorResponse: "What type does this expression return?",
    detail: "Precision diagnostics — highlights only the exact type mismatch line instead of raw stack dump.",
  },
  {
    id: "wrong",
    number: "04",
    title: "Wrong Answer",
    icon: XCircle,
    editorContext: `Failed Test Case: input = [3, 3], target = 6\nExpected: [0, 1]\nOutput: [0, 0]`,
    tutorResponse: "Does your logic still work when the required values are equal?",
    detail: "Edge case isolation — directs focus to self-matching index bugs during duplicate evaluation.",
  },
  {
    id: "tle",
    number: "05",
    title: "Time Limit Exceeded (TLE)",
    icon: Clock,
    editorContext: `Passed 42/50 test cases.\nExecution timed out on N = 10^5.\nCurrent time complexity: O(N²)`,
    tutorResponse: "Your output is correct, but one operation repeats for every pair.",
    detail: "Asymptotic coaching — confirms correctness while prompting computational efficiency optimization.",
  },
];

export function TutorStates() {
  const [activeId, setActiveId] = useState<string>("blank");

  const currentState = STATES.find((s) => s.id === activeId) || STATES[0];

  return (
    <section className="relative bg-floral text-smoky py-28 px-6 md:px-12 border-t border-smoky/10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-3">
            CONTEXT-AWARE SOCRATIC ADAPTATION
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-smoky leading-[1.05]">
            AlgoTrace doesn&apos;t respond the same way every time.
          </h2>
          <p className="text-lg text-olive mt-4 font-normal max-w-xl">
            The tutor dynamically recalibrates its guidance based on code AST analysis, compiler outputs, failed test inputs, and past student attempts.
          </p>
        </div>

        {/* Large Interactive Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left State Tabs (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            {STATES.map((state) => {
              const isActive = state.id === activeId;
              const Icon = state.icon;

              return (
                <button
                  key={state.id}
                  onClick={() => setActiveId(state.id)}
                  className={`w-full flex items-center justify-between p-5 rounded-btn border text-left transition-all duration-300 ${
                    isActive
                      ? "border-smoky bg-smoky text-floral shadow-xl scale-[1.01]"
                      : "border-smoky/15 bg-floral text-smoky hover:border-smoky/40 hover:bg-bone/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-xs ${isActive ? "text-bone" : "text-olive"}`}>
                      {state.number}
                    </span>
                    <span className="font-sans font-semibold text-base">
                      {state.title}
                    </span>
                  </div>
                  <Icon className={`w-4 h-4 ${isActive ? "text-bone" : "text-olive"}`} />
                </button>
              );
            })}
          </div>

          {/* Right Preview Canvas (8 Cols) */}
          <div className="lg:col-span-8 rounded-[24px] border border-bone/30 bg-smoky text-floral p-8 md:p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[440px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentState.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* State Context Header */}
                <div className="flex items-center justify-between border-b border-bone/20 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-bone animate-pulse" />
                    <span className="font-mono text-xs text-bone uppercase tracking-widest">
                      STATE {currentState.number} • {currentState.title}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-bone/80">REAL-TIME INFERENCE</span>
                </div>

                {/* Editor Context Snippet */}
                <div className="p-5 rounded-btn bg-[#171812] border border-bone/30 font-mono text-sm leading-relaxed text-bone/95 overflow-x-auto">
                  <span className="text-xs text-bone/80 block mb-2 font-sans uppercase">
                    STUDENT WORKSPACE / DIAGNOSTIC SIGNAL:
                  </span>
                  <pre className="whitespace-pre">{currentState.editorContext}</pre>
                </div>

                {/* Tutor Response */}
                <div className="pt-2">
                  <span className="font-mono text-xs text-bone/80 uppercase tracking-wider block mb-2">
                    ALGOTRACE SOCRATIC RESPONSE:
                  </span>
                  <h3 className="text-2xl md:text-3xl font-serif italic text-floral leading-snug">
                    &ldquo;{currentState.tutorResponse}&rdquo;
                  </h3>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Detail */}
            <div className="pt-6 border-t border-bone/20 mt-8 flex items-center justify-between text-xs font-mono text-bone/90">
              <span>{currentState.detail}</span>
              <span className="text-bone/80">NO SOLUTION LEAKED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
