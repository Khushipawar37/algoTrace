import vm from "node:vm";

type Primitive = string | number | boolean | null;
type JsonLike = Primitive | JsonLike[] | { [key: string]: JsonLike };

export interface ProblemTestCase {
  name: string;
  args: JsonLike[];
  expected: JsonLike;
}

export interface TestCaseResult {
  name: string;
  pass: boolean;
  input: JsonLike[];
  expected: JsonLike;
  received: JsonLike | string | null;
  error?: string;
}

const FUNCTION_BY_SLUG: Record<string, string> = {
  "two-sum": "twoSum",
  "best-time-buy-sell-stock": "maxProfit",
  "maximum-subarray": "maxSubArray",
  "longest-substring-no-repeat": "lengthOfLongestSubstring",
  "binary-search": "search",
};

const TESTS_BY_SLUG: Record<string, ProblemTestCase[]> = {
  "two-sum": [
    { name: "basic pair", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { name: "non-adjacent pair", args: [[3, 2, 4], 6], expected: [1, 2] },
    { name: "duplicate values", args: [[3, 3], 6], expected: [0, 1] },
  ],
  "best-time-buy-sell-stock": [
    { name: "typical increasing dip", args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
    { name: "always decreasing", args: [[7, 6, 4, 3, 1]], expected: 0 },
  ],
  "maximum-subarray": [
    { name: "mixed signs", args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
    { name: "all positive streak", args: [[5, 4, -1, 7, 8]], expected: 23 },
    { name: "single negative", args: [[-1]], expected: -1 },
  ],
  "longest-substring-no-repeat": [
    { name: "repeating groups", args: ["abcabcbb"], expected: 3 },
    { name: "single repeated char", args: ["bbbbb"], expected: 1 },
    { name: "empty string", args: [""], expected: 0 },
    { name: "jump left pointer", args: ["pwwkew"], expected: 3 },
  ],
  "binary-search": [
    { name: "found target", args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
    { name: "missing target", args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
    { name: "single element hit", args: [[5], 5], expected: 0 },
  ],
};

const RUNNER_TIMEOUT_MS = 1200;

function normalize(value: unknown): JsonLike | string | null {
  if (value === undefined) return null;
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  try {
    return JSON.parse(JSON.stringify(value)) as JsonLike;
  } catch {
    return String(value);
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function getSupportedProblemTests(slug: string) {
  return TESTS_BY_SLUG[slug] ?? [];
}

export function evaluateJavascriptSolution(params: { code: string; slug: string }) {
  const tests = getSupportedProblemTests(params.slug);
  const functionName = FUNCTION_BY_SLUG[params.slug];
  if (!functionName) {
    return {
      supported: false,
      stdout: [] as string[],
      stderr: [] as string[],
      results: [] as TestCaseResult[],
      summary: { total: 0, passed: 0, failed: 0 },
      reason: "No evaluator configured for this problem yet.",
    };
  }

  const stdout: string[] = [];
  const stderr: string[] = [];

  const sandbox: Record<string, unknown> = {
    console: {
      log: (...args: unknown[]) => stdout.push(args.map((item) => String(item)).join(" ")),
      error: (...args: unknown[]) => stderr.push(args.map((item) => String(item)).join(" ")),
    },
    module: { exports: {} },
    exports: {},
  };

  vm.createContext(sandbox);
  const wrappedCode = `
${params.code}
if (typeof ${functionName} !== "function") {
  throw new Error("Expected function '${functionName}' to be defined.");
}
globalThis.__candidate = ${functionName};
`;

  const loadScript = new vm.Script(wrappedCode);
  loadScript.runInContext(sandbox, { timeout: RUNNER_TIMEOUT_MS });

  const candidate = sandbox.__candidate;
  if (typeof candidate !== "function") {
    throw new Error(`Function '${functionName}' is not callable.`);
  }

  const results = tests.map((test) => {
    try {
      const received = (candidate as (...args: JsonLike[]) => unknown)(...test.args);
      const pass = deepEqual(normalize(received), test.expected);
      return {
        name: test.name,
        pass,
        input: test.args,
        expected: test.expected,
        received: normalize(received),
      } satisfies TestCaseResult;
    } catch (error) {
      return {
        name: test.name,
        pass: false,
        input: test.args,
        expected: test.expected,
        received: null,
        error: error instanceof Error ? error.message : "Runtime error",
      } satisfies TestCaseResult;
    }
  });

  const passed = results.filter((item) => item.pass).length;
  return {
    supported: true,
    stdout,
    stderr,
    results,
    summary: {
      total: results.length,
      passed,
      failed: results.length - passed,
    },
  };
}
