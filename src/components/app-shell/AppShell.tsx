"use client";

import React, { useState, Suspense } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";
import { CommandPalette } from "./CommandPalette";
import { ScrollToTop } from "@/components/landing/ScrollToTop";
import { ProtectedRoute } from "@/components/auth/protected-route";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-floral text-smoky selection:bg-bone selection:text-smoky relative">
        <Suspense fallback={<div className="fixed top-0 left-0 w-[250px] bottom-0 bg-smoky border-r border-bone/20 z-40" />}>
          {/* Sidebar */}
          <AppSidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
        </Suspense>

        <Suspense fallback={<div className="h-16 bg-floral border-b border-smoky/10 sticky top-0 z-30" />}>
          {/* Topbar */}
          <AppTopbar
            collapsed={collapsed}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          />
        </Suspense>

        {/* Main Content Area */}
        <main
          className={`transition-all duration-300 min-h-[calc(100vh-64px)] ${
            collapsed ? "ml-[72px]" : "ml-0 lg:ml-[250px]"
          }`}
        >
          <Suspense fallback={
            <div className="p-10 font-mono text-xs text-olive flex items-center justify-center min-h-[50vh]">
              Loading workspace module...
            </div>
          }>
            {children}
          </Suspense>
        </main>

        {/* Command Palette */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />

        {/* Floating Scroll To Top */}
        <ScrollToTop />
      </div>
    </ProtectedRoute>
  );
}
