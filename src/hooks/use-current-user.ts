"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@stackframe/stack";
import { stackClientApp } from "@/stack";

export type CurrentUserResult = {
  user: ReturnType<typeof useUser>;
  displayName: string;
  email: string | null;
  initials: string;
  isSignedIn: boolean;
  signOut: () => Promise<void>;
  setDisplayName: (name: string) => Promise<void>;
};

function getInitials(displayName: string | null, email: string | null): string {
  if (displayName && displayName.trim()) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.includes("@")) {
    const prefix = email.split("@")[0];
    return prefix.slice(0, 2).toUpperCase();
  }
  return "G";
}

export function useCurrentUser(): CurrentUserResult {
  const user = useUser();
  const router = useRouter();

  const isSignedIn = Boolean(user);
  const email = user?.primaryEmail ?? null;
  const rawDisplayName = user?.displayName ?? null;
  const displayName = rawDisplayName || (email ? email.split("@")[0] : "Guest");
  const initials = getInitials(rawDisplayName, email);

  const signOut = useCallback(async () => {
    try {
      if (user) {
        await user.signOut();
      } else if (stackClientApp) {
        await stackClientApp.signOut({ redirectUrl: "/sign-in" });
      }
    } catch {
      // Ignore signout errors
    } finally {
      router.push("/sign-in");
      router.refresh();
    }
  }, [user, router]);

  const setDisplayName = useCallback(
    async (newName: string) => {
      if (!user) {
        throw new Error("No authenticated user to update.");
      }
      await user.setDisplayName(newName.trim() || null);
      router.refresh();
    },
    [user, router]
  );

  return {
    user,
    displayName,
    email,
    initials,
    isSignedIn,
    signOut,
    setDisplayName,
  };
}
