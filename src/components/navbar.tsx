"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Loader2, LogOut, Menu, UserCircle2 } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { RightSlider } from "@/components/right-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stackClientApp } from "@/stack";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function Navbar() {
  const [sliderOpen, setSliderOpen] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ displayName: string | null; primaryEmail: string | null } | null>(null);
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/workspace") || pathname.startsWith("/dashboard");

  useEffect(() => {
    let active = true;
    async function loadUser() {
      if (!stackClientApp) {
        if (active) {
          setCurrentUser(null);
          setLoadingAuth(false);
        }
        return;
      }
      try {
        const user = await stackClientApp.getUser();
        if (!active) return;
        if (user) {
          setCurrentUser({
            displayName: user.displayName,
            primaryEmail: user.primaryEmail,
          });
        } else {
          setCurrentUser(null);
        }
      } finally {
        if (active) setLoadingAuth(false);
      }
    }
    void loadUser();
    return () => {
      active = false;
    };
  }, [pathname]);

  async function onLogout() {
    if (!stackClientApp) return;
    await stackClientApp.signOut({ redirectUrl: "/" });
    setCurrentUser(null);
    setSliderOpen(false);
  }

  // Keep hooks order stable; only conditionally render after hooks are declared.
  if (hideNavbar) {
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
            <p className="font-[var(--font-sora)] text-xl font-semibold tracking-tight">AlgoTrace</p>
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
            {loadingAuth ? (
              <Button variant="outline" size="sm" disabled>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Checking
              </Button>
            ) : currentUser ? (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard">
                    <UserCircle2 className="mr-1.5 h-4 w-4" />
                    {currentUser.displayName ?? currentUser.primaryEmail ?? "Profile"}
                  </Link>
                </Button>
                <Button onClick={onLogout} size="sm" variant="secondary">
                  <LogOut className="mr-1.5 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/sign-in?returnTo=/dashboard">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
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
          {currentUser ? (
            <>
              <Button asChild variant="outline" className="w-full justify-center">
                <Link href="/dashboard" onClick={() => setSliderOpen(false)}>
                  <UserCircle2 className="mr-1.5 h-4 w-4" />
                  Profile / Dashboard
                </Link>
              </Button>
              <Button className="w-full justify-center" variant="secondary" onClick={onLogout}>
                <LogOut className="mr-1.5 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="outline" className="w-full justify-center">
                <Link href="/sign-in?returnTo=/dashboard" onClick={() => setSliderOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild className="w-full justify-center">
                <Link href="/sign-up" onClick={() => setSliderOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="my-4 h-px bg-border/40" />

        <p className="text-xs text-muted-foreground">
          AI-powered behavioral coding coach for DSA practice.
        </p>
      </RightSlider>
    </>
  );
}
