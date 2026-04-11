"use client";

import type { Problem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const difficultyClass: Record<string, string> = {
  Easy: "badge-easy",
  Medium: "badge-medium",
  Hard: "badge-hard",
};

export function ProblemDetail({ problem }: { problem: Problem }) {
  return (
    <div className="space-y-5 p-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-[var(--font-sora)] text-xl font-bold">{problem.title}</h2>
          <Badge className={cn("text-xs", difficultyClass[problem.tier])}>{problem.tier}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{problem.topic}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Description</h3>
        <p className="text-sm leading-relaxed text-foreground/90">{problem.description}</p>
      </div>

      {/* Examples */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Examples</h3>
        <div className="space-y-3">
          {problem.examples.map((ex, i) => (
            <div
              key={i}
              className="rounded-lg border border-border/60 bg-muted/30 p-3 font-mono text-xs"
            >
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Example {i + 1}
              </p>
              <p>
                <span className="text-muted-foreground">Input: </span>
                {ex.input}
              </p>
              <p>
                <span className="text-muted-foreground">Output: </span>
                <span className="font-semibold text-primary">{ex.output}</span>
              </p>
              {ex.explanation && (
                <p className="mt-1 text-muted-foreground">
                  <span>Explanation: </span>
                  {ex.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Constraints */}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Constraints</h3>
        <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
          {problem.constraints.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
