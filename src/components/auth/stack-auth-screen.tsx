"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Globe, Loader2 } from "lucide-react";

import { stackClientApp } from "@/stack";
import { Button } from "@/components/ui/button";

export function StackAuthScreen({ mode, returnTo }: { mode: "sign-in" | "sign-up"; returnTo?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();

  const targetRoute = returnTo === "/dashboard" ? "/dashboard" : "/workspace";

  function validateFields(): boolean {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stackClientApp) return;
    if (!validateFields()) return;

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
        if (mode === "sign-in") {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else {
          setError("Could not create account. This email may already be registered.");
        }
      }
    } catch {
      setError("Something went wrong while contacting the auth service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onGoogleSignIn() {
    if (!stackClientApp) return;
    setGoogleLoading(true);
    setError(null);

    try {
      await stackClientApp.signInWithOAuth("google");
    } catch {
      setError("Google sign-in is not available. Please enable it in your Stack Auth dashboard.");
      setGoogleLoading(false);
    }
  }

  if (!stackClientApp) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center px-6">
        <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-8 shadow-lg">
          <h1 className="font-[var(--font-sora)] text-2xl font-bold">Auth Not Configured</h1>
          <p className="text-sm text-muted-foreground">
            Add <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_STACK_PROJECT_ID</code>,{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY</code>, and{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">STACK_SECRET_SERVER_KEY</code> in{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.env.local</code>.
          </p>
          <Link
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            href="/"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6 py-12">
      <div className="w-full space-y-6">
        {/* Back to home */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>

        <form
          onSubmit={onSubmit}
          className="w-full space-y-5 rounded-2xl border border-border/60 bg-card p-8 shadow-lg"
        >
          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="font-[var(--font-sora)] text-2xl font-bold">
              {mode === "sign-in" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "sign-in"
                ? "Sign in to continue your learning journey."
                : "Start tracking your coding behavior today."}
            </p>
          </div>

          {/* Google sign in */}
          <button
            type="button"
            onClick={onGoogleSignIn}
            disabled={googleLoading}
            className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-background text-sm font-medium transition-colors hover:bg-muted/60 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Chrome className="h-4 w-4" />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or continue with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="you@example.com"
              className={`h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none ring-primary/30 transition-shadow focus:ring-2 ${
                fieldErrors.email ? "border-destructive" : "border-border"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (fieldErrors.password)
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="Min. 8 characters"
                className={`h-11 w-full rounded-lg border bg-background px-3 pr-10 text-sm outline-none ring-primary/30 transition-shadow focus:ring-2 ${
                  fieldErrors.password ? "border-destructive" : "border-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-destructive">{fieldErrors.password}</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button type="submit" disabled={submitting} className="h-11 w-full text-sm font-medium">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : mode === "sign-in" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Switch mode */}
          <p className="text-center text-sm text-muted-foreground">
            {mode === "sign-in" ? "New here?" : "Already have an account?"}{" "}
            <Link href={mode === "sign-in" ? "/sign-up" : "/sign-in"} className="font-medium text-primary hover:underline">
              {mode === "sign-in" ? "Create account" : "Sign in"}
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
