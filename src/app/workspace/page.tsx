"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, List, X } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { CodingWorkspace } from "@/components/workspace/coding-workspace";
import { ProblemDetail } from "@/components/workspace/problem-detail";
import { ProblemList } from "@/components/workspace/problem-list";
import { problemBank } from "@/lib/problem-bank";
import type { Problem } from "@/lib/types";

export default function WorkspacePage() {
  const [selected, setSelected] = useState<Problem>(problemBank[0]);
  const [showProblemPicker, setShowProblemPicker] = useState(false);
  const [showDetail, setShowDetail] = useState(true);

  return (
    <main className="flex h-screen flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border/60 bg-card/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Home
            </Link>
          </Button>
          <div className="mx-2 h-5 w-px bg-border/60" />
          <h1 className="font-[var(--font-sora)] text-lg font-semibold">Workspace</h1>
          <div className="mx-2 h-5 w-px bg-border/60" />
          <span className="max-w-[40vw] truncate text-sm text-muted-foreground">{selected.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowProblemPicker(true)}>
            <List className="mr-1 h-4 w-4" />
            Problems
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowDetail((prev) => !prev)}>
            <BookOpen className="mr-1 h-4 w-4" />
            {showDetail ? "Hide Details" : "Details"}
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {showDetail && (
          <aside className="w-[360px] shrink-0 overflow-y-auto border-r border-border/40 bg-card/30">
            <div className="border-b border-border/40 px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Current Problem</span>
            </div>
            <ProblemDetail problem={selected} />
          </aside>
        )}

        <div className="flex-1 overflow-hidden p-2 md:p-3">
          <CodingWorkspace problem={selected} />
        </div>
      </div>

      {showProblemPicker && (
        <div className="absolute inset-0 z-40 bg-black/45">
          <div className="absolute right-0 top-0 h-full w-[360px] border-l border-border/60 bg-background shadow-xl">
            <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
              <p className="text-sm font-semibold">Select Problem</p>
              <button onClick={() => setShowProblemPicker(false)} className="rounded p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ProblemList
              problems={problemBank}
              selectedSlug={selected.slug}
              onSelect={(problem) => {
                setSelected(problem);
                setShowProblemPicker(false);
                setShowDetail(true);
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
}

