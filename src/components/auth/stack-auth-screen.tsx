"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { stackClientApp } from "@/stack";

export function StackAuthScreen({ mode, returnTo }: { mode: "sign-in" | "sign-up"; returnTo?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const targetRoute = returnTo === "/dashboard" ? "/dashboard" : "/";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stackClientApp) return;
    setSubmitting(true);
    setError(null);

    try {
      const result =
        mode === "sign-in"
          ? await stackClientApp.signInWithCredential({ email, password, noRedirect: true })
          : await stackClientApp.signUpWithCredential({
              email,
              password,
              noRedirect: true,
              noVerificationCallback: true,
            });

      if (result.status === "ok") {
        router.push(targetRoute);
        router.refresh();
      } else {
        setError("Authentication failed. Please check credentials and try again.");
      }
    } catch {
      setError("Something went wrong while contacting auth service.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!stackClientApp) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-6">
        <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
          <h1 className="font-[var(--font-sora)] text-2xl font-bold">StackAuth Not Configured</h1>
          <p className="text-sm text-muted-foreground">
            Add `NEXT_PUBLIC_STACK_PROJECT_ID`, `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`, and
            `STACK_SECRET_SERVER_KEY` in `.env.local`.
          </p>
          <Link className="text-sm text-primary underline" href="/">
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full space-y-4 rounded-xl border border-border/60 bg-card p-6">
        <h1 className="font-[var(--font-sora)] text-2xl font-bold">
          {mode === "sign-in" ? "Sign In to algoTrace" : "Create your algoTrace account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "sign-in" ? "Welcome back. Continue your learning journey." : "Start tracking your coding behavior today."}
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none ring-primary/30 focus:ring-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none ring-primary/30 focus:ring-2"
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="h-10 w-full rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-70"
        >
          {submitting ? "Please wait..." : mode === "sign-in" ? "Sign In" : "Sign Up"}
        </button>

        <p className="text-sm text-muted-foreground">
          {mode === "sign-in" ? "New here?" : "Already have an account?"}{" "}
          <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"} className="text-primary underline">
            {mode === "sign-in" ? "Create account" : "Sign in"}
          </Link>
        </p>
      </form>
    </main>
  );
}
