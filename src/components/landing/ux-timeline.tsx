import { ArrowDown } from "lucide-react";

const steps = [
  {
    title: "Create Account / Sign In",
    desc: "Use StackAuth to securely sign in. Dashboard and progress are private to your account.",
  },
  {
    title: "Open Workspace",
    desc: "Pick a DSA problem and start coding in Monaco with your preferred language.",
  },
  {
    title: "Code Naturally",
    desc: "AlgoTrace tracks pauses, rewrites, hint dependency, and approach pivots silently in the background.",
  },
  {
    title: "Run + Analyze",
    desc: "On run, heuristics + ML inference return your live weakness vector.",
  },
  {
    title: "Reflect with Coach + Report",
    desc: "Use Socratic coaching and graduated hints. End session with an actionable debrief.",
  },
  {
    title: "Track Growth on Dashboard",
    desc: "Review longitudinal trend lines and target your highest-priority weakness next.",
  },
];

export function UxTimeline() {
  return (
    <div className="mx-auto max-w-4xl">
      {steps.map((step, i) => (
        <div key={step.title} className="relative pl-8">
          <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background" />
          <div className="mb-4 rounded-xl border border-border/60 bg-card/80 p-4">
            <p className="font-semibold">{step.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
          </div>
          {i < steps.length - 1 && <ArrowDown className="absolute -bottom-2 left-[-1px] h-4 w-4 text-primary" />}
          {i < steps.length - 1 && <span className="absolute bottom-0 left-[7px] top-6 w-px bg-border" />}
        </div>
      ))}
    </div>
  );
}
