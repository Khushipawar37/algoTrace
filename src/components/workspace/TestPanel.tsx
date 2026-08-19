"use client";

import React, { useState } from "react";
import { Check, Plus, Terminal, CheckCircle2, AlertCircle } from "lucide-react";

interface TestPanelProps {
  testCases?: Array<{
    id: number;
    input: string;
    target: string;
    expected: string;
    passed?: boolean;
  }>;
}

export function TestPanel({
  testCases = [
    { id: 1, input: "[2,7,11,15]", target: "9", expected: "[0,1]", passed: true },
    { id: 2, input: "[3,2,4]", target: "6", expected: "[1,2]", passed: true },
    { id: 3, input: "[3,3]", target: "6", expected: "[0,1]", passed: false },
  ],
}: TestPanelProps) {
  const [activeTab, setActiveTab] = useState<"cases" | "result" | "console">("cases");
  const [selectedCase, setSelectedCase] = useState(1);

  const passedCount = testCases.filter((c) => c.passed).length;
  const currentCase = testCases.find((c) => c.id === selectedCase) || testCases[0];

  return (
    <div className="h-full bg-smoky text-floral border-t border-bone/20 flex flex-col justify-between overflow-hidden font-mono text-xs">
      {/* Tab Header */}
      <div className="h-10 px-4 border-b border-bone/20 bg-[#171812] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("cases")}
            className={`py-2 px-2 border-b-2 font-semibold transition-colors ${
              activeTab === "cases" ? "border-bone text-bone" : "border-transparent text-bone/60 hover:text-floral"
            }`}
          >
            Test Cases ({testCases.length})
          </button>
          <button
            onClick={() => setActiveTab("result")}
            className={`py-2 px-2 border-b-2 font-semibold transition-colors ${
              activeTab === "result" ? "border-bone text-bone" : "border-transparent text-bone/60 hover:text-floral"
            }`}
          >
            Result ({passedCount}/{testCases.length} passed)
          </button>
          <button
            onClick={() => setActiveTab("console")}
            className={`py-2 px-2 border-b-2 font-semibold transition-colors ${
              activeTab === "console" ? "border-bone text-bone" : "border-transparent text-bone/60 hover:text-floral"
            }`}
          >
            Console Output
          </button>
        </div>

        <button className="px-2.5 py-1 rounded border border-bone/30 text-bone hover:bg-bone/10 transition-colors flex items-center gap-1">
          <Plus className="w-3 h-3" />
          <span>Add test</span>
        </button>
      </div>

      {/* Panel Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {activeTab === "cases" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {testCases.map((tc) => (
                <button
                  key={tc.id}
                  onClick={() => setSelectedCase(tc.id)}
                  className={`px-3 py-1.5 rounded border text-xs transition-colors flex items-center gap-1.5 ${
                    selectedCase === tc.id
                      ? "border-bone bg-bone text-smoky font-bold"
                      : "border-bone/20 bg-smoky text-bone/70 hover:border-bone/40"
                  }`}
                >
                  <span>Case {tc.id}</span>
                  {tc.passed ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full border border-current bg-transparent" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-btn bg-[#171812] border border-bone/20 space-y-3">
              <div>
                <span className="text-bone/60 block mb-1">nums =</span>
                <input
                  type="text"
                  defaultValue={currentCase.input}
                  className="w-full bg-smoky border border-bone/30 text-bone px-3 py-1.5 rounded focus:outline-none focus:border-bone"
                />
              </div>

              <div>
                <span className="text-bone/60 block mb-1">target =</span>
                <input
                  type="text"
                  defaultValue={currentCase.target}
                  className="w-full bg-smoky border border-bone/30 text-bone px-3 py-1.5 rounded focus:outline-none focus:border-bone"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "result" && (
          <div className="space-y-4">
            <div className="p-4 rounded-btn border border-bone/30 bg-[#171812] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-bone" />
                <span className="font-bold text-floral">
                  {passedCount} / {testCases.length} Test Cases Passed
                </span>
              </div>
              <span className="text-bone/70 text-xs">Runtime: 12ms</span>
            </div>

            <div className="space-y-2">
              {testCases.map((tc) => (
                <div
                  key={tc.id}
                  className={`p-3 rounded-btn border flex items-center justify-between ${
                    tc.passed
                      ? "border-bone/30 bg-bone/10 text-floral"
                      : "border-dashed border-bone/40 bg-smoky text-bone/90"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {tc.passed ? (
                      <span className="px-2 py-0.5 rounded bg-bone text-smoky font-bold text-[10px]">
                        PASSED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded border border-bone text-bone text-[10px]">
                        FAILED
                      </span>
                    )}
                    <span>Case {tc.id}: {tc.input}</span>
                  </div>

                  <span className="text-bone/70">
                    Expected: {tc.expected}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "console" && (
          <div className="p-4 rounded-btn bg-[#171812] border border-bone/20 space-y-1 font-mono text-xs text-bone/90">
            <div>[AST Scan] Initialized vector parameters...</div>
            <div>[Execution] twoSum(nums=[2,7,11,15], target=9) -&gt; returned [0,1]</div>
            <div>[Execution] twoSum(nums=[3,2,4], target=6) -&gt; returned [1,2]</div>
            <div>[Execution Log] Test suite completed in 12ms.</div>
          </div>
        )}
      </div>
    </div>
  );
}
