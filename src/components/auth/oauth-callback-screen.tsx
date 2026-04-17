"use client";

import { useEffect, useState } from "react";

import { stackClientApp } from "@/stack";

export function OauthCallbackScreen() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function waitForUser() {
      if (!stackClientApp) return null;
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const user = await stackClientApp.getUser({ includeRestricted: true });
        if (user) return user;
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      return null;
    }

    async function run() {
      if (!stackClientApp) {
        if (active) setError("Auth not configured.");
        return;
      }

      try {
        await stackClientApp.callOAuthCallback();
        if (!active) return;

        const user = await waitForUser();
        if (!active) return;

        if (!user) {
          setError("We could not establish your session. Redirecting to sign in...");
          setTimeout(() => window.location.assign("/sign-in?returnTo=/dashboard"), 1000);
          return;
        }

        if (user.isRestricted) {
          window.location.assign(
            user.primaryEmail ? `/verify-email?email=${encodeURIComponent(user.primaryEmail)}` : "/verify-email",
          );
          return;
        }

        window.location.assign("/dashboard");
      } catch {
        if (!active) return;
        setError("OAuth callback failed. Redirecting to sign in...");
        setTimeout(() => window.location.assign("/sign-in?returnTo=/dashboard"), 1000);
      }
    }

    void run();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-6">
      <div className="w-full space-y-3 rounded-xl border border-border/60 bg-card p-6 text-center">
        <h1 className="font-[var(--font-sora)] text-2xl font-bold">Completing Sign-In</h1>
        <p className="text-sm text-muted-foreground">{error ?? "Please wait while we finish your OAuth login..."}</p>
      </div>
    </main>
  );
}
