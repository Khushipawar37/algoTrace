"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { stackClientApp } from "@/stack";
import { ArrowLeft, Check, X, ShieldAlert, CheckCircle2 } from "lucide-react";
import { validatePassword, validateConfirmPassword } from "@/lib/auth/validation";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const code = searchParams?.get("code") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(code ? null : "Missing password reset code. Please request a new link.");
  const [success, setSuccess] = useState<string | null>(null);

  const passwordValidation = validatePassword(password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code) {
      setError("Missing password reset code.");
      return;
    }

    setError(null);
    setSuccess(null);

    if (!passwordValidation.isValid) {
      setError(passwordValidation.error || "Password does not meet security requirements.");
      return;
    }

    const confirmRes = validateConfirmPassword(password, confirmPassword);
    if (!confirmRes.isValid) {
      setError(confirmRes.error || "Passwords do not match.");
      return;
    }

    if (!stackClientApp) {
      setError("Stack Auth is not configured.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await stackClientApp.resetPassword({ code, password });
      if (result.status === "ok") {
        setSuccess("Password reset successfully! Redirecting to sign in...");
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      } else {
        setError("Invalid or expired password reset link. Please request a new one.");
      }
    } catch {
      setError("Failed to reset password. The reset link may be expired.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
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
          PASSWORD RECOVERY
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-smoky">Set New Password</h1>
        <p className="text-xs font-mono text-olive mt-1">
          Create a new password for your AlgoTrace account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 font-mono text-xs">
        <div>
          <label className="text-olive block mb-1 font-semibold">New Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-btn bg-floral border border-smoky/20 text-smoky focus:outline-none focus:border-smoky font-sans text-sm"
          />
        </div>

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
          <label className="text-olive block mb-1 font-semibold">Confirm New Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-btn bg-floral border border-smoky/20 text-smoky focus:outline-none focus:border-smoky font-sans text-sm"
          />
        </div>

        {error && (
          <div className="text-xs font-mono text-smoky font-bold border border-smoky/40 p-3 rounded-btn bg-bone/40 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-smoky flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="text-xs font-mono text-olive p-3 rounded-btn bg-bone/20 border border-smoky/15 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-olive flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !code}
          className="w-full py-3 px-4 rounded-btn bg-smoky text-floral font-bold hover:bg-olive transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          <span>{submitting ? "Resetting..." : "Reset Password"}</span>
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-floral text-smoky flex items-center justify-center p-6 font-sans">
      <Suspense fallback={
        <div className="p-8 rounded-[28px] border border-smoky/20 bg-bone/30 shadow-2xl text-center font-mono text-xs text-olive">
          Loading reset password page...
        </div>
      }>
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
