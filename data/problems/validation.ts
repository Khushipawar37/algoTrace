import type { ProblemSeed } from "./types";

export function validateProblemSeeds(problems: ProblemSeed[]) {
  const slugs = new Set<string>();
  for (const problem of problems) {
    if (!problem.slug || slugs.has(problem.slug)) throw new Error(`Duplicate or missing problem slug: ${problem.slug}`);
    slugs.add(problem.slug);
    if (!["EASY", "MEDIUM", "HARD"].includes(problem.difficulty)) throw new Error(`Invalid difficulty: ${problem.slug}`);
    if (!problem.title || !problem.description || !problem.primaryPattern) throw new Error(`Missing metadata: ${problem.slug}`);
    if (!problem.topics.length || problem.topics.some((topic) => !topic.trim())) throw new Error(`Invalid topics: ${problem.slug}`);
    if (!(problem.templates?.length ?? 0) || !problem.templates?.some((template) => template.language === "cpp")) throw new Error(`Missing C++ template: ${problem.slug}`);
    if ((problem.guidanceHints?.length ?? 0) !== 5 || problem.guidanceHints?.some((hint, index) => hint.level !== index + 1 || !hint.text.trim())) throw new Error(`Invalid guidance ladder: ${problem.slug}`);
    if ((problem.testCases ?? []).filter((test) => test.hidden !== false).length < 10) throw new Error(`Insufficient hidden tests: ${problem.slug}`);
    const inputs = new Set<string>();
    for (const test of problem.testCases ?? []) {
      if (!test.category || inputs.has(test.input)) throw new Error(`Duplicate or uncategorized test: ${problem.slug}`);
      inputs.add(test.input);
      if (typeof test.output !== "string") throw new Error(`Missing expected output: ${problem.slug}`);
    }
  }
  return problems;
}
