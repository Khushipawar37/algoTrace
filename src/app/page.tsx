"use client";

import Link from "next/link";
import { ArrowRight, BrainCircuit, ChartLine, Cpu, Sparkles, TimerReset, Workflow } from "lucide-react";
import { motion } from "framer-motion";

import { HeroFeatureCycle } from "@/components/landing/hero-feature-cycle";
import { UxTimeline } from "@/components/landing/ux-timeline";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tickerItems = [
  "Behavioral Tracking",
  "Random Forest Classifier",
  "Socratic AI Coach",
  "Real-time Weakness Detection",
  "Session Debrief Reports",
  "Feature Engineering Pipeline",
];

const coreFeatures = [
  {
    icon: BrainCircuit,
    title: "Behavior-First Intelligence",
    text: "Measure how the mind moves: hesitation, pivot, rewrite, and confidence shifts.",
  },
  {
    icon: ChartLine,
    title: "Live Weakness Vector",
    text: "See real-time bars and post-run ML probabilities across your core DSA cognition dimensions.",
  },
  {
    icon: TimerReset,
    title: "Adaptive Coaching Loop",
    text: "Heuristics react instantly; model inference deepens guidance every run.",
  },
];

const productFeatures = [
  { icon: Cpu, title: "FastAPI + RF inference", text: "Feature vectors served into explainable weakness predictions." },
  { icon: Workflow, title: "Graduated hints", text: "Tiered hints build independence and supply richer training signal." },
  { icon: Sparkles, title: "Session debrief", text: "Evidence-backed summary, priority weakness, and next problem recommendation." },
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <div className="surface-grid absolute inset-0 -z-10 opacity-30" />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <p className="font-[var(--font-sora)] text-xl font-semibold tracking-tight">algoTrace</p>
            <Badge className="ml-2 hidden bg-primary/15 text-primary md:inline-flex">Behavioral DSA Coach</Badge>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#how-it-works" className="hover:text-foreground">
              How It Works
            </a>
            <a href="#journey" className="hover:text-foreground">
              User Journey
            </a>
            <a href="#features" className="hover:text-foreground">
              Features
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="shadow-sm">
              <Link href="/workspace">Open Workspace</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-8 pt-12">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Badge className="bg-primary/15 text-primary">AI-Powered Behavioral Coding Coach</Badge>
          <h1 className="mt-5 max-w-4xl font-[var(--font-sora)] text-4xl font-bold leading-tight md:text-6xl">
            Stop solving questions only.
            <span className="block text-primary">Start understanding your problem-solving behavior.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            algoTrace converts coding behavior into machine-learning signals, then coaches you in real time with
            Socratic guidance tailored to your weakest DSA thinking patterns.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/workspace" className="inline-flex items-center gap-2">
                Start Solving
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Dashboard (Login Required)</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 pb-12">
        <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 via-card/70 to-secondary/25 p-4 md:p-6">
          <HeroFeatureCycle />
        </div>
      </section>

      <section className="overflow-hidden border-y border-border/60 bg-muted/35 py-3">
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

      <section id="journey" className="mx-auto max-w-7xl space-y-5 px-6 pb-12">
        <div className="text-center">
          <Badge className="bg-primary/15 text-primary">Timeline Flowchart</Badge>
          <h2 className="mt-3 font-[var(--font-sora)] text-3xl font-bold">How To Use algoTrace Properly</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Clear step-by-step journey from sign-in to measurable performance improvement.
          </p>
        </div>
        <UxTimeline />
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-4 px-6 pb-12 md:grid-cols-3">
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

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="mb-4 text-center">
          <Badge className="bg-primary/15 text-primary">Product Value</Badge>
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
    </main>
  );
}
