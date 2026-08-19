"use client";

import React, { useState, Suspense } from "react";
import { AppShell } from "@/components/app-shell/AppShell";
import { LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";

function SettingsContent() {
  const { displayName, email, signOut } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<"account" | "editor" | "learning" | "privacy">("editor");

  // Editor settings state
  const [language, setLanguage] = useState("cpp");
  const [fontSize, setFontSize] = useState("13");
  const [tabSize, setTabSize] = useState("4");
  const [wordWrap, setWordWrap] = useState(true);
  const [minimap, setMinimap] = useState(false);

  // Learning settings state
  const [tutorStyle, setTutorStyle] = useState<"socratic" | "balanced" | "direct">("socratic");
  const [alwaysAsk, setAlwaysAsk] = useState(true);
  const [suggestEdgeCases, setSuggestEdgeCases] = useState(true);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-smoky/10 pb-6">
        <span className="font-mono text-xs text-olive tracking-widest uppercase block mb-1">
          APPLICATION PREFERENCES
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-smoky">
          Settings
        </h1>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-smoky/15 font-mono text-xs text-olive">
        {(["account", "editor", "learning", "privacy"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 border-b-2 font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? "border-smoky text-smoky"
                : "border-transparent text-olive hover:text-smoky"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Editor Tab Content */}
      {activeTab === "editor" && (
        <div className="p-8 rounded-[24px] border border-smoky/15 bg-floral space-y-8 font-sans">
          <h2 className="font-mono text-xs text-olive tracking-widest uppercase font-bold border-b border-smoky/10 pb-3">
            CODE EDITOR ENVIRONMENT
          </h2>

          <div className="space-y-6 max-w-xl font-mono text-xs">
            {/* Preferred Language */}
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-smoky block text-sm">Default Language</label>
                <span className="text-olive text-[11px]">Primary language for workspace code templates</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-bone/30 border border-smoky/20 text-smoky px-3 py-1.5 rounded focus:outline-none"
              >
                <option value="cpp">C++20</option>
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
              </select>
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between border-t border-smoky/10 pt-4">
              <div>
                <label className="font-bold text-smoky block text-sm">Font Size</label>
                <span className="text-olive text-[11px]">Monaco editor font size in pixels</span>
              </div>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="bg-bone/30 border border-smoky/20 text-smoky px-3 py-1.5 rounded focus:outline-none"
              >
                <option value="13">13px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
              </select>
            </div>

            {/* Tab Size */}
            <div className="flex items-center justify-between border-t border-smoky/10 pt-4">
              <div>
                <label className="font-bold text-smoky block text-sm">Tab Size</label>
                <span className="text-olive text-[11px]">Spaces per indentation tab</span>
              </div>
              <select
                value={tabSize}
                onChange={(e) => setTabSize(e.target.value)}
                className="bg-bone/30 border border-smoky/20 text-smoky px-3 py-1.5 rounded focus:outline-none"
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
              </select>
            </div>

            {/* Word Wrap */}
            <div className="flex items-center justify-between border-t border-smoky/10 pt-4">
              <div>
                <label className="font-bold text-smoky block text-sm">Word Wrap</label>
                <span className="text-olive text-[11px]">Wrap long code lines automatically</span>
              </div>
              <button
                onClick={() => setWordWrap(!wordWrap)}
                className={`px-3 py-1 rounded border transition-colors ${
                  wordWrap ? "bg-smoky text-floral border-smoky font-bold" : "bg-bone/20 text-olive border-smoky/20"
                }`}
              >
                {wordWrap ? "ON" : "OFF"}
              </button>
            </div>

            {/* Editor Minimap */}
            <div className="flex items-center justify-between border-t border-smoky/10 pt-4">
              <div>
                <label className="font-bold text-smoky block text-sm">Editor Minimap</label>
                <span className="text-olive text-[11px]">Display code minimap preview on the right</span>
              </div>
              <button
                onClick={() => setMinimap(!minimap)}
                className={`px-3 py-1 rounded border transition-colors ${
                  minimap ? "bg-smoky text-floral border-smoky font-bold" : "bg-bone/20 text-olive border-smoky/20"
                }`}
              >
                {minimap ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Learning Tab Content */}
      {activeTab === "learning" && (
        <div className="p-8 rounded-[24px] border border-smoky/15 bg-floral space-y-8 font-sans">
          <h2 className="font-mono text-xs text-olive tracking-widest uppercase font-bold border-b border-smoky/10 pb-3">
            SOCRATIC TUTOR PREFERENCES
          </h2>

          <div className="space-y-6 max-w-xl font-mono text-xs">
            {/* Tutor Style */}
            <div className="space-y-3">
              <label className="font-bold text-smoky block text-sm font-sans">Tutor Style</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "socratic", label: "Socratic", desc: "Questions before explanations" },
                  { id: "balanced", label: "Balanced", desc: "Questions + concise hints" },
                  { id: "direct", label: "Direct", desc: "Shorter reasoning guidance" },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setTutorStyle(style.id as any)}
                    className={`p-3 rounded-btn border text-left transition-all ${
                      tutorStyle === style.id
                        ? "border-smoky bg-smoky text-floral shadow-md"
                        : "border-smoky/15 bg-bone/20 text-smoky hover:border-smoky/40"
                    }`}
                  >
                    <span className="font-bold block mb-1">{style.label}</span>
                    <span className="text-[10px] opacity-80 block font-sans leading-tight">
                      {style.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Always ask before increasing guidance level */}
            <div className="flex items-center justify-between border-t border-smoky/10 pt-4">
              <div>
                <label className="font-bold text-smoky block text-sm font-sans">
                  Always ask before increasing guidance level
                </label>
                <span className="text-olive text-[11px] font-sans">
                  Escalating from Level 01 to Level 05 requires explicit student trigger
                </span>
              </div>
              <button
                onClick={() => setAlwaysAsk(!alwaysAsk)}
                className={`px-3 py-1 rounded border transition-colors ${
                  alwaysAsk ? "bg-smoky text-floral border-smoky font-bold" : "bg-bone/20 text-olive border-smoky/20"
                }`}
              >
                {alwaysAsk ? "ENABLED" : "DISABLED"}
              </button>
            </div>

            {/* Automatically suggest edge cases */}
            <div className="flex items-center justify-between border-t border-smoky/10 pt-4">
              <div>
                <label className="font-bold text-smoky block text-sm font-sans">
                  Automatically suggest edge cases
                </label>
                <span className="text-olive text-[11px] font-sans">
                  Prompt boundary checks when duplicate/empty inputs are detected
                </span>
              </div>
              <button
                onClick={() => setSuggestEdgeCases(!suggestEdgeCases)}
                className={`px-3 py-1 rounded border transition-colors ${
                  suggestEdgeCases ? "bg-smoky text-floral border-smoky font-bold" : "bg-bone/20 text-olive border-smoky/20"
                }`}
              >
                {suggestEdgeCases ? "ENABLED" : "DISABLED"}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "account" && (
        <div className="p-8 rounded-[24px] border border-smoky/15 bg-floral space-y-6 font-mono text-xs">
          <h2 className="text-olive uppercase tracking-widest font-bold border-b border-smoky/10 pb-3">
            ACCOUNT DETAILS
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-olive block text-[11px] uppercase mb-0.5">Display Name</label>
              <p className="font-sans text-base font-bold text-smoky">{displayName}</p>
            </div>
            <div>
              <label className="text-olive block text-[11px] uppercase mb-0.5">Primary Email</label>
              <p className="font-sans text-sm text-smoky font-medium">{email || "Student Account"}</p>
            </div>
            <div className="pt-2">
              <button
                onClick={signOut}
                className="px-4 py-2 rounded-btn bg-smoky text-floral font-bold hover:bg-olive transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="p-8 rounded-[24px] border border-smoky/15 bg-floral space-y-4 font-mono text-xs">
          <h2 className="text-olive uppercase tracking-widest font-bold">PRIVACY &amp; DATA</h2>
          <p className="font-sans text-sm text-smoky">All problem reasoning traces are saved securely and accessible only to you.</p>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="p-10 font-mono text-xs text-olive flex items-center justify-center min-h-[50vh]">
          Loading settings...
        </div>
      }>
        <SettingsContent />
      </Suspense>
    </AppShell>
  );
}
