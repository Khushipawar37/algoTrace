"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { stackClientApp } from "@/stack";
import { ArrowRight, Check, X, ShieldAlert, CheckCircle2 } from "lucide-react";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  sanitizeReturnTo,
} from "@/lib/auth/validation";

type StackAuthScreenProps = {
  mode: "sign-in" | "sign-up";
  returnTo?: string;
  initialError?: string;
  initialEmail?: string;
};

export function StackAuthScreen({
  mode,
  returnTo = "/dashboard",
  initialError,
  initialEmail = "",
}: StackAuthScreenProps) {
  const searchParams = useSearchParams();
  const rawRedirect = searchParams?.get("redirect") || searchParams?.get("returnTo") || returnTo;
  const targetRoute = sanitizeReturnTo(rawRedirect);

  const [name, setName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [info, setInfo] = useState<string | null>(null);
  
  const router = useRouter();

  const passwordValidation = validatePassword(password);

  async function onGoogle() {
    if (!stackClientApp) {
      setError("Stack Auth is not configured on this environment.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      await stackClientApp.signInWithOAuth("google", { returnTo: targetRoute });
    } catch (err: any) {
      setError(err?.message || "Google authentication failed. Please try again.");
      setSubmitting(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stackClientApp) {
      setError("Stack Auth is not configured on this environment.");
      return;
    }

    setError(null);
    setInfo(null);

    // Validate email
    const emailRes = validateEmail(email);
    if (!emailRes.isValid) {
      setError(emailRes.error || "Enter a valid email address.");
      return;
    }

    if (mode === "sign-up") {
      // Validate Name
      const nameRes = validateName(name);
      if (!nameRes.isValid) {
        setError(nameRes.error || "Name is required.");
        return;
      }

      // Validate Password
      if (!passwordValidation.isValid) {
        setError(passwordValidation.error || "Password does not meet requirements.");
        return;
      }

      // Validate Confirm Password
      const confirmRes = validateConfirmPassword(password, confirmPassword);
      if (!confirmRes.isValid) {
        setError(confirmRes.error || "Passwords do not match.");
        return;
      }
    }

    setSubmitting(true);

    try {
      if (mode === "sign-up") {
        const result = await stackClientApp.signUpWithCredential({
          email: email.trim(),
          password,
          noRedirect: true,
          verificationCallbackUrl: `${window.location.origin}/verify-email`,
        });

        if (result.status !== "ok") {
          const rawErr = (result as any).error;
          let userMsg = "Unable to create account with the provided details.";
          if (rawErr?.code === "user_with_email_already_exists" || rawErr?.message?.includes("already exists")) {
            userMsg = "An account with this email address already exists. Please sign in.";
          } else if (rawErr?.message) {
            userMsg = rawErr.message;
          }
          setError(userMsg);
          setSubmitting(false);
          return;
        }

        // Try setting user display name
        try {
          const createdUser = await stackClientApp.getUser({ includeRestricted: true });
          if (createdUser && name.trim()) {
            await createdUser.setDisplayName(name.trim());
          }
        } catch {
          // Ignore name assignment error if user requires verification first
        }

        // Mandatory email verification requirement
        setInfo("Verification email sent! Please check your inbox to verify your email before logging in.");
        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
        }, 1200);

      } else {
        // Sign-in mode
        const result = await stackClientApp.signInWithCredential({
          email: email.trim(),
          password,
          noRedirect: true,
        });

        if (result.status !== "ok") {
          const rawErr = (result as any).error;
          let userMsg = "Incorrect email or password.";
          if (rawErr?.message) {
            userMsg = rawErr.message;
          }
          setError(userMsg);
          setSubmitting(false);
          return;
        }

        // Check if user email requires verification
        const user = await stackClientApp.getUser({ includeRestricted: true });
        if (user && (user.isRestricted || !user.primaryEmailVerified)) {
          router.push(`/verify-email?email=${encodeURIComponent(user.primaryEmail || email.trim())}`);
          return;
        }

        router.push(targetRoute as any);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please check your credentials and try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-floral text-smoky flex items-center justify-center p-6 font-sans">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md p-8 rounded-[28px] border border-smoky/20 bg-bone/30 shadow-2xl space-y-6"
      >
        <div>
          <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
            AUTHENTICATION
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-smoky">
            {mode === "sign-in" ? "Sign In to AlgoTrace" : "Create your account"}
          </h1>
          <p className="text-xs font-mono text-olive mt-1">
            {mode === "sign-in"
              ? "Welcome back. Continue your DSA learning trajectory."
              : "Sign up to track your guided problem trace history."}
          </p>
        </div>

        {/* OAuth Button */}
        <button
          type="button"
          onClick={onGoogle}
          disabled={submitting}
          className="w-full py-3 px-4 rounded-btn border border-smoky/20 bg-floral text-xs font-mono text-smoky font-bold hover:bg-bone transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          <span className="font-bold text-sm">G</span>
          <span>{submitting ? "Connecting to Google..." : "Continue with Google"}</span>
        </button>

        <div className="relative text-center font-mono text-[11px] text-olive">
          <span className="bg-bone/30 px-2 relative z-10">OR USE EMAIL</span>
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-smoky/15 -translate-y-1/2" />
        </div>

        <div className="space-y-4 font-mono text-xs">
          {mode === "sign-up" && (
            <div>
              <label className="text-olive block mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full px-3.5 py-2.5 rounded-btn bg-floral border border-smoky/20 text-smoky focus:outline-none focus:border-smoky font-sans text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-olive block mb-1 font-semibold">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full px-3.5 py-2.5 rounded-btn bg-floral border border-smoky/20 text-smoky focus:outline-none focus:border-smoky font-sans text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-olive font-semibold">Password</label>
              {mode === "sign-in" && (
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-smoky font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-btn bg-floral border border-smoky/20 text-smoky focus:outline-none focus:border-smoky font-sans text-sm"
            />
          </div>

          {mode === "sign-up" && (
            <>
              {/* Dynamic Password Requirements Checklist */}
              {password.length > 0 && (
                <div className="p-3 rounded-btn bg-floral/60 border border-smoky/15 space-y-1.5 font-mono text-[11px]">
                  <p className="text-olive font-semibold mb-1">Password requirements:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <span className={`flex items-center gap-1.5 ${passwordValidation.checks.length ? "text-olive font-bold" : "text-smoky/60"}`}>
                      {passwordValidation.checks.length ? <Check className="w-3 h-3 text-olive" /> : <X className="w-3 h-3 text-smoky/40" />}
                      At least 8 characters
                    </span>
                    <span className={`flex items-center gap-1.5 ${passwordValidation.checks.uppercase ? "text-olive font-bold" : "text-smoky/60"}`}>
                      {passwordValidation.checks.uppercase ? <Check className="w-3 h-3 text-olive" /> : <X className="w-3 h-3 text-smoky/40" />}
                      One uppercase letter
                    </span>
                    <span className={`flex items-center gap-1.5 ${passwordValidation.checks.lowercase ? "text-olive font-bold" : "text-smoky/60"}`}>
                      {passwordValidation.checks.lowercase ? <Check className="w-3 h-3 text-olive" /> : <X className="w-3 h-3 text-smoky/40" />}
                      One lowercase letter
                    </span>
                    <span className={`flex items-center gap-1.5 ${passwordValidation.checks.number ? "text-olive font-bold" : "text-smoky/60"}`}>
                      {passwordValidation.checks.number ? <Check className="w-3 h-3 text-olive" /> : <X className="w-3 h-3 text-smoky/40" />}
                      One number
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-olive block mb-1 font-semibold">Confirm password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-btn bg-floral border border-smoky/20 text-smoky focus:outline-none focus:border-smoky font-sans text-sm"
                />
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="text-xs font-mono text-smoky font-bold border border-smoky/40 p-3 rounded-btn bg-bone/40 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-smoky flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {info && (
          <div className="text-xs font-mono text-olive p-3 rounded-btn bg-bone/20 border border-smoky/15 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-olive flex-shrink-0" />
            <span>{info}</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="space-y-3 pt-2 font-mono text-xs">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-btn bg-smoky text-floral font-bold hover:bg-olive transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            <span>
              {submitting
                ? mode === "sign-in"
                  ? "Signing In..."
                  : "Creating Account..."
                : mode === "sign-in"
                ? "Sign In"
                : "Create Account"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-mono text-olive text-center pt-2 border-t border-smoky/10">
          {mode === "sign-in" ? "New to AlgoTrace? " : "Already have an account? "}
          <Link
            href={
              (mode === "sign-in"
                ? `/sign-up${targetRoute !== "/dashboard" ? `?redirect=${encodeURIComponent(targetRoute)}` : ""}`
                : `/sign-in${targetRoute !== "/dashboard" ? `?redirect=${encodeURIComponent(targetRoute)}` : ""}`) as any
            }
            className="text-smoky font-bold underline"
          >
            {mode === "sign-in" ? "Create account" : "Sign in"}
          </Link>
        </p>
      </form>
    </main>
  );
}
