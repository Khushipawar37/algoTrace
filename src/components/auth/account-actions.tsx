"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { stackClientApp } from "@/stack";

export function AccountActions() {
  const [loading, setLoading] = useState<"none" | "logout" | "delete">("none");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function logout() {
    if (!stackClientApp) return;
    setLoading("logout");
    setError(null);
    try {
      await stackClientApp.signOut({ redirectUrl: "/" });
    } catch {
      setError("Failed to logout. Please try again.");
      setLoading("none");
    }
  }

  async function deleteAccount() {
    if (!confirm("Delete your account permanently? This cannot be undone.")) return;
    setLoading("delete");
    setError(null);
    try {
      const response = await fetch("/api/auth/account", { method: "DELETE" });
      if (!response.ok) throw new Error("delete failed");
      if (stackClientApp) {
        await stackClientApp.signOut({ redirectUrl: "/sign-up" });
      } else {
        router.push("/sign-up");
      }
    } catch {
      setError("Unable to delete account right now.");
      setLoading("none");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button onClick={logout} variant="secondary" disabled={loading !== "none"}>
          {loading === "logout" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
          Logout
        </Button>
        <Button onClick={deleteAccount} variant="outline" disabled={loading !== "none"}>
          {loading === "delete" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
          )}
          Delete Account
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <p className="text-xs text-muted-foreground">
        To sign in with another account, logout first and then sign in again.
      </p>
    </div>
  );
}

