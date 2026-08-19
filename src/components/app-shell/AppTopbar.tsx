"use client";

import React from "react";
import Link from "next/link";
import { Search, Bell, LogOut, User } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface AppTopbarProps {
  onOpenCommandPalette?: () => void;
  collapsed?: boolean;
}

export function AppTopbar({ onOpenCommandPalette, collapsed = false }: AppTopbarProps) {
  const { displayName, initials, isSignedIn, signOut } = useCurrentUser();

  return (
    <header
      className={`sticky top-0 right-0 z-30 h-16 bg-floral border-b border-smoky/10 px-6 md:px-8 flex items-center justify-between transition-all duration-300 ${
        collapsed ? "ml-[72px]" : "ml-0 lg:ml-[250px]"
      }`}
    >
      {/* Search Input Trigger */}
      <button
        onClick={onOpenCommandPalette}
        className="flex items-center gap-3 px-4 py-2 rounded-btn bg-bone/30 border border-smoky/15 text-olive hover:border-smoky/40 text-xs font-mono transition-all w-full max-w-md"
      >
        <Search className="w-4 h-4 text-smoky" />
        <span className="flex-1 text-left">Search problems, topics, traces…</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-floral border border-smoky/20 text-[10px] font-mono text-smoky shadow-2xs">
          <span>⌘</span>K
        </kbd>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="p-2 rounded-btn text-olive hover:text-smoky hover:bg-bone/40 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-smoky" />
        </button>

        <Link
          href={"/profile" as any}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-btn hover:bg-bone/40 transition-colors group"
        >
          <div className="w-7 h-7 rounded-full bg-smoky text-floral font-mono font-bold text-xs flex items-center justify-center">
            {initials}
          </div>
          <span className="hidden sm:inline-block text-xs font-semibold text-smoky group-hover:text-olive">
            {displayName}
          </span>
        </Link>

        <button
          onClick={signOut}
          title="Sign Out"
          className="p-2 rounded-btn text-olive hover:text-smoky hover:bg-bone/40 transition-colors flex items-center gap-1 font-mono text-xs"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
