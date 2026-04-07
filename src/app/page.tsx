"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  ChartLine,
  Code2,
  Cpu,
  FlaskConical,
  Sparkles,
  TimerReset,
  Workflow,
} from "lucide-react";
import { motion } from "framer-motion";

import { HowItWorks } from "@/components/landing/how-it-works";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const coreFeatures = [
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

const tickerItems = [
  "Behavioral Tracking",
  "Random Forest Classifier",
  "Socratic AI Coach",
  "Real-time Weakness Detection",
  "Session Debrief Reports",
  "Feature Engineering Pipeline",
];

const productFeatures = [
  { icon: ChartLine, title: "Live weakness tracker", text: "Scores update as you type and adjust strategy." },
  { icon: Cpu, title: "FastAPI ML service", text: "Predict weakness vectors from engineered signals." },
  { icon: Workflow, title: "Graduated hints", text: "Conceptual to near-solution hints with strict progression." },
  { icon: Code2, title: "Monaco workspace", text: "Python, JavaScript, C++, and Java in one controlled environment." },
  { icon: FlaskConical, title: "Interview-ready architecture", text: "Rules + ML dual-layer loop, explainable and practical." },
  { icon: TimerReset, title: "Time-aware coaching", text: "Long pause detection triggers nudges before frustration spikes." },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <div className="surface-grid absolute inset-0 -z-10 opacity-40" />
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

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl space-y-6"
        >
          <Badge className="bg-primary/15 text-primary">AI-Powered Behavioral Coding Coach</Badge>
          <h1 className="font-[var(--font-sora)] text-4xl font-bold leading-tight md:text-6xl">
            Stop solving blindly.
            <span className="block text-primary">Start understanding how you think.</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            algoTrace captures your coding behavior in real time, transforms it into ML-ready signals, and coaches you
            with Socratic prompts tailored to your weakest DSA thinking patterns.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/workspace" className="inline-flex items-center gap-2">
                Start Solving
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">View Progress Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section className="overflow-hidden border-y border-border/60 bg-muted/40 py-3">
        <div className="ticker flex w-[200%]">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={`${item}-${i}`} className="flex shrink-0 items-center px-6 text-xs text-muted-foreground">
              <span className="font-semibold text-primary">{item}</span>
              <span className="px-3 text-border">·</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-12 md:grid-cols-5">
        {[
          { n: "7", l: "Weakness dimensions" },
          { n: "12+", l: "Behavioral features" },
          { n: "RF", l: "Model core" },
          { n: "0", l: "Direct answers" },
          { n: "∞", l: "Socratic prompts" },
        ].map((stat) => (
          <Card key={stat.l} className="text-center">
            <CardContent className="p-4">
              <p className="font-[var(--font-sora)] text-3xl font-bold text-primary">{stat.n}</p>
              <p className="text-xs text-muted-foreground">{stat.l}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-6 pb-12">
        <div className="text-center">
          <Badge className="bg-primary/15 text-primary">How It Works</Badge>
          <h2 className="mt-4 font-[var(--font-sora)] text-3xl font-bold">From keystrokes to clarity</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Your event stream turns into features, features into weakness probabilities, and probabilities into coaching
            interventions.
          </p>
        </div>
        <HowItWorks />
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 pb-12 md:grid-cols-3">
        {coreFeatures.map(({ icon: Icon, title, text }) => (
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

      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="mb-5 text-center">
          <Badge className="bg-primary/15 text-primary">Features</Badge>
          <h2 className="mt-4 font-[var(--font-sora)] text-3xl font-bold">Built for serious learners</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {productFeatures.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-4 w-4 text-primary" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{text}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
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

      <section className="border-t border-border/60 bg-muted/30 px-6 py-16 text-center">
        <Badge className="bg-primary/15 text-primary">No testimonials shown, as requested</Badge>
        <h2 className="mx-auto mt-4 max-w-2xl font-[var(--font-sora)] text-4xl font-bold">
          Ready to understand how you actually solve?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Pick a problem, code naturally, and let algoTrace reveal the patterns that are helping or hurting your DSA
          growth.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <Link href="/workspace" className="inline-flex items-center gap-2">
              Start Your First Session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
