"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { stackClientApp } from "@/stack";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function verifyAuth() {
      if (!stackClientApp) {
        // If Stack Auth is not configured on environment, allow development viewing
        if (active) {
          setAuthorized(true);
          setChecking(false);
        }
        return;
      }

      try {
        const user = await stackClientApp.getUser({ includeRestricted: true });
        if (!active) return;

        if (!user) {
          // Unauthenticated -> Redirect to sign-in with preserved target route
          setAuthorized(false);
          setChecking(false);
          const redirectParam = encodeURIComponent(pathname);
          router.replace(`/sign-in?redirect=${redirectParam}` as any);
          return;
        }

        if (user.isRestricted || !user.primaryEmailVerified) {
          // Unverified credential user -> Redirect to verify-email
          setAuthorized(false);
          setChecking(false);
          const emailParam = user.primaryEmail ? `?email=${encodeURIComponent(user.primaryEmail)}` : "";
          router.replace(`/verify-email${emailParam}` as any);
          return;
        }

        // Authenticated and verified
        setAuthorized(true);
        setChecking(false);
      } catch {
        if (!active) return;
        setAuthorized(false);
        setChecking(false);
        router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}` as any);
      }
    }

    void verifyAuth();
    return () => {
      active = false;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-floral text-smoky flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3 p-6 rounded-[24px] border border-smoky/15 bg-bone/20">
          <span className="w-2.5 h-2.5 rounded-full bg-smoky animate-ping" />
          <span>Verifying authorization...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
