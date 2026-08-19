"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { stackClientApp } from "@/stack";
import { Mail, CheckCircle2, ShieldAlert, RotateCcw, LogOut, ArrowLeft } from "lucide-react";

export function VerifyEmailScreen({
  initialCode,
  email,
}: {
  initialCode?: string;
  email?: string;
}) {
  const [code, setCode] = useState(initialCode ?? "");
  const [targetEmail, setTargetEmail] = useState(email ?? "");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();

  // Load user email if not provided via props
  useEffect(() => {
    let active = true;
    async function checkUser() {
      if (stackClientApp && !targetEmail) {
        try {
          const user = await stackClientApp.getUser({ includeRestricted: true });
          if (active && user?.primaryEmail) {
            setTargetEmail(user.primaryEmail);
            if (user.primaryEmailVerified && !user.isRestricted) {
              setInfo("Your email is already verified. Redirecting to dashboard...");
              setTimeout(() => router.push("/dashboard"), 1000);
            }
          }
        } catch {
          // Ignore
        }
      }
    }
    void checkUser();
    return () => {
      active = false;
    };
  }, [targetEmail, router]);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-verify if code passed via link param
  useEffect(() => {
    if (initialCode && stackClientApp) {
      void verifyCode(initialCode);
    }
  }, [initialCode]);

  async function verifyCode(codeToVerify: string) {
    if (!stackClientApp || !codeToVerify.trim()) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const result = await stackClientApp.verifyEmail(codeToVerify.trim());
      if (result.status === "ok") {
        setInfo("Email verified successfully! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1200);
      } else {
        setError("Invalid or expired verification link or code.");
      }
    } catch {
      setError("Unable to verify email at this moment. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (cooldown > 0 || resending) return;
    setError(null);
    setInfo(null);
    setResending(true);

    try {
      const user = stackClientApp ? await stackClientApp.getUser({ includeRestricted: true }) : null;
      if (user && user.primaryEmail) {
        // Trigger resend via Stack Auth user methods if available
        await user.sendVerificationEmail();
        setInfo(`Verification email resent to ${user.primaryEmail}. Please check your inbox.`);
      } else {
        setInfo("If an account exists, a new verification link has been sent to your email.");
      }
      setCooldown(30); // 30-second cooldown
    } catch (err: any) {
      setError(err?.message || "Failed to resend verification email. Please try again in a few moments.");
    } finally {
      setResending(false);
    }
  }

  async function handleSignOut() {
    try {
      if (stackClientApp) {
        await stackClientApp.signOut({ redirectUrl: "/sign-in" });
      }
    } catch {
      // Ignore
    } finally {
      router.push("/sign-in");
    }
  }

  if (!stackClientApp) {
    return (
      <main className="min-h-screen bg-floral text-smoky flex items-center justify-center p-6 font-sans">
        <div className="p-8 rounded-[28px] border border-smoky/20 bg-bone/30 text-center space-y-4 max-w-md">
          <h1 className="text-xl font-bold text-smoky">Stack Auth Configuration Pending</h1>
          <p className="text-xs font-mono text-olive">
            Please configure NEXT_PUBLIC_STACK_PROJECT_ID and NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY in .env.local.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-floral text-smoky flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md p-8 rounded-[28px] border border-smoky/20 bg-bone/30 shadow-2xl space-y-6">
        <div>
          <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
            MANDATORY VERIFICATION
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-smoky">Verify Your Email</h1>
          <p className="text-xs font-mono text-olive mt-1">
            Open the verification link sent to your inbox to activate your account.
          </p>
        </div>

        {targetEmail && (
          <div className="p-4 rounded-btn border border-smoky/20 bg-floral flex items-center gap-3 font-mono text-xs">
            <Mail className="w-5 h-5 text-smoky flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-olive uppercase block">Verification sent to:</span>
              <span className="font-bold text-smoky text-sm truncate block">{targetEmail}</span>
            </div>
          </div>
        )}

        {/* OTP Code Entry Option */}
        <div className="space-y-3 font-mono text-xs">
          <label className="text-olive block font-semibold">
            Have a verification code / OTP?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste code here"
              className="flex-1 px-3.5 py-2.5 rounded-btn bg-floral border border-smoky/20 text-smoky focus:outline-none focus:border-smoky font-mono text-sm"
            />
            <button
              onClick={() => verifyCode(code)}
              disabled={loading || !code.trim()}
              className="px-4 py-2.5 rounded-btn bg-smoky text-floral font-bold hover:bg-olive transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
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

        {/* Resend & Secondary Actions */}
        <div className="space-y-3 pt-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full py-2.5 px-4 rounded-btn border border-smoky/20 bg-floral text-smoky font-bold hover:bg-bone transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {resending
                ? "Sending verification..."
                : cooldown > 0
                ? `Resend email in ${cooldown}s`
                : "Resend verification email"}
            </span>
          </button>

          <div className="flex items-center justify-between pt-2 border-t border-smoky/10">
            <Link
              href="/sign-up"
              className="text-xs text-olive hover:text-smoky font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign Up</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="text-xs text-smoky hover:text-olive font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
