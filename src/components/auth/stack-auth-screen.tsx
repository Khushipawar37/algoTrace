"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { stackClientApp } from "@/stack";

type StackAuthScreenProps = {
  mode: "sign-in" | "sign-up";
  returnTo?: string;
  initialError?: string;
  initialEmail?: string;
  autoResolveGoogleConflict?: boolean;
};

export function StackAuthScreen({
  mode,
  returnTo,
  initialError,
  initialEmail,
  autoResolveGoogleConflict = false,
}: StackAuthScreenProps) {
  const [email, setEmail] = useState(initialEmail ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [info, setInfo] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(mode === "sign-in");
  const router = useRouter();
  const targetRoute = returnTo === "/" ? "/" : "/dashboard";

  const autoResolveKey = useMemo(
    () => `algotrace-google-conflict-resolved:${(initialEmail ?? "").toLowerCase()}`,
    [initialEmail],
  );

  useEffect(() => {
    let active = true;

    async function checkExistingSession() {
      if (!stackClientApp || mode !== "sign-in") {
        if (active) setCheckingSession(false);
        return;
      }
      try {
        const user = await stackClientApp.getUser({ includeRestricted: true });
        if (!active || !user) return;
        if (user.isRestricted) {
          router.replace(user.primaryEmail ? `/verify-email?email=${encodeURIComponent(user.primaryEmail)}` : "/verify-email");
          return;
        }
        router.replace(targetRoute);
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    void checkExistingSession();
    return () => {
      active = false;
    };
  }, [mode, router, targetRoute]);

  useEffect(() => {
    let active = true;

    async function autoResolveConflictAndContinueGoogle() {
      if (!stackClientApp || mode !== "sign-in" || !autoResolveGoogleConflict || !initialEmail) return;
      if (typeof window === "undefined") return;
      if (sessionStorage.getItem(autoResolveKey) === "1") return;

      sessionStorage.setItem(autoResolveKey, "1");
      setSubmitting(true);
      setError(null);
      setInfo("Resolving account conflict and continuing with Google...");

      try {
        const response = await fetch("/api/auth/resolve-google-conflict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: initialEmail }),
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error ?? "Unable to resolve Google sign-in conflict.");
        }

        if (!active) return;
        await stackClientApp.signInWithOAuth("google");
      } catch (e) {
        if (!active) return;
        const message = e instanceof Error ? e.message : "Unable to continue with Google right now.";
        setError(message);
        setSubmitting(false);
      }
    }

    void autoResolveConflictAndContinueGoogle();
    return () => {
      active = false;
    };
  }, [autoResolveGoogleConflict, autoResolveKey, initialEmail, mode, targetRoute]);

  async function onGoogle() {
    if (!stackClientApp) return;
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      await stackClientApp.signInWithOAuth("google");
    } catch {
      setError("Google sign-in failed. Please try again.");
      setSubmitting(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stackClientApp) return;

    if (mode === "sign-up" && password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

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

      if (result.status !== "ok") {
        setError(result.error?.message || "Authentication failed. Please check your credentials.");
        setSubmitting(false);
        return;
      }

      if (mode === "sign-up") {
        setInfo("Verification email sent. Verify your email, then sign in.");
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        router.push(targetRoute);
        router.refresh();
      }
    } catch {
      setError("Something went wrong while contacting auth service.");
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

  if (checkingSession) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6">
        <div className="w-full space-y-3 rounded-xl border border-border/60 bg-card p-6 text-center">
          <h1 className="font-[var(--font-sora)] text-2xl font-bold">Checking Session</h1>
          <p className="text-sm text-muted-foreground">Please wait...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full space-y-4 rounded-xl border border-border/60 bg-card p-6">
        <h1 className="font-[var(--font-sora)] text-2xl font-bold">
          {mode === "sign-in" ? "Sign In to AlgoTrace" : "Create your AlgoTrace account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "sign-in" ? "Welcome back. Continue your learning journey." : "Sign up with email, verify, then sign in."}
        </p>

        <button
          type="button"
          onClick={onGoogle}
          disabled={submitting}
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

        {mode === "sign-up" && (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </div>
        )}

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
      </form>
    </main>
  );
}
