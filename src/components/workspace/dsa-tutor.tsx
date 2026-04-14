"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  Code2,
  Lightbulb,
  MessageSquare,
  Search,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Problem, TutorHintLevel, TutorMessage, WeaknessVector } from "@/lib/types";
import { buildWelcomeMessage } from "@/lib/tutor-prompt";

/* ═══════════════════════════════════════════════════════════════════════════
   DSA GUIDE TUTOR
   A rich, Socratic AI tutor panel for DSA problem solving.
   Features: chat bubbles, quick-action chips, code sharing, typing indicator,
   markdown rendering, and multi-turn conversation with hint levels.
   ═══════════════════════════════════════════════════════════════════════════ */

interface DSATutorProps {
  problem: Problem;
  code: string;
  language: string;
  weakness: WeaknessVector;
  hintCount: number;
}

/* — Quick action chip definitions — */
const quickActions: { label: string; icon: typeof Lightbulb; hintLevel: TutorHintLevel; message: string }[] = [
  { label: "Nudge", icon: Lightbulb, hintLevel: "nudge", message: "Give me a nudge — just a small hint to point me in the right direction." },
  { label: "Guided", icon: MessageSquare, hintLevel: "guided", message: "I'd like a guided hint — help me narrow down the approach." },
  { label: "Structural", icon: Sparkles, hintLevel: "structural", message: "Give me a structural hint — I need the algorithm outline and key invariants." },
  { label: "Analyze Code", icon: Code2, hintLevel: "guided", message: "Please analyze my current code — what's wrong and how can I fix it?" },
  { label: "Complexity", icon: Search, hintLevel: "guided", message: "What's the time and space complexity of my current approach? How can I optimize?" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   SIMPLE MARKDOWN RENDERER
   Handles bold, inline code, code blocks, bullet lists, and headers.
   ═══════════════════════════════════════════════════════════════════════════ */

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = "";
  let blockIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
        codeBuffer = [];
        continue;
      } else {
        inCodeBlock = false;
        nodes.push(
          <div key={`code-${blockIndex++}`} className="tutor-code-block my-2 overflow-x-auto rounded-lg border border-border/50 bg-[hsl(var(--background))] p-3">
            {codeLanguage && (
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {codeLanguage}
              </div>
            )}
            <pre className="text-xs leading-relaxed">
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          </div>,
        );
        continue;
      }
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Empty lines
    if (line.trim() === "") {
      nodes.push(<div key={`br-${i}`} className="h-1.5" />);
      continue;
    }

    // Render inline formatting
    nodes.push(
      <div key={`line-${i}`} className={getLineClass(line)}>
        {renderInline(line)}
      </div>,
    );
  }

  return nodes;
}

function getLineClass(line: string): string {
  const trimmed = line.trim();
  if (trimmed.startsWith("# ")) return "text-base font-bold mt-2 mb-1";
  if (trimmed.startsWith("## ")) return "text-sm font-bold mt-2 mb-1";
  if (trimmed.startsWith("### ")) return "text-sm font-semibold mt-1.5 mb-0.5";
  if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) return "ml-3 text-sm leading-relaxed before:content-['•'] before:mr-1.5 before:text-primary/60";
  if (/^\d+\.\s/.test(trimmed)) return "ml-3 text-sm leading-relaxed";
  return "text-sm leading-relaxed";
}

