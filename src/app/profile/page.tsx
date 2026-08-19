"use client";

import React, { useState, useEffect, Suspense } from "react";
import { AppShell } from "@/components/app-shell/AppShell";
import { Flame, LogOut, Edit3, CheckCircle2, ShieldAlert } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

function ProfileContent() {
  const { displayName, email, initials, signOut, setDisplayName } = useCurrentUser();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNameInput(displayName);
  }, [displayName]);

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      await setDisplayName(nameInput.trim());
      setMessage("Display name updated successfully.");
      setEditing(false);
    } catch (err: any) {
      setError(err?.message || "Failed to update display name.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Profile Header */}
      <div className="p-8 rounded-[28px] border border-smoky/20 bg-smoky text-floral shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-bone text-smoky font-mono font-bold text-2xl flex items-center justify-center border-2 border-bone flex-shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-sans text-floral">
                {displayName}
              </h1>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="p-1 text-bone/60 hover:text-floral transition-colors"
                  title="Edit display name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs font-mono text-bone/80 mt-1">
              {email || "Authenticated Account"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-full border border-bone/30 bg-bone/10 text-bone flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>ACTIVE STUDENT</span>
          </span>
          <button
            onClick={signOut}
            className="px-4 py-2 rounded-btn bg-bone text-smoky font-bold hover:bg-floral transition-colors flex items-center gap-1.5 shadow"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Display Name Edit Form */}
      {editing && (
        <form
          onSubmit={handleSaveName}
          className="p-6 rounded-[22px] border border-smoky/20 bg-bone/30 space-y-4 max-w-lg font-mono text-xs"
        >
          <h3 className="font-bold text-smoky text-sm font-sans">Update Display Name</h3>
          <div>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3.5 py-2 rounded-btn bg-floral border border-smoky/20 text-smoky font-sans text-sm focus:outline-none focus:border-smoky"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-btn bg-smoky text-floral font-bold hover:bg-olive transition-colors"
            >
              {saving ? "Saving..." : "Save Name"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-btn border border-smoky/20 text-smoky font-bold hover:bg-bone/40 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && (
        <p className="text-xs font-mono text-olive p-3 rounded-btn bg-bone/30 border border-smoky/15 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-olive" />
          <span>{message}</span>
        </p>
      )}
      {error && (
        <p className="text-xs font-mono text-smoky font-bold p-3 rounded-btn bg-bone/50 border border-smoky/30 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-smoky" />
          <span>{error}</span>
        </p>
      )}

      {/* Core Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        <div className="p-6 rounded-[22px] border border-smoky/15 bg-bone/20 space-y-2">
          <span className="text-3xl font-extrabold text-smoky block">42</span>
          <span className="text-xs text-olive uppercase">Problems solved</span>
        </div>
        <div className="p-6 rounded-[22px] border border-smoky/15 bg-bone/20 space-y-2">
          <span className="text-3xl font-extrabold text-smoky block">18</span>
          <span className="text-xs text-olive uppercase">Independent solves</span>
        </div>
        <div className="p-6 rounded-[22px] border border-smoky/15 bg-bone/20 space-y-2">
          <span className="text-3xl font-extrabold text-smoky block">12 days</span>
          <span className="text-xs text-olive uppercase">Current streak</span>
        </div>
        <div className="p-6 rounded-[22px] border border-smoky/15 bg-bone/20 space-y-2">
          <span className="text-3xl font-extrabold text-smoky block">18 days</span>
          <span className="text-xs text-olive uppercase">Longest streak</span>
        </div>
      </div>

      {/* Pattern Summary Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-[24px] border border-smoky/15 bg-floral space-y-4">
          <h2 className="font-mono text-xs text-olive uppercase tracking-widest font-bold">
            STRONGEST PATTERNS
          </h2>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-full border border-smoky/20 bg-bone/40 text-smoky font-bold">
              Hashing &amp; State Lookup
            </span>
            <span className="px-3 py-1.5 rounded-full border border-smoky/20 bg-bone/40 text-smoky font-bold">
              Array Prefix Computation
            </span>
            <span className="px-3 py-1.5 rounded-full border border-smoky/20 bg-bone/40 text-smoky font-bold">
              LIFO Stack Parsing
            </span>
          </div>
        </div>

        <div className="p-8 rounded-[24px] border border-smoky/15 bg-floral space-y-4">
          <h2 className="font-mono text-xs text-olive uppercase tracking-widest font-bold">
            CURRENTLY IMPROVING
          </h2>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-full border border-smoky/20 bg-bone/40 text-smoky font-bold">
              Binary Search Boundaries
            </span>
            <span className="px-3 py-1.5 rounded-full border border-smoky/20 bg-bone/40 text-smoky font-bold">
              Sliding Window Shrink Criteria
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="p-10 font-mono text-xs text-olive flex items-center justify-center min-h-[50vh]">
          Loading student profile...
        </div>
      }>
        <ProfileContent />
      </Suspense>
    </AppShell>
  );
}
