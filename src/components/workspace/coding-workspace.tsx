"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Bot, Play, Sparkles } from "lucide-react";

import { useBehaviorTracker } from "@/hooks/use-behavior-tracker";
import { buildFeatureVector } from "@/lib/feature-engineering";
import { computeHeuristicWeakness } from "@/lib/heuristics";
import type { Problem, WeaknessVector } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CoachPanel } from "@/components/workspace/coach-panel";
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

export function CodingWorkspace({ problem }: { problem: Problem }) {
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [code, setCode] = useState(problem.starterCode.javascript);
  const [hintCount, setHintCount] = useState(0);
  const [weakness, setWeakness] = useState<WeaknessVector>(fallbackWeakness);
  const [messages, setMessages] = useState<string[]>([]);
  const [startedAt] = useState(Date.now());
  const sessionId = useMemo(() => crypto.randomUUID(), []);
  const userId = "demo-user";

  const { events, track } = useBehaviorTracker({
    sessionId,
    userId,
    onLongPause: () => {
      setMessages((prev) => [...prev, "Coach: You've paused for a bit. What part feels uncertain right now?"]);
    },
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
    track("run_attempt");
    const vector = buildFeatureVector(events, startedAt);
    const response = await fetch("/api/infer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, userId, problemId: problem.id, language, events, features: vector }),
    });
    const result = (await response.json()) as { weakness: WeaknessVector };
    setWeakness(result.weakness);
  }

  async function onSendCoachMessage(message: string) {
    const response = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        code,
        weakness,
        hintLevel: hintCount,
        problemTitle: problem.title,
      }),
    });
    const data = (await response.json()) as { reply: string };
    setMessages((prev) => [...prev, `You: ${message}`, `Coach: ${data.reply}`]);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
      <Card className="overflow-hidden">
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
              <Button onClick={onRun}>
                <Play className="mr-2 h-4 w-4" />
                Run + Analyze
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <MonacoEditor
            language={language}
            value={code}
            onChange={onCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
            }}
            height="560px"
          />
        </CardContent>
      </Card>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" />
              Real-Time Weakness Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeaknessTracker weakness={weakness} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Graduated Hint System</CardTitle>
          </CardHeader>
          <CardContent>
            <HintPanel hints={problem.hints} revealedCount={hintCount} onRequest={onRequestHint} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4" />
              Socratic AI Coach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CoachPanel messages={messages} onSend={onSendCoachMessage} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

