export type SeedDifficulty = "EASY" | "MEDIUM" | "HARD";
export type ProblemSeed = {
  title: string; slug: string; difficulty: SeedDifficulty; topics: string[];
  description: string; constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string; driverCode: string; functionName: string;
  tests: { input: string; output: string; hidden?: boolean }[];
  comparison?: "EXACT" | "TRIMMED" | "TOKENS" | "UNORDERED";
  expectedTimeComplexity?: string; expectedSpaceComplexity?: string;
};
