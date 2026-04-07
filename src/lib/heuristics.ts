import type { BehavioralEvent, WeaknessVector } from "@/lib/types";

const defaultWeakness: WeaknessVector = {
  approachFinding: 32,
  edgeCaseDetection: 28,
  logicalErrors: 35,
  optimizationThinking: 42,
  dataStructureSelection: 30,
  syntaxLanguageGaps: 25,
  timeManagement: 38,
};

export function computeHeuristicWeakness(events: BehavioralEvent[]): WeaknessVector {
  const weakness = { ...defaultWeakness };
  const hintCount = events.filter((e) => e.type === "hint_requested").length;
  const pauseCount = events.filter((e) => e.type === "long_pause").length;
  const runCount = events.filter((e) => e.type === "run_attempt").length;
  const pivotCount = events.filter((e) => e.type === "approach_change").length;
  const deleteHeavy = events.filter((e) => e.type === "delete_heavy").length;

  weakness.approachFinding += pivotCount * 7;
  weakness.timeManagement += pauseCount * 6;
  weakness.optimizationThinking += pivotCount * 5;
  weakness.syntaxLanguageGaps += runCount > 3 ? 10 : 0;
  weakness.logicalErrors += runCount * 4;
  weakness.edgeCaseDetection += hintCount * 5;
  weakness.dataStructureSelection += deleteHeavy * 4;

  return clampWeakness(weakness);
}

function clampWeakness(value: WeaknessVector): WeaknessVector {
  return {
    approachFinding: clamp(value.approachFinding),
    edgeCaseDetection: clamp(value.edgeCaseDetection),
    logicalErrors: clamp(value.logicalErrors),
    optimizationThinking: clamp(value.optimizationThinking),
    dataStructureSelection: clamp(value.dataStructureSelection),
    syntaxLanguageGaps: clamp(value.syntaxLanguageGaps),
    timeManagement: clamp(value.timeManagement),
  };
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

