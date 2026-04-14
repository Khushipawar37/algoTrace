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
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();

  const targetRoute = returnTo === "/dashboard" ? "/dashboard" : "/";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stackClientApp) return;
    setSubmitting(true);
    setError(null);
    setInfo(null);

    try {
      const result =
        mode === "sign-in"
          ? await stackClientApp.signInWithCredential({ email, password, noRedirect: true })
          : await stackClientApp.signUpWithCredential({
              email,
              password,
              noRedirect: true,
              verificationCallbackUrl: `${window.location.origin}/verify-email`,
            });

      if (result.status === "ok") {
        if (mode === "sign-up") {
          setInfo("Verification email sent. Please verify your email before signing in.");
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        } else {
          router.push(targetRoute);
          router.refresh();
        }
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

  async function onGoogle() {
    if (!stackClientApp) return;
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      await stackClientApp.signInWithOAuth("google", { returnTo: targetRoute });
    } catch {
      setError("Google sign-in failed. Ensure Google OAuth is configured in StackAuth dashboard.");
      setSubmitting(false);
    }
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

        <button
          type="button"
          disabled={submitting}
          onClick={onGoogle}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-border bg-background text-sm font-medium hover:bg-muted disabled:opacity-70"
        >
          <span>G</span>
          Continue with Google
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or use email</span>
          </div>
        </div>

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
        {info && <p className="text-sm text-green-700 dark:text-green-400">{info}</p>}

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
        {mode === "sign-up" && (
          <p className="text-xs text-muted-foreground">
            Email/password sign-up requires verification before access. A verification code/link is sent to your email.
          </p>
        )}
      </form>
    </main>
  );
}
