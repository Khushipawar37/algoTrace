"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

import type { Problem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProblemListProps {
  problems: Problem[];
  selectedSlug?: string;
  onSelect: (problem: Problem) => void;
}

const difficultyClass: Record<string, string> = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

export function ProblemList({ problems, selectedSlug, onSelect }: ProblemListProps) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.topic.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficulty === "All" || p.tier === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [problems, search, difficulty]);

  const counts = useMemo(() => {
    const c = { All: problems.length, Easy: 0, Medium: 0, Hard: 0 };
    problems.forEach((p) => { c[p.tier]++; });
    return c;
  }, [problems]);

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b border-border/40 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none ring-primary/30 focus:ring-2"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Filter className="h-3 w-3" />
          Filters
        </button>

        {showFilters && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {(["All", "Easy", "Medium", "Hard"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  difficulty === d
                    ? d === "All"
                      ? "bg-primary/15 text-primary"
                      : difficultyClass[d]
                    : "bg-muted/50 text-muted-foreground hover:bg-muted",
                )}
              >
                {d} ({counts[d]})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="p-4 text-center text-sm text-muted-foreground">No problems found.</p>
        ) : (
          filtered.map((problem, index) => (
            <button
              key={problem.id}
              onClick={() => onSelect(problem)}
              className={cn(
                "stagger-item w-full border-b border-border/30 px-4 py-3 text-left transition-colors hover:bg-muted/40",
                selectedSlug === problem.slug && "bg-primary/5 border-l-2 border-l-primary",
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium leading-tight">{problem.title}</p>
                <Badge className={cn("shrink-0 text-[10px]", difficultyClass[problem.tier])}>
                  {problem.tier}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{problem.topic}</p>
            </button>
          ))
        )}
      </div>

      <div className="border-t border-border/40 px-4 py-2">
        <p className="text-xs text-muted-foreground">
          {filtered.length} of {problems.length} problems
        </p>
      </div>
    </div>
  );
}
