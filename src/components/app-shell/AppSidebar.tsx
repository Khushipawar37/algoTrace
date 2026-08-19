"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Code2,
  Compass,
  RotateCcw,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Flame,
  CheckCircle2,
  HelpCircle,
  Circle,
  LogOut,
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Problems", href: "/problems", icon: Code2 },
  { label: "Learning Paths", href: "/learn", icon: Compass },
  { label: "Revision", href: "/revision", icon: RotateCcw },
  { label: "Progress", href: "/progress", icon: BarChart3 },
];

const RECENT_PROBLEMS = [
  { name: "Two Sum", slug: "two-sum", status: "solved-independent" },
  { name: "Valid Parentheses", slug: "valid-parentheses", status: "solved-guidance" },
  { name: "Binary Search", slug: "binary-search", status: "attempted" },
];

export function AppSidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { displayName, initials, isSignedIn, signOut, email } = useCurrentUser();

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-smoky text-floral border-r border-bone/20 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? "w-[72px]" : "w-[250px]"
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Logo Header */}
        <div className="h-16 px-5 border-b border-bone/20 flex items-center justify-between">
          <Link
            href={"/dashboard" as any}
            className="flex items-center gap-2 font-bold tracking-tight text-floral hover:opacity-90 transition-opacity"
          >
            {!collapsed ? (
              <span className="font-sans font-extrabold text-xl tracking-tighter">
                Algo<span className="font-serif italic font-normal text-2xl text-bone">T</span>race
              </span>
            ) : (
              <span className="font-sans font-extrabold text-xl tracking-tighter">
                A<span className="font-serif italic font-normal text-2xl text-bone">T</span>
              </span>
            )}
            {!collapsed && (
              <span className="inline-flex items-center gap-1 opacity-70">
                <span className="w-1.5 h-1.5 rounded-full border border-bone bg-transparent" />
                <span className="w-2.5 h-[1px] bg-bone" />
                <span className="w-1.5 h-1.5 rounded-full bg-bone" />
              </span>
            )}
          </Link>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded text-bone/60 hover:text-floral hover:bg-bone/10 transition-colors"
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Primary Navigation Links */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href as any}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-bone text-smoky font-bold shadow-md"
                    : "text-bone/80 hover:text-floral hover:bg-bone/10"
                } ${collapsed ? "justify-center px-0" : ""}`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-smoky" : "text-bone"}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Recent Problems Section */}
        {!collapsed && (
          <div className="px-5 py-4 border-t border-bone/15 mt-2">
            <span className="font-mono text-[10px] text-bone/70 tracking-widest uppercase block mb-3 font-semibold">
              RECENT
            </span>
            <div className="space-y-2">
              {RECENT_PROBLEMS.map((prob) => (
                <Link
                  key={prob.slug}
                  href={`/problems/${prob.slug}` as any}
                  className="flex items-center justify-between text-xs font-mono text-bone/80 hover:text-floral hover:bg-bone/10 px-2 py-1.5 rounded transition-colors group"
                >
                  <span className="truncate max-w-[160px]">{prob.name}</span>
                  <span className="flex items-center gap-1">
                    {prob.status === "solved-independent" ? (
                      <span className="w-2 h-2 rounded-full bg-bone" title="Solved independently" />
                    ) : prob.status === "solved-guidance" ? (
                      <span className="w-2 h-2 rounded-full border border-bone bg-transparent" title="Solved with guidance" />
                    ) : (
                      <span className="w-2 h-2 rounded-full border border-bone/40 bg-transparent" title="Attempted" />
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom User Card & Settings */}
      <div className="p-3 border-t border-bone/20 space-y-2">
        {!collapsed && (
          <Link
            href={"/profile" as any}
            className="px-3 py-2 rounded-btn bg-bone/5 border border-bone/15 flex items-center justify-between hover:bg-bone/10 transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-bone text-smoky font-mono font-bold text-xs flex items-center justify-center flex-shrink-0">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-floral leading-tight truncate group-hover:text-bone">
                  {displayName}
                </span>
                <span className="font-mono text-[10px] text-bone/70 truncate">
                  {email || "Student Account"}
                </span>
              </div>
            </div>
          </Link>
        )}

        <div className="flex items-center justify-between gap-1">
          <Link
            href={"/settings" as any}
            title="Settings"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-btn text-xs font-mono text-bone/80 hover:text-floral hover:bg-bone/10 transition-colors ${
              collapsed ? "w-full justify-center px-0" : "flex-1"
            }`}
          >
            <Settings className="w-4 h-4 text-bone" />
            {!collapsed && <span>Settings</span>}
          </Link>

          {!collapsed && (
            <button
              onClick={signOut}
              title="Sign Out"
              className="p-2 rounded-btn text-bone/70 hover:text-floral hover:bg-bone/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
