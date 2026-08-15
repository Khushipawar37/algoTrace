"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-floral/90 backdrop-blur-md py-3.5 border-b border-smoky/10 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Left: Typographic Logo with Trace Motif */}
        <a
          href="#"
          onClick={handleLogoClick}
          className="group flex items-center gap-2 text-xl font-bold tracking-tight text-smoky hover:opacity-90 transition-opacity cursor-pointer"
        >
          <span className="font-sans font-extrabold text-2xl tracking-tighter">
            Algo<span className="font-serif italic font-normal text-3xl">T</span>race
          </span>
          {/* Subtle trace motif */}
          <span className="inline-flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <span className="w-1.5 h-1.5 rounded-full border border-smoky bg-transparent" />
            <span className="w-3 h-[1px] bg-smoky" />
            <span className="w-2 h-2 rounded-full bg-smoky" />
          </span>
        </a>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-olive">
          <a
            href="#about"
            className="hover:text-smoky transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-smoky after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
            About
          </a>
          <a
            href="#how-it-works"
            className="hover:text-smoky transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-smoky after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
            How It Works
          </a>
          <a
            href="#practice"
            className="hover:text-smoky transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-smoky after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
            Practice
          </a>
          <a
            href="#learning-paths"
            className="hover:text-smoky transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-smoky after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
          >
            Learning Paths
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-smoky hover:text-olive transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link
            href="/workspace"
            className="group relative inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-btn bg-smoky text-floral text-sm font-medium transition-all duration-300 hover:bg-olive hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
          >
            <span>Start Practicing</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
