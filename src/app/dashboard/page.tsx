"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flame, Goal, TrendingDown, Zap } from "lucide-react";

import { AccountActions } from "@/components/auth/account-actions";
import { ProfileEditor } from "@/components/auth/profile-editor";
import { ProgressChart } from "@/components/dashboard/progress-chart";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { stackClientApp } from "@/stack";

const kpis = [
  { icon: TrendingDown, label: "Optimization weakness", value: "78 -> 49", detail: "-29 in 5 sessions" },
  { icon: Goal, label: "Consistency score", value: "73%", detail: "+8% this week" },
  { icon: Zap, label: "Avg run attempts", value: "3.2", detail: "Down from 5.1" },
  { icon: Flame, label: "Practice streak", value: "12 days", detail: "Best streak so far" },
];

type DashboardUser = {
  id: string;
  displayName: string | null;
  primaryEmail: string | null;
  primaryEmailVerified: boolean;
  isRestricted: boolean;
  signedUpAt: Date | string;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<DashboardUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function loadUserWithRetry() {
      if (!stackClientApp) {
        if (active) {
          setError("StackAuth is not configured.");
          setLoading(false);
        }
        return;
      }

      try {
        for (let attempt = 0; attempt < 8; attempt += 1) {
          const currentUser = await stackClientApp.getUser({ includeRestricted: true });
          if (currentUser) {
            if (!active) return;
            if (currentUser.isRestricted) {
              const email = currentUser.primaryEmail;
              router.replace(email ? `/verify-email?email=${encodeURIComponent(email)}` : "/verify-email");
              return;
            }
            setUser({
              id: currentUser.id,
              displayName: currentUser.displayName,
              primaryEmail: currentUser.primaryEmail,
              primaryEmailVerified: currentUser.primaryEmailVerified,
              isRestricted: currentUser.isRestricted,
              signedUpAt: currentUser.signedUpAt,
            });
            setLoading(false);
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 250));
        }

        if (active) {
          router.replace("/sign-in?returnTo=/dashboard");
        }
      } catch {
        if (active) {
          setError("Unable to load your session right now.");
          setLoading(false);
        }
      }
    }

    void loadUserWithRetry();
    return () => {
      active = false;
    };
  }, [router]);

  const profile = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      name: user.displayName ?? "No display name",
      email: user.primaryEmail ?? "No email",
      emailVerified: user.primaryEmailVerified ? "Verified" : "Not Verified",
      restricted: user.isRestricted ? "Yes" : "No",
      joined: new Date(user.signedUpAt).toLocaleDateString(),
      displayNameRaw: user.displayName ?? "",
    };
  }, [user]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-6">
        <div className="w-full space-y-2 rounded-xl border border-border/60 bg-card p-6 text-center">
          <h1 className="font-[var(--font-sora)] text-2xl font-bold">Loading Dashboard</h1>
          <p className="text-sm text-muted-foreground">Checking your authenticated session...</p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-6">
        <div className="w-full space-y-3 rounded-xl border border-border/60 bg-card p-6 text-center">
          <h1 className="font-[var(--font-sora)] text-2xl font-bold">Dashboard Unavailable</h1>
          <p className="text-sm text-muted-foreground">{error ?? "Please sign in again."}</p>
          <Button asChild>
            <Link href="/sign-in?returnTo=/dashboard">Go to Sign In</Link>
          </Button>
        </div>
      </main>
    );
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

      <Card id="profile">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Current account and access details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 text-sm md:grid-cols-2">
            <p>
              <span className="text-muted-foreground">Name: </span>
              <span className="font-medium">{profile.name}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Email: </span>
              <span className="font-medium">{profile.email}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Email Status: </span>
              <span className="font-medium">{profile.emailVerified}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Restricted: </span>
              <span className="font-medium">{profile.restricted}</span>
            </p>
            <p>
              <span className="text-muted-foreground">User ID: </span>
              <span className="font-mono text-xs">{profile.id}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Joined: </span>
              <span className="font-medium">{profile.joined}</span>
            </p>
          </div>
          <ProfileEditor initialDisplayName={profile.displayNameRaw} />
          <AccountActions />
        </CardContent>
      </Card>

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
