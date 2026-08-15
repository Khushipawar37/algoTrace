"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Play, Sparkles } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { useBehaviorTracker } from "@/hooks/use-behavior-tracker";
import { buildFeatureVector } from "@/lib/feature-engineering";
import { computeHeuristicWeakness } from "@/lib/heuristics";
import type { Problem, WeaknessVector } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DSATutor } from "@/components/workspace/dsa-tutor";
import { HintPanel } from "@/components/workspace/hint-panel";
import { WeaknessTracker } from "@/components/workspace/weakness-tracker";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const fallbackWeakness: WeaknessVector = {
  approachFinding: 28,
  edgeCaseDetection: 22,
  logicalErrors: 30,
  optimizationThinking: 40,
  dataStructureSelection: 24,
  syntaxLanguageGaps: 20,
  timeManagement: 34,
};

type SupportedLanguage = "javascript" | "python" | "cpp" | "java";
type TestResult = {
  name: string;
  pass: boolean;
  input: unknown[];
  expected: unknown;
  received: unknown;
  error?: string;
};

type TestApiResponse = {
  supported: boolean;
  message?: string;
  reason?: string;
  stdout: string[];
  stderr: string[];
  results: TestResult[];
  summary: { total: number; passed: number; failed: number };
};

export function CodingWorkspace({ problem }: { problem: Problem }) {
  const { resolvedTheme } = useTheme();
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState(problem.starterCode.javascript);
  const [hintCount, setHintCount] = useState(0);
  const [weakness, setWeakness] = useState<WeaknessVector>(fallbackWeakness);
  const [running, setRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [runSummary, setRunSummary] = useState<{ total: number; passed: number; failed: number } | null>(null);
  const [autoDiagnosis, setAutoDiagnosis] = useState<string | undefined>(undefined);
  const [testContext, setTestContext] = useState<string | undefined>(undefined);
  const [startedAt] = useState(Date.now());
  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const userId = "demo-user";

  const { events, track } = useBehaviorTracker({
    sessionId,
    userId,
  });

  function onCodeChange(newCode: string | undefined) {
    const next = newCode ?? "";
    if (!events.length) {
      track("start_coding");
    }
    if (next.length < code.length * 0.7) {
      track("delete_heavy", { previousLength: code.length, currentLength: next.length });
    }
    setCode(next);
    setWeakness(computeHeuristicWeakness(events));
  }

  function onRequestHint() {
    if (hintCount >= 3) return;
    setHintCount((count) => count + 1);
    track("hint_requested", { level: hintCount + 1 });
  }

  async function onRun() {
    setRunning(true);
    track("run_attempt");
    setAutoDiagnosis(undefined);
    setTestContext(undefined);
    try {
      const testResponse = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: problem.slug, language, code }),
      });
      const testData = (await testResponse.json()) as TestApiResponse;
      setTestResults(testData.results ?? []);
      setRunSummary(testData.summary ?? null);

      const outputLines = [
        ...(testData.message ? [testData.message] : []),
        ...(testData.reason ? [testData.reason] : []),
        ...(testData.stdout ?? []),
        ...(testData.stderr ?? []).map((line) => `[stderr] ${line}`),
      ];
      setRunOutput(outputLines);

      const firstFailure = (testData.results ?? []).find((result) => !result.pass);
      if (firstFailure) {
        const diagnosis = `Try a dry run with input ${JSON.stringify(firstFailure.input)}. Your output was ${JSON.stringify(firstFailure.received)} but expected ${JSON.stringify(firstFailure.expected)}. What step first diverges?`;
        setAutoDiagnosis(diagnosis);
        setTestContext(diagnosis);
      } else if (testData.supported && (testData.summary?.total ?? 0) > 0) {
        const diagnosis = "Great progress. All visible tests passed. Ask the tutor for edge-case stress tests next.";
        setAutoDiagnosis(diagnosis);
        setTestContext(diagnosis);
      } else {
        setAutoDiagnosis(undefined);
        setTestContext(undefined);
      }

      const vector = buildFeatureVector(events, startedAt);
      const inferResponse = await fetch("/api/infer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId, problemId: problem.id, language, events, features: vector }),
      });
      const inferResult = (await inferResponse.json()) as { weakness: WeaknessVector };
      setWeakness(inferResult.weakness);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid h-full gap-3 lg:grid-cols-[minmax(0,1fr)_440px]">
      {/* Left column: editor takes maximum space */}
      <div className="flex h-full flex-col overflow-hidden">
        <Card className="flex h-full flex-col overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-muted/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{problem.title}</CardTitle>
                <CardDescription>{problem.prompt}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                  value={language}
                  onChange={(event) => {
                    const nextLanguage = event.target.value as SupportedLanguage;
                    setLanguage(nextLanguage);
                    setCode(problem.starterCode[nextLanguage]);
                    track("language_switch", { language: nextLanguage });
                  }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                </select>
                <Button onClick={onRun} disabled={running}>
                  <Play className="mr-2 h-4 w-4" />
                  {running ? "Running..." : "Run + Analyze"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col p-0">
            <div className="min-h-0 flex-1">
              <MonacoEditor
                language={language}
                value={code}
                onChange={onCodeChange}
                theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  lineNumbers: "on",
                  fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                  automaticLayout: true,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  linkedEditing: true,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  bracketPairColorization: { enabled: true },
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                  formatOnPaste: true,
                  formatOnType: true,
                  tabSize: 2,
                  scrollBeyondLastLine: false,
                }}
                height="100%"
              />
            </div>
            <div className="shrink-0 border-t border-border/60 bg-muted/30 p-2">
              {runSummary && (
                <p className="mb-1 text-xs text-muted-foreground">
                  Tests: {runSummary.passed}/{runSummary.total} passed
                </p>
              )}
              <div className="max-h-20 overflow-auto rounded-md border border-border/60 bg-background/80 p-2 font-mono text-xs">
                {runOutput.length ? runOutput.join("\n") : "Run output will appear here."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column: Tutor on top, hints/weakness below */}
      <div className="flex h-full flex-col gap-3">
        <Card className="relative min-h-0 flex-1 overflow-hidden">
          <DSATutor
            problem={problem}
            code={code}
            language={language}
            weakness={weakness}
            hintCount={hintCount}
            testContext={testContext}
          />
        </Card>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Weakness Tracker
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <WeaknessTracker weakness={weakness} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Graduated Hints</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <HintPanel hints={problem.hints} revealedCount={hintCount} onRequest={onRequestHint} autoDiagnosis={autoDiagnosis} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Test Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
              <div className="max-h-32 overflow-auto rounded-md border border-border/60 bg-muted/40 p-2 text-xs">
                {testResults.length ? (
                  testResults.map((result) => (
                    <p key={result.name} className={result.pass ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}>
                      {result.pass ? "PASS" : "FAIL"} - {result.name}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground">No test results yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
