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
          setTimeout(() => window.location.assign("/sign-in"), 1000);
          return;
        }

        if (user.isRestricted || !user.primaryEmailVerified) {
          window.location.assign(
            user.primaryEmail ? `/verify-email?email=${encodeURIComponent(user.primaryEmail)}` : "/verify-email"
          );
          return;
        }

        window.location.assign("/dashboard");
      } catch {
        if (!active) return;
        setError("Google authentication callback failed. Redirecting to sign in...");
        setTimeout(() => window.location.assign("/sign-in"), 1000);
      }
    }

    void run();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-floral text-smoky flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md p-8 rounded-[28px] border border-smoky/20 bg-bone/30 shadow-2xl text-center space-y-4 font-mono text-xs">
        <span className="text-olive uppercase tracking-widest block font-semibold">GOOGLE AUTHENTICATION</span>
        <h1 className="text-xl font-bold tracking-tight text-smoky font-sans">Completing Sign-In</h1>
        <p className="text-olive">{error ?? "Please wait while we establish your secure session..."}</p>
      </div>
    </main>
  );
}
