import { Progress } from "@/components/ui/progress";
import type { WeaknessVector } from "@/lib/types";

const labels: { key: keyof WeaknessVector; label: string }[] = [
  { key: "approachFinding", label: "Approach Finding" },
  { key: "edgeCaseDetection", label: "Edge Cases" },
  { key: "logicalErrors", label: "Logical Errors" },
  { key: "optimizationThinking", label: "Optimization Thinking" },
  { key: "dataStructureSelection", label: "DS Selection" },
  { key: "syntaxLanguageGaps", label: "Syntax Gaps" },
  { key: "timeManagement", label: "Time Management" },
];

export function WeaknessTracker({ weakness }: { weakness: WeaknessVector }) {
  return (
    <div className="space-y-3">
      {labels.map(({ key, label }) => (
        <div key={key} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium">{weakness[key]}%</span>
          </div>
          <Progress value={weakness[key]} />
        </div>
      ))}
    </div>
  );
}