function renderInline(text: string): React.ReactNode[] {
  // Strip heading markers
  let cleaned = text;
  if (cleaned.trim().startsWith("### ")) cleaned = cleaned.replace(/^###\s+/, "");
  else if (cleaned.trim().startsWith("## ")) cleaned = cleaned.replace(/^##\s+/, "");
  else if (cleaned.trim().startsWith("# ")) cleaned = cleaned.replace(/^#\s+/, "");

  // Split by bold and inline code
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleaned.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`b-${match.index}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={`c-${match.index}`} className="rounded bg-muted/60 px-1.5 py-0.5 text-xs font-mono text-primary">
          {token.slice(1, -1)}
        </code>,
      );
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < cleaned.length) {
    parts.push(cleaned.slice(lastIndex));
  }

  return parts;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function DSATutor({ problem, code, language, weakness, hintCount }: DSATutorProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState<TutorHintLevel>("nudge");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const problemIdRef = useRef(problem.id);

  /* — Scroll to bottom — */
  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }
  }, []);

  /* — Track scroll position for "scroll to bottom" button — */
  const handleScroll = useCallback(() => {
    if (!chatRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
  }, []);

  /* — Initialize with welcome message when problem changes — */
  useEffect(() => {
    if (problem.id !== problemIdRef.current || !initialized) {
      problemIdRef.current = problem.id;
      const welcome: TutorMessage = {
        id: crypto.randomUUID(),
        role: "tutor",
        content: buildWelcomeMessage(problem),
        timestamp: Date.now(),
      };
      setMessages([welcome]);
      setInitialized(true);
      setCurrentHintLevel("nudge");
    }
  }, [problem, initialized]);

  /* — Auto-scroll on new messages — */
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /* — Send a message to the tutor API — */
  const sendMessage = useCallback(
    async (messageText: string, hintLevel: TutorHintLevel, includeCode = false) => {
      if (!messageText.trim() || loading) return;

      const userMsg: TutorMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: messageText,
        timestamp: Date.now(),
        hintLevel,
        codeSnapshot: includeCode ? code : undefined,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const response = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            problem,
            code,
            language,
            weakness,
            hintLevel,
            conversation: [...messages, userMsg].slice(-20), // keep last 20 messages for context
            userMessage: messageText,
            hintCount,
          }),
        });

        const data = (await response.json()) as { reply: string; source: string };

        const tutorMsg: TutorMessage = {
          id: crypto.randomUUID(),
          role: "tutor",
          content: data.reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, tutorMsg]);
      } catch {
        const errorMsg: TutorMessage = {
          id: crypto.randomUUID(),
          role: "tutor",
          content: "Sorry, I had trouble connecting. Please try again in a moment! 🔧",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [code, hintCount, language, loading, messages, problem, weakness],
  );

  /* — Handle form submit — */
  const handleSubmit = useCallback(() => {
    if (input.trim()) {
      // Auto-detect hint level from keywords
      const lower = input.toLowerCase();
      let detectedLevel = currentHintLevel;
      if (lower.includes("nudge")) detectedLevel = "nudge";
      else if (lower.includes("guided")) detectedLevel = "guided";
      else if (lower.includes("structural")) detectedLevel = "structural";
      else if (lower.includes("skeleton") || lower.includes("pseudocode")) detectedLevel = "skeleton";
      else if (lower.includes("full solution") || lower.includes("complete solution")) detectedLevel = "full_solution";

      // Auto-include code if asking for analysis
      const includeCode = lower.includes("analyze") || lower.includes("review") ||
        lower.includes("check my") || lower.includes("debug") || lower.includes("what's wrong") ||
        lower.includes("code");

      sendMessage(input, detectedLevel, includeCode);
    }
  }, [currentHintLevel, input, sendMessage]);

  /* — Quick action click — */
  const handleQuickAction = useCallback(
    (action: (typeof quickActions)[number]) => {
      setCurrentHintLevel(action.hintLevel);
      const includeCode = action.label === "Analyze Code" || action.label === "Complexity";
      sendMessage(action.message, action.hintLevel, includeCode);
    },
    [sendMessage],
  );

  /* — Share code manually — */
  const handleShareCode = useCallback(() => {
    const codeMsg: TutorMessage = {
      id: crypto.randomUUID(),
      role: "system",
      content: `📎 Code snapshot shared (${language})`,
      timestamp: Date.now(),
      codeSnapshot: code,
    };
    setMessages((prev) => [...prev, codeMsg]);
  }, [code, language]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">DSA Guide Tutor</h3>
            <p className="text-[10px] text-muted-foreground">Socratic • Scaffolded • Never spoon-feeds</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <select
            value={currentHintLevel}
            onChange={(e) => setCurrentHintLevel(e.target.value as TutorHintLevel)}
            className="h-7 rounded-md border border-border/60 bg-background px-2 text-[11px] font-medium outline-none ring-primary/30 focus:ring-2"
            title="Default hint level"
          >
            <option value="nudge">Nudge</option>
            <option value="guided">Guided</option>
            <option value="structural">Structural</option>
            <option value="skeleton">Skeleton</option>
            <option value="full_solution">Full Solution</option>
          </select>
          <button
            onClick={handleShareCode}
            className="tutor-chip flex h-7 items-center gap-1 rounded-md border border-border/60 bg-muted/40 px-2 text-[11px] font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
            title="Share current code with tutor"
          >
            <Code2 className="h-3 w-3" />
            Share Code
          </button>
        </div>
      </div>

      {/* Chat messages area */}
      <div
        ref={chatRef}
        onScroll={handleScroll}
        className="flex-1 space-y-3 overflow-y-auto px-3 py-3 scroll-smooth"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`tutor-message-wrapper ${msg.role === "user" ? "flex justify-end" : msg.role === "system" ? "flex justify-center" : "flex justify-start"}`}>
            {msg.role === "tutor" && (
              <div className="tutor-bubble-tutor relative max-w-[92%] rounded-2xl rounded-tl-sm border border-border/40 bg-card/80 px-4 py-3 shadow-sm">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">Tutor</span>
                </div>
                <div className="tutor-content">{renderMarkdown(msg.content)}</div>
              </div>
            )}
            {msg.role === "user" && (
              <div className="tutor-bubble-user relative max-w-[85%] rounded-2xl rounded-tr-sm border border-primary/20 bg-primary/10 px-4 py-3">
                <div className="mb-1 flex items-center justify-end gap-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">You</span>
                </div>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                {msg.codeSnapshot && (
                  <div className="mt-2 rounded-lg border border-border/30 bg-background/60 p-2">
                    <p className="mb-1 text-[10px] font-medium text-muted-foreground">📎 Code attached</p>
                    <pre className="max-h-24 overflow-auto text-xs">
                      <code>{msg.codeSnapshot.slice(0, 500)}{msg.codeSnapshot.length > 500 ? "\n..." : ""}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}
            {msg.role === "system" && (
              <div className="rounded-xl border border-border/30 bg-muted/30 px-3 py-2">
                <p className="text-xs text-muted-foreground">{msg.content}</p>
                {msg.codeSnapshot && (
                  <details className="mt-1.5">
                    <summary className="cursor-pointer text-[11px] font-medium text-primary/70 hover:text-primary">View code snapshot</summary>
                    <pre className="mt-1.5 max-h-32 overflow-auto rounded-lg border border-border/30 bg-background p-2 text-xs">
                      <code>{msg.codeSnapshot}</code>
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm border border-border/40 bg-card/80 px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <div className="tutor-typing flex items-center gap-1">
                  <span className="tutor-dot" />
                  <span className="tutor-dot" style={{ animationDelay: "0.15s" }} />
                  <span className="tutor-dot" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-[140px] left-1/2 z-10 -translate-x-1/2">
          <button
            onClick={scrollToBottom}
            className="flex items-center gap-1 rounded-full border border-border/60 bg-card/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-sm transition-all hover:bg-primary/10 hover:text-primary"
          >
            <ChevronDown className="h-3 w-3" />
            New messages
          </button>
        </div>
      )}

      {/* Quick action chips */}
      <div className="flex gap-1.5 overflow-x-auto border-t border-border/30 px-3 py-2 scrollbar-hide">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action)}
              disabled={loading}
              className="tutor-chip flex shrink-0 items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:opacity-50"
            >
              <Icon className="h-3 w-3" />
              {action.label}
            </button>
          );
        })}
      </div>

      {/* Input area */}
      <div className="border-t border-border/50 bg-card/30 px-3 py-2.5">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={"Ask about your approach, say \"nudge\", or describe where you're stuck..."}
            className="h-10 w-full rounded-xl border border-border/60 bg-background px-4 text-sm outline-none ring-primary/30 transition-shadow placeholder:text-muted-foreground/50 focus:ring-2"
            disabled={loading}
          />
          <Button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            size="sm"
            className="h-10 w-10 shrink-0 rounded-xl"
          >
            {loading ? (
              <Zap className="h-4 w-4 animate-pulse" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
          Tip: Use quick action chips above, or type freely. Say &quot;nudge&quot; or &quot;guided&quot; to set hint level.
        </p>
      </div>
    </div>
  );
}
