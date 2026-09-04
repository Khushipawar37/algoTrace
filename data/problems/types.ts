export type SeedDifficulty = "EASY" | "MEDIUM" | "HARD";
export type ComparisonMode = "EXACT" | "TRIMMED" | "TOKENS" | "UNORDERED";

export type ProblemExampleSeed = {
  input: string;
  output: string;
  explanation?: string;
};

export type ProblemTemplateSeed = {
  language: "cpp";
  languageVersion: "C++20";
  starterCode: string;
  driverCode: string;
  functionName: string;
};

export type TestCaseSeed = {
  input: string;
  output: string;
  hidden?: boolean;
  category: string;
};

export type GuidanceHintSeed = {
  level: 1 | 2 | 3 | 4 | 5;
  text: string;
};

export type ProblemSeed = {
  title: string;
  slug: string;
  difficulty: SeedDifficulty;
  description: string;
  constraints: string[];
  topics: string[];
  primaryPattern?: string;
  secondaryPatterns?: string[];
  prerequisiteTopics?: string[];
  expectedTimeComplexity: string;
  expectedSpaceComplexity?: string;
  commonMistakes?: string[];
  examples: ProblemExampleSeed[];
  templates: ProblemTemplateSeed[];
  testCases: TestCaseSeed[];
  guidanceHints: GuidanceHintSeed[];
  comparison?: ComparisonMode;
};

export type ProblemDefinition = Omit<ProblemSeed, "templates" | "testCases"> & {
  starterCode: string;
  driverCode: string;
  functionName: string;
  curatedTests: { input: string; category: string; hidden?: boolean }[];
  generatedTests?: { input: string; category: string }[];
};
