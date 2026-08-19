"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell/AppShell";
import { Search, Filter, HelpCircle, ArrowUpRight } from "lucide-react";

interface ProblemRowData {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topics: string[];
  status: "solved-independent" | "solved-guidance" | "not-attempted";
  guidanceUsed: string;
  lastAttempt: string;
}

const PROBLEMS_DATA: ProblemRowData[] = [
  {
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topics: ["Hashing", "Arrays"],
    status: "solved-independent",
    guidanceUsed: "0/5",
    lastAttempt: "Aug 14",
  },
  {
    slug: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    topics: ["Two Pointers", "Sorting"],
    status: "solved-guidance",
    guidanceUsed: "2/5",
    lastAttempt: "Aug 12",
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    topics: ["Intervals", "Sorting"],
    status: "not-attempted",
    guidanceUsed: "—",
    lastAttempt: "—",
  },
  {
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topics: ["Sliding Window", "Hashing"],
    status: "solved-guidance",
    guidanceUsed: "2/5",
    lastAttempt: "Today",
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topics: ["Stacks", "Strings"],
    status: "solved-independent",
    guidanceUsed: "0/5",
    lastAttempt: "Aug 10",
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    topics: ["Binary Search", "Arrays"],
    status: "solved-guidance",
    guidanceUsed: "3/5",
    lastAttempt: "Aug 09",
  },
  {
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    topics: ["Binary Search"],
    status: "not-attempted",
    guidanceUsed: "—",
    lastAttempt: "—",
  },
  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    topics: ["Hashing", "Strings"],
    status: "not-attempted",
    guidanceUsed: "—",
    lastAttempt: "—",
  },
];

function StatusNode({ status }: { status: ProblemRowData["status"] }) {
  if (status === "solved-independent") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-smoky font-bold" title="Solved independently without solution leak">
        <span className="w-3 h-3 rounded-full bg-smoky border border-smoky" />
        <span className="hidden sm:inline">Independent</span>
      </span>
    );
  }
  if (status === "solved-guidance") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-olive font-semibold" title="Solved with Socratic progressive guidance">
        <span className="w-3 h-3 rounded-full border-2 border-smoky bg-bone" />
        <span className="hidden sm:inline">Guided</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-olive/50" title="Not attempted yet">
      <span className="w-3 h-3 rounded-full border border-smoky/30 bg-transparent" />
      <span className="hidden sm:inline">Unattempted</span>
    </span>
  );
}

export default function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [selectedDiff, setSelectedDiff] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  const filtered = PROBLEMS_DATA.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDiff = selectedDiff === "All" || p.difficulty === selectedDiff;
    const matchesTopic = selectedTopic === "All" || p.topics.includes(selectedTopic);
    return matchesSearch && matchesDiff && matchesTopic;
  });

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-smoky/10 pb-6">
          <div>
            <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
              PROBLEM CURRICULUM
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-smoky">
              Problems
            </h1>
            <p className="text-sm font-sans text-olive mt-1">
              Practice individually or follow a structured pattern trajectory.
            </p>
          </div>

          {/* Node Status Legend */}
          <div className="flex items-center gap-4 text-xs font-mono p-3 rounded-btn bg-bone/30 border border-smoky/15">
            <span className="text-olive font-semibold">LEGEND:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-smoky" />
              <span>Independent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-smoky bg-bone" />
              <span>Guided</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-smoky/40 bg-transparent" />
              <span>Unattempted</span>
            </div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-olive absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems or topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-btn bg-bone/30 border border-smoky/15 text-xs font-mono text-smoky placeholder:text-olive focus:outline-none focus:border-smoky"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto font-mono text-xs">
            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 bg-bone/30 p-1 rounded-btn border border-smoky/15">
              <span className="text-olive px-2">Diff:</span>
              {["All", "Easy", "Medium", "Hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDiff(d)}
                  className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                    selectedDiff === d
                      ? "bg-smoky text-floral font-bold"
                      : "text-olive hover:text-smoky"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Topic Filter */}
            <div className="flex items-center gap-1 bg-bone/30 p-1 rounded-btn border border-smoky/15">
              <span className="text-olive px-2">Topic:</span>
              {["All", "Hashing", "Sliding Window", "Binary Search", "Two Pointers"].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`px-2.5 py-1 rounded text-[11px] transition-all ${
                    selectedTopic === t
                      ? "bg-smoky text-floral font-bold"
                      : "text-olive hover:text-smoky"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="overflow-x-auto rounded-[24px] border border-smoky/15 bg-floral shadow-lg">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-smoky/15 font-mono text-xs text-olive uppercase tracking-wider bg-bone/20">
                <th className="py-4 px-6 font-normal w-40">STATUS</th>
                <th className="py-4 px-6 font-normal">PROBLEM</th>
                <th className="py-4 px-4 font-normal">DIFFICULTY</th>
                <th className="py-4 px-6 font-normal">TOPICS</th>
                <th className="py-4 px-4 font-normal text-center">GUIDANCE</th>
                <th className="py-4 px-6 font-normal text-right">LAST ATTEMPT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-smoky/10 font-sans text-sm">
              {filtered.map((prob) => (
                <tr
                  key={prob.slug}
                  className="hover:bg-bone/30 transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <StatusNode status={prob.status} />
                  </td>

                  <td className="py-4 px-6 font-semibold text-smoky">
                    <Link
                      href={`/problems/${prob.slug}` as any}
                      className="group-hover:text-olive transition-colors flex items-center gap-2"
                    >
                      <span>{prob.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-olive" />
                    </Link>
                  </td>

                  <td className="py-4 px-4 font-mono text-xs">
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[11px] uppercase font-semibold ${
                        prob.difficulty === "Easy"
                          ? "border-smoky/20 bg-bone/40 text-smoky"
                          : prob.difficulty === "Medium"
                          ? "border-smoky bg-smoky text-floral"
                          : "border-olive bg-olive text-floral"
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                      {prob.topics.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded border border-smoky/15 bg-bone/20 text-olive text-[11px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-mono text-xs text-olive font-semibold">
                    {prob.guidanceUsed}
                  </td>

                  <td className="py-4 px-6 text-right font-mono text-xs text-olive">
                    {prob.lastAttempt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
