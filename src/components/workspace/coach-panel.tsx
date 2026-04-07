"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CoachPanelProps {
  messages: string[];
  onSend: (message: string) => Promise<void>;
}

export function CoachPanel({ messages, onSend }: CoachPanelProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!input.trim()) return;
    setLoading(true);
    await onSend(input);
    setInput("");
    setLoading(false);
  }

  return (
    <div className="space-y-3">
      <div className="h-56 space-y-2 overflow-y-auto rounded-md border border-border/60 bg-muted/40 p-3">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Coach is watching your approach. Ask for guidance anytime.</p>
        ) : (
          messages.map((message, index) => (
            <p key={`${message}-${index}`} className="text-sm text-foreground">
              {message}
            </p>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void submit();
          }}
          placeholder="Ask for a nudge, not the answer..."
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none ring-primary/30 focus:ring-2"
        />
        <Button onClick={submit} disabled={loading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

