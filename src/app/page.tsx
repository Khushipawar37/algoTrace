import Link from "next/link";
import { ArrowRight, BrainCircuit, ChartLine, Sparkles, TimerReset } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BrainCircuit,
    title: "Behavior-First Intelligence",
    text: "Track thought patterns like pauses, pivots, and hint dependency instead of only final answers.",
  },
  {
    icon: ChartLine,
    title: "ML Weakness Vector",
    text: "Random Forest-driven probabilities across 7 skill dimensions with interpretable signal inputs.",
  },
  {
    icon: TimerReset,
    title: "Live Coaching Loop",
    text: "Real-time heuristics update as you code, then deeper model inference runs on demand.",
  },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <div className="surface-grid absolute inset-0 -z-10 opacity-55" />
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <p className="font-[var(--font-sora)] text-xl font-semibold tracking-tight">algoTrace</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="secondary">
            <Link href="/workspace">Open Workspace</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-8">
        <div className="max-w-4xl space-y-6">
          <Badge className="bg-primary/15 text-primary">AI-Powered Behavioral Coding Coach</Badge>
          <h1 className="font-[var(--font-sora)] text-4xl font-bold leading-tight md:text-6xl">
            Stop measuring what you solved.
            <span className="block text-primary">Start measuring how you think.</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            algoTrace captures your coding behavior in real time, transforms it into ML-ready signals, and coaches you
            with Socratic prompts tailored to your weakest DSA thinking patterns.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/workspace" className="inline-flex items-center gap-2">
                Launch Live Demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">View Progress Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-12 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <Card key={title} className="backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-[var(--font-sora)]">
                <Icon className="h-5 w-5 text-primary" />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{text}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-14 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-card via-card to-secondary/40">
          <CardHeader>
            <CardTitle>System Architecture</CardTitle>
            <CardDescription>Built for real ML interviews and production extension.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Monaco Editor + Behavioral Event Stream {"->"} Feature Engineering Layer {"->"} Random Forest Inference API</p>
            <p>Heuristic Sidecar updates weakness bars instantly between model calls.</p>
            <p>Socratic Coach + Hint Escalation + Session Debrief close the feedback loop.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-card via-card to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Included in This Starter
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Next.js + TypeScript + Tailwind + shadcn-style components + theme toggle</p>
            <p>Workspace with language switching, hints, coach panel, and run/analyze loop</p>
            <p>API routes for sessions, events, inference, coaching prompts, reports, and problem recommendations</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
