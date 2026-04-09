import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Flame, Goal, TrendingDown, Zap } from "lucide-react";

import { ProgressChart } from "@/components/dashboard/progress-chart";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isStackServerConfigured, stackServerApp } from "@/stack";

const kpis = [
  { icon: TrendingDown, label: "Optimization weakness", value: "78 -> 49", detail: "-29 in 5 sessions" },
  { icon: Goal, label: "Consistency score", value: "73%", detail: "+8% this week" },
  { icon: Zap, label: "Avg run attempts", value: "3.2", detail: "Down from 5.1" },
  { icon: Flame, label: "Practice streak", value: "12 days", detail: "Best streak so far" },
];

export default async function DashboardPage() {
  if (!isStackServerConfigured || !stackServerApp) {
    redirect("/sign-in?returnTo=/dashboard");
  }
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/sign-in?returnTo=/dashboard");
  }

  return (
    <main className="mx-auto w-full max-w-7xl space-y-4 px-4 py-6 md:px-6">
      <header className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-4 py-3">
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <ThemeToggle />
      </header>

      <section className="rounded-xl border border-border/60 bg-gradient-to-br from-card to-secondary/40 p-6">
        <Badge className="bg-primary/15 text-primary">Longitudinal Intelligence</Badge>
        <h1 className="mt-3 font-[var(--font-sora)] text-3xl font-bold">Behavioral Progress Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Track how your cognitive weakness profile evolves session by session and prioritize what to train next.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {kpis.map(({ icon: Icon, label, value, detail }) => (
          <Card key={label}>
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-[var(--font-sora)] text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Trend + Distribution</CardTitle>
          <CardDescription>One view for longitudinal movement and current weakness intensity.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressChart />
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Priority Area</CardTitle>
            <CardDescription>Most impactful area to reduce this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Edge Case Detection</span> is still your highest risk
              signal.
            </p>
            <p>Action: Before coding each problem, write 3 edge cases in comments and validate them first.</p>
            <p>Recommended next problem: Valid Parentheses (focus on empty string and one-char input).</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Session Plan</CardTitle>
            <CardDescription>Next 3 sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Session 1: Two Sum Variants (Approach + DS selection)</p>
            <p>Session 2: Sliding Window Medium (Optimization timing)</p>
            <p>Session 3: Stack Validation (Edge cases + logic checks)</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
