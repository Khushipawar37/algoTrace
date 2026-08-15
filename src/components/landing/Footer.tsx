"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative bg-floral text-smoky pt-20 pb-12 px-6 md:px-12 border-t border-smoky/15">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-smoky/15">
          {/* Brand Info (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <a
              href="#"
              onClick={handleLogoClick}
              className="inline-block font-sans font-extrabold text-3xl tracking-tighter text-smoky cursor-pointer hover:opacity-90 transition-opacity"
            >
              Algo<span className="font-serif italic font-normal text-4xl text-olive">T</span>race
            </a>

            <p className="text-sm font-sans text-olive max-w-sm leading-relaxed">
              DSA guidance designed to preserve the struggle that makes learning stick.
            </p>
          </div>

          {/* Links Grid (7 Cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 font-mono text-xs">
            {/* Practice */}
            <div>
              <span className="text-smoky uppercase tracking-widest block mb-4 font-bold">
                PRACTICE
              </span>
              <ul className="space-y-3 text-olive font-medium">
                <li>
                  <a href="#practice" className="hover:text-smoky transition-colors">
                    Problems
                  </a>
                </li>
                <li>
                  <a href="#learning-paths" className="hover:text-smoky transition-colors">
                    Learning Paths
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-smoky transition-colors">
                    Socratic Loop
                  </a>
                </li>
              </ul>
            </div>

            {/* Explore */}
            <div>
              <span className="text-smoky uppercase tracking-widest block mb-4 font-bold">
                EXPLORE
              </span>
              <ul className="space-y-3 text-olive font-medium">
                <li>
                  <a href="#how-it-works" className="hover:text-smoky transition-colors">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#demo" className="hover:text-smoky transition-colors">
                    Methodology
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-smoky transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <span className="text-smoky uppercase tracking-widest block mb-4 font-bold">
                ACCOUNT
              </span>
              <ul className="space-y-3 text-olive font-medium">
                <li>
                  <Link href="/sign-in" className="hover:text-smoky transition-colors">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/workspace" className="hover:text-smoky transition-colors">
                    Start practicing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <span className="text-smoky uppercase tracking-widest block mb-4 font-bold">
                LEGAL
              </span>
              <ul className="space-y-3 text-olive font-medium">
                <li>
                  <a href="#" className="hover:text-smoky transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-smoky transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-olive font-medium gap-4">
          <span>© {new Date().getFullYear()} AlgoTrace. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-smoky" />
            <span className="text-smoky font-semibold">PRESERVING THE STRUGGLE THAT MAKES LEARNING STICK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
