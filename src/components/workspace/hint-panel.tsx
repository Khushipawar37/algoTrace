import { Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";

interface HintPanelProps {
  hints: [string, string, string];
  revealedCount: number;
  onRequest: () => void;
  autoDiagnosis?: string;
}

export function HintPanel({ hints, revealedCount, onRequest, autoDiagnosis }: HintPanelProps) {
  return (
    <div className="space-y-3">
      {autoDiagnosis && (
        <div className="rounded-md border border-amber-300/60 bg-amber-50/80 p-3 text-sm text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/20 dark:text-amber-200">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide">Auto Diagnosis</p>
          <p>{autoDiagnosis}</p>
        </div>
      )}
      <Button
        onClick={onRequest}
        className="w-full"
        disabled={revealedCount >= 3}
      >
        <Lightbulb className="mr-2 h-4 w-4" />
        {revealedCount >= 3 ? "All Hints Revealed" : "Request Next Hint"}
      </Button>
      <div className="space-y-2">
        {hints.map((hint, idx) => (
          <div
            key={hint}
            className="rounded-md border border-border/60 bg-muted/40 p-3 text-sm text-muted-foreground"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide">
              Hint {idx + 1}
            </p>
            <p>
              {idx < revealedCount
                ? hint
                : "Locked until previous hint is used."}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
