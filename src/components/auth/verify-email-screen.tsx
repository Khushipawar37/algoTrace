"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { stackClientApp } from "@/stack";

export function VerifyEmailScreen({ initialCode, email }: { initialCode?: string; email?: string }) {
  const [code, setCode] = useState(initialCode ?? "");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(
    email ? `Verification email sent to ${email}. Enter OTP/code or open the verification link.` : null,
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    if (!stackClientApp || !code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await stackClientApp.verifyEmail(code.trim());
      if (result.status === "ok") {
        setInfo("Email verified successfully. Redirecting to sign in...");
        setTimeout(() => router.push("/sign-in?returnTo=/dashboard"), 800);
      } else {
        setError("Invalid or expired verification code.");
      }
    } catch {
      setError("Unable to verify email right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!stackClientApp) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-6">
        <div className="space-y-4 rounded-xl border border-border/60 bg-card p-6">
          <h1 className="font-[var(--font-sora)] text-2xl font-bold">StackAuth Not Configured</h1>
          <Link className="text-sm text-primary underline" href="/">
            Back Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6">
      <div className="w-full space-y-4 rounded-xl border border-border/60 bg-card p-6">
        <h1 className="font-[var(--font-sora)] text-2xl font-bold">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the OTP/verification code from your email to activate your account.
        </p>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Enter verification code"
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none ring-primary/30 focus:ring-2"
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {info && <p className="text-sm text-green-700 dark:text-green-400">{info}</p>}
        <button
          onClick={submit}
          disabled={loading || !code.trim()}
          className="h-10 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground disabled:opacity-70"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
        <p className="text-xs text-muted-foreground">
          Already verified?{" "}
          <Link href="/sign-in?returnTo=/dashboard" className="text-primary underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

