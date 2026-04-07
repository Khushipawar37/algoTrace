import type { FeatureVector, WeaknessVector } from "@/lib/types";

const weaknessKeys: (keyof WeaknessVector)[] = [
  "approachFinding",
  "edgeCaseDetection",
  "logicalErrors",
  "optimizationThinking",
  "dataStructureSelection",
  "syntaxLanguageGaps",
  "timeManagement",
];

function fallbackModel(features: FeatureVector): WeaknessVector {
  const base = Math.min(100, 20 + features.pause_frequency * 22 + features.hint_dependency_rate * 30);
  return {
    approachFinding: Math.round(base + features.approach_pivots * 8),
    edgeCaseDetection: Math.round(base + features.error_pattern_clusters * 5),
    logicalErrors: Math.round(base + features.run_attempt_count * 4),
    optimizationThinking: Math.round(base + features.brute_force_persistence * 20),
    dataStructureSelection: Math.round(base + features.delete_ratio * 35),
    syntaxLanguageGaps: Math.round(base + features.run_attempt_count * 2),
    timeManagement: Math.round(base + features.time_per_complexity_tier * 1.2),
  };
}

export async function inferWeakness(features: FeatureVector): Promise<WeaknessVector> {
  const mlUrl = process.env.ML_SERVICE_URL;
  if (!mlUrl) {
    return fallbackModel(features);
  }

  try {
    const response = await fetch(`${mlUrl}/infer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("ML service unavailable");
    const data = (await response.json()) as Partial<WeaknessVector>;

    return weaknessKeys.reduce((acc, key) => {
      acc[key] = Math.max(0, Math.min(100, Math.round(data[key] ?? fallbackModel(features)[key])));
      return acc;
    }, {} as WeaknessVector);
  } catch {
    return fallbackModel(features);
  }
}

