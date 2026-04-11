"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronLeft, List } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { CodingWorkspace } from "@/components/workspace/coding-workspace";
import { ProblemDetail } from "@/components/workspace/problem-detail";
import { ProblemList } from "@/components/workspace/problem-list";
import { problemBank } from "@/lib/problem-bank";
import type { Problem } from "@/lib/types";

export default function WorkspacePage() {
  const [selected, setSelected] = useState<Problem | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  return (
    <main className="flex h-screen flex-col">
      {/* Header */}
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
          {selected && (
            <>
              <div className="mx-2 h-5 w-px bg-border/60" />
              <span className="text-sm text-muted-foreground">{selected.title}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selected && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="hidden lg:inline-flex"
              >
                <List className="mr-1 h-4 w-4" />
                Problems
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetail(!showDetail)}
              >
                <BookOpen className="mr-1 h-4 w-4" />
                Details
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Problem list sidebar */}
        {showSidebar && (
          <aside className="w-[320px] shrink-0 border-r border-border/40 bg-card/50 max-lg:absolute max-lg:inset-y-[57px] max-lg:left-0 max-lg:z-30 max-lg:w-[300px] max-lg:shadow-xl">
            <ProblemList
              problems={problemBank}
              selectedSlug={selected?.slug}
              onSelect={(p) => {
                setSelected(p);
                setShowDetail(false);
                // Close sidebar on mobile after selection
                if (window.innerWidth < 1024) setShowSidebar(false);
              }}
            />
          </aside>
        )}

        {/* Workspace area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {!selected ? (
            /* No problem selected — show welcome */
            <div className="flex flex-1 items-center justify-center p-8">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-[var(--font-sora)] text-2xl font-bold">
                  Select a Problem
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Choose from {problemBank.length} curated DSA problems from Striver&apos;s sheet.
                  Filter by difficulty, search by topic, and start coding.
                </p>
                <Button
                  className="mt-6"
                  onClick={() => setShowSidebar(true)}
                >
                  <List className="mr-2 h-4 w-4" />
                  Browse Problems
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 overflow-hidden">
              {/* Problem detail panel (toggleable) */}
              {showDetail && (
                <div className="w-[380px] shrink-0 overflow-y-auto border-r border-border/40 bg-card/30 max-lg:absolute max-lg:inset-y-[57px] max-lg:left-0 max-lg:z-20 max-lg:w-[340px] max-lg:shadow-xl max-lg:bg-background">
                  <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Problem Details
                    </span>
                    <button
                      onClick={() => setShowDetail(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  </div>
                  <ProblemDetail problem={selected} />
                </div>
              )}

              {/* Editor area */}
              <div className="flex-1 overflow-y-auto p-4">
                <CodingWorkspace problem={selected} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
