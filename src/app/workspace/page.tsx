import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { CodingWorkspace } from "@/components/workspace/coding-workspace";
import { problemBank } from "@/lib/problem-bank";

export default function WorkspacePage() {
  const problem = problemBank[1];
  return (
    <main className="mx-auto w-full max-w-[1440px] space-y-4 px-4 py-5 md:px-6">
      <header className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Home
            </Link>
          </Button>
          <h1 className="font-[var(--font-sora)] text-lg font-semibold">Live Coding Workspace</h1>
        </div>
        <ThemeToggle />
      </header>
      <CodingWorkspace problem={problem} />
    </main>
  );
}

