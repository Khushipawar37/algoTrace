"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-smoky text-floral pt-24 pb-12 px-6 md:px-12 overflow-hidden border-t border-olive/30">
      {/* Clipped faint watermark background text */}
      <div className="absolute left-1/2 bottom-[-40px] -translate-x-1/2 font-mono text-[14vw] font-black text-olive/5 tracking-tighter select-none pointer-events-none whitespace-nowrap">
        ALGOTRACE
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-olive/20">
          {/* Brand Info (4 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-block font-sans font-extrabold text-3xl tracking-tighter text-floral"
            >
              algo<span className="font-serif italic font-normal text-4xl text-bone">T</span>race
            </Link>

            <p className="text-sm font-sans text-olive max-w-sm leading-relaxed">
              DSA guidance designed to preserve the struggle that makes learning stick.
            </p>
          </div>

          {/* Links Grid (7 Cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-8 font-mono text-xs">
            {/* Product */}
            <div>
              <span className="text-bone uppercase tracking-widest block mb-4 font-semibold">
                PRODUCT
              </span>
              <ul className="space-y-3 text-olive">
                <li>
                  <a href="#practice" className="hover:text-floral transition-colors">
                    Problems
                  </a>
                </li>
                <li>
                  <a href="#learning-paths" className="hover:text-floral transition-colors">
                    Learning Paths
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-floral transition-colors">
                    Progress
                  </a>
                </li>
              </ul>
            </div>

            {/* Explore */}
            <div>
              <span className="text-bone uppercase tracking-widest block mb-4 font-semibold">
                EXPLORE
              </span>
              <ul className="space-y-3 text-olive">
                <li>
                  <a href="#how-it-works" className="hover:text-floral transition-colors">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#demo" className="hover:text-floral transition-colors">
                    Methodology
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-floral transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <span className="text-bone uppercase tracking-widest block mb-4 font-semibold">
                ACCOUNT
              </span>
              <ul className="space-y-3 text-olive">
                <li>
                  <Link href="/sign-in" className="hover:text-floral transition-colors">
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link href="/workspace" className="hover:text-floral transition-colors">
                    Start practicing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <span className="text-bone uppercase tracking-widest block mb-4 font-semibold">
                LEGAL
              </span>
              <ul className="space-y-3 text-olive">
                <li>
                  <a href="#" className="hover:text-floral transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-floral transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-olive gap-4">
          <span>© {new Date().getFullYear()} AlgoTrace. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-bone" />
            <span>PRESERVING THE STRUGGLE THAT MAKES LEARNING STICK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
