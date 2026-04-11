"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  ChartLine,
  Code2,
  Cpu,
  ExternalLink,
  Lightbulb,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import { HeroFeatureCycle } from "@/components/landing/hero-feature-cycle";
import { UxTimeline } from "@/components/landing/ux-timeline";
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
    gradient: "from-amber-500/20 to-orange-500/10",
  },
  {
    icon: ChartLine,
    title: "Live Weakness Vector",
    text: "See real-time bars and post-run ML probabilities across your core DSA cognition dimensions.",
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    icon: TimerReset,
    title: "Adaptive Coaching Loop",
    text: "Heuristics react instantly; model inference deepens guidance every run.",
    gradient: "from-violet-500/20 to-purple-500/10",
  },
  {
    icon: Target,
    title: "Precision Problem Selection",
    text: "25+ curated Striver's sheet problems matched to your cognitive weak points.",
    gradient: "from-blue-500/20 to-cyan-500/10",
  },
  {
    icon: Lightbulb,
    title: "Graduated Hint System",
    text: "Three tiers of hints build independence and supply richer training signal.",
    gradient: "from-yellow-500/20 to-amber-500/10",
  },
  {
    icon: TrendingUp,
    title: "Longitudinal Dashboard",
    text: "Track cognitive weakness evolution session by session and prioritize what to train next.",
    gradient: "from-rose-500/20 to-pink-500/10",
  },
];

const productFeatures = [
  {
    icon: Cpu,
    title: "FastAPI + RF inference",
    text: "Feature vectors served into explainable weakness predictions.",
  },
  {
    icon: Workflow,
    title: "Graduated hints",
    text: "Tiered hints build independence and supply richer training signal.",
  },
  {
    icon: Sparkles,
    title: "Session debrief",
    text: "Evidence-backed summary, priority weakness, and next problem recommendation.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <div className="surface-grid absolute inset-0 -z-10 opacity-30" />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 pb-8 pt-16 md:pt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-primary/15 text-primary">AI-Powered Behavioral Coding Coach</Badge>
          <h1 className="mt-5 max-w-4xl font-[var(--font-sora)] text-4xl font-bold leading-tight md:text-6xl">
            Stop solving questions only.
            <span className="block text-primary">
              Start understanding your problem-solving behavior.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            algoTrace converts coding behavior into machine-learning signals, then coaches you in
            real time with Socratic guidance tailored to your weakest DSA thinking patterns.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group shadow-lg shadow-primary/20">
              <Link href="/workspace" className="inline-flex items-center gap-2">
                Start Solving
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HOW IT WORKS (Feature Cycle) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 via-card/70 to-secondary/25 p-4 md:p-6"
        >
          <HeroFeatureCycle />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TICKER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="overflow-hidden border-y border-border/60 bg-muted/35 py-3">
        <div className="ticker flex w-[200%]">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="flex shrink-0 items-center px-6 text-xs text-muted-foreground"
            >
              <span className="font-semibold text-primary">{item}</span>
              <span className="px-3 text-border">·</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* STATS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-5">
        {[
          { n: "25+", l: "DSA problems" },
          { n: "12+", l: "Behavioral features" },
          { n: "RF", l: "Model core" },
          { n: "0", l: "Direct answers" },
          { n: "∞", l: "Socratic prompts" },
        ].map((stat) => (
          <motion.div
            key={stat.l}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.4 }}
          >
            <Card className="text-center transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <p className="font-[var(--font-sora)] text-3xl font-bold text-primary">{stat.n}</p>
                <p className="text-xs text-muted-foreground">{stat.l}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* USER JOURNEY */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="journey" className="mx-auto max-w-7xl space-y-5 px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Badge className="bg-primary/15 text-primary">Timeline Flowchart</Badge>
          <h2 className="mt-3 font-[var(--font-sora)] text-3xl font-bold">
            How To Use algoTrace Properly
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            Clear step-by-step journey from sign-in to measurable performance improvement.
          </p>
        </motion.div>
        <UxTimeline />
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FEATURES (redesigned) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section id="features" className="mx-auto max-w-7xl px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <Badge className="bg-primary/15 text-primary">Core Capabilities</Badge>
          <h2 className="mt-3 font-[var(--font-sora)] text-3xl font-bold">
            Everything You Need to Grow
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            A complete behavioral coaching system that tracks, analyzes, and improves your
            problem-solving patterns.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map(({ icon: Icon, title, text, gradient }, index) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="feature-card group relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <CardHeader className="relative">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-[var(--font-sora)]">{title}</CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-sm leading-relaxed">{text}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* PRODUCT VALUE */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <Badge className="bg-primary/15 text-primary">Product Value</Badge>
          <h2 className="mt-3 font-[var(--font-sora)] text-3xl font-bold">Under the Hood</h2>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-3">
          {productFeatures.map(({ icon: Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="feature-card">
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CTA */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
          className="cta-gradient relative overflow-hidden rounded-3xl px-8 py-16 text-center text-primary-foreground md:px-16"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48L3N2Zz4=')] opacity-50" />
          <div className="relative z-10">
            <h2 className="font-[var(--font-sora)] text-3xl font-bold md:text-4xl">
              Ready to understand your coding brain?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base opacity-90">
              Join algoTrace and transform random practice into systematic cognitive improvement.
              Start your first session in under 30 seconds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="border-2 border-white/20 bg-white text-foreground shadow-lg hover:bg-white/90"
              >
                <Link href="/workspace" className="inline-flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Open Workspace
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/sign-up" className="inline-flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Create Free Account
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <p className="font-[var(--font-sora)] text-lg font-semibold">algoTrace</p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/workspace" className="transition-colors hover:text-foreground">
              Workspace
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/sign-in" className="transition-colors hover:text-foreground">
              Sign In
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              GitHub
            </a>
          </nav>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} algoTrace. Built for better coders.
          </p>
        </div>
      </footer>
    </main>
  );
}
