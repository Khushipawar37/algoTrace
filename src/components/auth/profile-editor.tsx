"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { stackClientApp } from "@/stack";

export function ProfileEditor({ initialDisplayName }: { initialDisplayName: string }) {
  const [name, setName] = useState(initialDisplayName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function save() {
    if (!stackClientApp) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const user = await stackClientApp.getUser({ includeRestricted: true });
      if (!user) throw new Error("No user");
      await user.setDisplayName(name.trim() || null);
      setMessage("Profile updated successfully.");
      router.refresh();
    } catch {
      setError("Unable to update profile at the moment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-border/60 p-3">
      <p className="text-sm font-semibold">Edit Basic Profile</p>
      <div className="space-y-1.5">
        <label className="text-xs text-muted-foreground" htmlFor="displayName">
          Display Name
        </label>
        <input
          id="displayName"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none ring-primary/30 focus:ring-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
      {message && <p className="text-xs text-green-700 dark:text-green-400">{message}</p>}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

