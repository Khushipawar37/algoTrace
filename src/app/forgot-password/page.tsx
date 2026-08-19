"use client";

import React, { useState } from "react";
import Link from "next/link";
import { stackClientApp } from "@/stack";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { validateEmail } from "@/lib/auth/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const emailRes = validateEmail(email);
    if (!emailRes.isValid) {
      setError(emailRes.error || "Enter a valid email address.");
      return;
    }

    if (!stackClientApp) {
      setError("Stack Auth is not configured.");
      return;
    }

    setLoading(true);
    try {
      const result = await stackClientApp.sendForgotPasswordEmail(email.trim(), {
        callbackUrl: `${window.location.origin}/reset-password`,
      });

      if (result.status === "ok") {
        setMessage(
          "Password reset instructions sent! If an account exists for this email, you will receive a reset link shortly."
        );
        setEmail("");
      } else {
        setError("Unable to send password reset email. Please verify your email address.");
      }
    } catch {
      setError("Failed to send password reset email. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-floral text-smoky flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md p-8 rounded-[28px] border border-smoky/20 bg-bone/30 shadow-2xl space-y-6">
        <div>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1 font-mono text-xs text-olive hover:text-smoky transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
          <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
            ACCOUNT RECOVERY
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-smoky">Forgot Password</h1>
          <p className="text-xs font-mono text-olive mt-1">
            Enter your account email to receive a password reset link.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 font-mono text-xs">
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

          {error && (
            <div className="text-xs font-mono text-smoky font-bold border border-smoky/40 p-3 rounded-btn bg-bone/40 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-smoky flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="text-xs font-mono text-olive p-3 rounded-btn bg-bone/20 border border-smoky/15 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-olive flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-3 px-4 rounded-btn bg-smoky text-floral font-bold hover:bg-olive transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
          </button>
        </form>
      </div>
    </main>
  );
}
