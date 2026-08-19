"use client";

import React, { useState } from "react";
import { BookOpen, Code, AlertCircle, History } from "lucide-react";

interface ProblemPaneProps {
  title?: string;
  difficulty?: string;
  description?: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string[];
}

export function ProblemPane({
  title = "Two Sum",
  difficulty = "Easy",
  description = "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
  examples = [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
    },
  ],
  constraints = [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists.",
  ],
}: ProblemPaneProps) {
  const [activeTab, setActiveTab] = useState<"description" | "examples" | "constraints" | "submissions">("description");

  return (
    <div className="h-full bg-floral flex flex-col justify-between border-r border-smoky/15 overflow-hidden">
      {/* Pane Top Bar */}
      <div className="flex items-center gap-2 border-b border-smoky/15 px-4 bg-bone/20 font-mono text-xs text-olive">
        <button
          onClick={() => setActiveTab("description")}
          className={`py-3 px-3 border-b-2 font-semibold transition-all ${
            activeTab === "description"
              ? "border-smoky text-smoky"
              : "border-transparent text-olive hover:text-smoky"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("examples")}
          className={`py-3 px-3 border-b-2 font-semibold transition-all ${
            activeTab === "examples"
              ? "border-smoky text-smoky"
              : "border-transparent text-olive hover:text-smoky"
          }`}
        >
          Examples
        </button>
        <button
          onClick={() => setActiveTab("constraints")}
          className={`py-3 px-3 border-b-2 font-semibold transition-all ${
            activeTab === "constraints"
              ? "border-smoky text-smoky"
              : "border-transparent text-olive hover:text-smoky"
          }`}
        >
          Constraints
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`py-3 px-3 border-b-2 font-semibold transition-all ${
            activeTab === "submissions"
              ? "border-smoky text-smoky"
              : "border-transparent text-olive hover:text-smoky"
          }`}
        >
          Submissions
        </button>
      </div>

      {/* Pane Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "description" && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded-full border border-smoky/20 bg-bone/40 text-smoky font-bold uppercase">
                  {difficulty}
                </span>
                <span className="text-olive">• Hashing, Arrays</span>
              </div>
              <h1 className="text-2xl font-bold font-sans text-smoky">{title}</h1>
            </div>

            <div className="prose text-sm text-smoky/90 leading-relaxed font-sans space-y-4">
              <p>{description}</p>
            </div>

            {/* Quick Example Snippets */}
            <div className="space-y-4 pt-4 border-t border-smoky/10">
              <h3 className="font-mono text-xs text-olive uppercase tracking-wider font-semibold">
                EXAMPLE PREVIEW
              </h3>
              {examples.slice(0, 2).map((ex, i) => (
                <div key={i} className="p-4 rounded-btn bg-bone/30 border border-smoky/15 font-mono text-xs space-y-2">
                  <div>
                    <span className="text-olive block mb-1">Input:</span>
                    <code className="text-smoky font-bold">{ex.input}</code>
                  </div>
                  <div>
                    <span className="text-olive block mb-1">Output:</span>
                    <code className="text-smoky font-bold">{ex.output}</code>
                  </div>
                  {ex.explanation && (
                    <p className="text-olive text-[11px] font-sans pt-1">
                      {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "examples" && (
          <div className="space-y-6">
            <h3 className="font-mono text-xs text-olive uppercase tracking-wider font-semibold">
              ALL WORKED EXAMPLES
            </h3>
            {examples.map((ex, i) => (
              <div key={i} className="p-5 rounded-btn bg-bone/30 border border-smoky/15 font-mono text-xs space-y-3">
                <span className="font-bold text-smoky text-sm block border-b border-smoky/10 pb-2">
                  Example {i + 1}
                </span>
                <div>
                  <span className="text-olive block mb-1">Input:</span>
                  <code className="text-smoky font-bold bg-floral px-2 py-1 rounded border border-smoky/10 block">
                    {ex.input}
                  </code>
                </div>
                <div>
                  <span className="text-olive block mb-1">Output:</span>
                  <code className="text-smoky font-bold bg-floral px-2 py-1 rounded border border-smoky/10 block">
                    {ex.output}
                  </code>
                </div>
                {ex.explanation && (
                  <div>
                    <span className="text-olive block mb-1 font-sans">Explanation:</span>
                    <p className="text-smoky font-sans leading-relaxed">{ex.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "constraints" && (
          <div className="space-y-4">
            <h3 className="font-mono text-xs text-olive uppercase tracking-wider font-semibold">
              PROBLEM CONSTRAINTS
            </h3>
            <ul className="space-y-2 font-mono text-xs">
              {constraints.map((c, i) => (
                <li key={i} className="p-3 rounded-btn bg-bone/30 border border-smoky/15 text-smoky flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-smoky" />
                  <code>{c}</code>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="space-y-4 font-mono text-xs">
            <h3 className="text-olive uppercase tracking-wider font-semibold">
              PAST SUBMISSIONS
            </h3>
            <div className="p-4 rounded-btn border border-smoky/15 bg-bone/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-smoky block">Accepted (O(n))</span>
                <span className="text-olive text-[11px]">Today · 2 guidance steps used</span>
              </div>
              <span className="px-2.5 py-1 rounded bg-smoky text-floral font-bold">O(N) TIME</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
