import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Flame, Goal, TrendingDown, Zap } from "lucide-react";

import { OauthCallbackScreen } from "@/components/auth/oauth-callback-screen";
import { ProfileEditor } from "@/components/auth/profile-editor";
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

function buildSignInRedirectUrl(searchParams: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  query.set("returnTo", "/dashboard");
  const keys = ["error", "error_description", "errorCode", "details", "email"];
  for (const key of keys) {
    const value = searchParams[key];
    if (typeof value === "string" && value) query.set(key, value);
  }
  return `/sign-in?${query.toString()}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const code = params.code;
  const state = params.state;
  if (typeof code === "string" && typeof state === "string") {
    return <OauthCallbackScreen />;
  }

  if (!isStackServerConfigured || !stackServerApp) {
    redirect((buildSignInRedirectUrl(params) as unknown) as "/sign-in");
  }

  const user = await stackServerApp.getUser({ includeRestricted: true });
  if (!user) {
    redirect((buildSignInRedirectUrl(params) as unknown) as "/sign-in");
  }

  if (user.isRestricted) {
    redirect(user.primaryEmail ? `/verify-email?email=${encodeURIComponent(user.primaryEmail)}` : "/verify-email");
  }

  const profile = {
    id: user.id,
    name: user.displayName ?? "No display name",
    email: user.primaryEmail ?? "No email",
    emailVerified: user.primaryEmailVerified ? "Verified" : "Not Verified",
    joined: user.signedUpAt.toLocaleDateString(),
    displayNameRaw: user.displayName ?? "",
  };

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
          <CardDescription>Basic account details</CardDescription>
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
              <span className="text-muted-foreground">Joined: </span>
              <span className="font-medium">{profile.joined}</span>
            </p>
            <p>
              <span className="text-muted-foreground">User ID: </span>
              <span className="font-mono text-xs">{profile.id}</span>
            </p>
          </div>
          <ProfileEditor initialDisplayName={profile.displayNameRaw} />
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
    </main>
  );
}
