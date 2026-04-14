"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Menu } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { RightSlider } from "@/components/right-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function Navbar() {
  const [sliderOpen, setSliderOpen] = useState(false);
  const pathname = usePathname();

  // Don't render navbar on workspace or dashboard pages (they have their own headers)
  if (pathname.startsWith("/workspace") || pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <p className="font-[var(--font-sora)] text-xl font-semibold tracking-tight">algoTrace</p>
            <Badge className="ml-1 hidden bg-primary/15 text-primary md:inline-flex">
              Behavioral DSA Coach
            </Badge>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setSliderOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/60 bg-muted/50 transition-colors hover:bg-muted"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slider */}
      <RightSlider open={sliderOpen} onClose={() => setSliderOpen(false)}>
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSliderOpen(false)}
              className={cn(
                "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="my-4 h-px bg-border/40" />

        <div className="flex flex-col gap-2">
          <Button asChild variant="outline" className="w-full justify-center">
            <Link href="/sign-in" onClick={() => setSliderOpen(false)}>
              Sign In
            </Link>
          </Button>
          <Button asChild className="w-full justify-center">
            <Link href="/sign-up" onClick={() => setSliderOpen(false)}>
              Get Started
            </Link>
          </Button>
        </div>

        <div className="my-4 h-px bg-border/40" />

        <p className="text-xs text-muted-foreground">
          AI-powered behavioral coding coach for DSA practice.
        </p>
      </RightSlider>
    </>
  );
}
