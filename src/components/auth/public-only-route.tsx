"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { stackClientApp } from "@/stack";

interface PublicOnlyRouteProps {
  children: React.ReactNode;
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkExistingAuth() {
      if (!stackClientApp) {
        if (active) setChecking(false);
        return;
      }

      try {
        const user = await stackClientApp.getUser({ includeRestricted: true });
        if (!active) return;

        if (user) {
          if (user.isRestricted || !user.primaryEmailVerified) {
            const emailParam = user.primaryEmail ? `?email=${encodeURIComponent(user.primaryEmail)}` : "";
            router.replace(`/verify-email${emailParam}` as any);
            return;
          }
          router.replace("/dashboard" as any);
          return;
        }

        setChecking(false);
      } catch {
        if (active) setChecking(false);
      }
    }

    void checkExistingAuth();
    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-floral text-smoky flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3 p-6 rounded-[24px] border border-smoky/15 bg-bone/20">
          <span className="w-2.5 h-2.5 rounded-full bg-smoky animate-pulse" />
          <span>Checking session status...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
