import type { BehavioralEvent, FeatureVector } from "@/lib/types";

export function buildFeatureVector(events: BehavioralEvent[], startedAt: number): FeatureVector {
  const firstStart = events.find((event) => event.type === "start_coding");
  const runAttempts = events.filter((event) => event.type === "run_attempt").length;
  const hints = events.filter((event) => event.type === "hint_requested").length;
  const pauses = events.filter((event) => event.type === "long_pause").length;
  const pivots = events.filter((event) => event.type === "approach_change").length;
  const heavyDeletes = events.filter((event) => event.type === "delete_heavy").length;

  const elapsedMinutes = Math.max(1, (Date.now() - startedAt) / 60000);

  return {
    time_to_first_char: firstStart ? (firstStart.timestamp - startedAt) / 1000 : 999,
    pause_frequency: pauses / elapsedMinutes,
    delete_ratio: Math.min(1, heavyDeletes / Math.max(1, events.length)),
    approach_pivots: pivots,
    hint_dependency_rate: hints / 3,
    run_attempt_count: runAttempts,
    time_per_complexity_tier: elapsedMinutes,
    error_pattern_clusters: Math.min(5, runAttempts),
    brute_force_persistence: pivots === 0 ? 1 : 0.4,
    line_edit_churn: Math.min(20, events.length / 2),
  };
}

