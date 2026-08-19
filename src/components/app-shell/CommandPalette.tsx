"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Code2, Compass, ArrowRight, X } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMAND_ITEMS = [
  { group: "Problems", title: "Two Sum", href: "/problems/two-sum", category: "Easy • Hashing" },
  { group: "Problems", title: "Longest Substring Without Repeating Characters", href: "/problems/longest-substring-without-repeating-characters", category: "Medium • Sliding Window" },
  { group: "Problems", title: "3Sum", href: "/problems/3sum", category: "Medium • Two Pointers" },
  { group: "Problems", title: "Binary Search", href: "/problems/binary-search", category: "Easy • Binary Search" },
  { group: "Topics", title: "Hashing", href: "/learn/hashing", category: "18 / 25 Solved" },
  { group: "Topics", title: "Sliding Window", href: "/learn/sliding-window", category: "12 / 18 Solved" },
  { group: "Topics", title: "Binary Search", href: "/learn/binary-search", category: "10 / 22 Solved" },
  { group: "Navigate", title: "Dashboard", href: "/dashboard", category: "Home Overview" },
  { group: "Navigate", title: "Problem Library", href: "/problems", category: "All Problems" },
  { group: "Navigate", title: "Learning Paths", href: "/learn", category: "Curriculum Map" },
  { group: "Navigate", title: "Revision Queue", href: "/revision", category: "Spaced Practice" },
  { group: "Navigate", title: "Progress Analytics", href: "/progress", category: "Guidance Dependency" },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          setQuery("");
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = COMMAND_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    onClose();
    router.push(href as any);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-smoky/70 backdrop-blur-sm"
          />

          {/* Palette Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-xl rounded-[20px] bg-bone border border-smoky/30 shadow-2xl overflow-hidden text-smoky"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-smoky/15 bg-floral">
              <Search className="w-4 h-4 text-olive mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Search AlgoTrace problems, topics, routes…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-sans text-smoky placeholder:text-olive focus:outline-none"
              />
              <button
                onClick={onClose}
                className="p-1 rounded text-olive hover:text-smoky transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1 font-mono text-xs">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-olive">
                  No matching problems or topics found.
                </div>
              ) : (
                filtered.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-btn hover:bg-smoky hover:text-floral text-left transition-all duration-150 group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-olive uppercase font-bold tracking-wider group-hover:text-bone">
                        {item.group}
                      </span>
                      <span className="font-sans text-sm font-semibold text-smoky group-hover:text-floral">
                        {item.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-olive group-hover:text-bone">
                      <span className="text-[11px] font-mono">{item.category}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2 bg-floral border-t border-smoky/10 flex items-center justify-between text-[11px] font-mono text-olive">
              <span>Navigate with arrow keys or click</span>
              <span>ESC to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
