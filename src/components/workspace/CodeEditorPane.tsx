"use client";

import Editor from "@monaco-editor/react";
import { pendingLabel } from "./workspace-ui-state";
import { CheckCircle2, Code2, LoaderCircle, Maximize2, Minimize2, Play, RotateCcw } from "lucide-react";

interface CodeEditorPaneProps {
  code: string;
  starterCode: string;
  onChangeCode: (value: string) => void;
  onRun: () => void;
  onSubmit: () => void;
  busy?: "run" | "submit" | null;
  focused?: boolean;
  onToggleFocus?: () => void;
  language?: string;
  onChangeLanguage?: (language: string) => void;
}

export function CodeEditorPane({
  code, starterCode, onChangeCode, onRun, onSubmit, busy = null, focused = false,
  onToggleFocus, language = "cpp", onChangeLanguage,
}: CodeEditorPaneProps) {
  const pending = busy !== null;
  return (
    <div className="h-full bg-smoky text-floral flex flex-col border-r border-bone/20 overflow-hidden">
      <div className="h-12 px-4 border-b border-bone/20 bg-[#171812] flex items-center justify-between font-mono text-xs text-bone">
        <div className="flex items-center gap-3">
          <Code2 className="w-4 h-4 text-bone" />
          <select value={language} disabled={pending} onChange={(event) => onChangeLanguage?.(event.target.value)} className="bg-smoky border border-bone/30 text-bone text-xs font-mono px-2.5 py-1 rounded focus:outline-none disabled:opacity-50">
            <option value="cpp">C++20</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onChangeCode(starterCode)} disabled={pending} className="px-2.5 py-1 rounded border border-bone/30 text-bone/80 hover:text-floral hover:bg-bone/10 transition-colors flex items-center gap-1.5 disabled:opacity-40">
            <RotateCcw className="w-3 h-3" /><span>Reset</span>
          </button>
          <button type="button" onClick={onToggleFocus} aria-label={focused ? "Exit editor focus mode" : "Enter editor focus mode"} aria-pressed={focused} className="p-1.5 rounded border border-bone/30 text-bone/80 hover:text-floral hover:bg-bone/10 transition-colors" title={focused ? "Exit focus mode (Esc)" : "Focus editor"}>
            {focused ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <div className="flex-1 relative bg-smoky">
        <Editor height="100%" language={language === "cpp" ? "cpp" : language} value={code} onChange={(value) => onChangeCode(value ?? "")} theme="vs-dark" options={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", minimap: { enabled: false }, lineNumbersMinChars: 3, scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 12, bottom: 12 }, readOnly: pending }} />
        {pending && <div className="absolute inset-0 z-10 grid place-items-center bg-smoky/55 backdrop-blur-[1px]" role="status" aria-live="polite">
          <div className="flex items-center gap-3 rounded border border-bone/20 bg-[#171812]/95 px-5 py-3 font-mono text-xs text-bone shadow-xl">
            <LoaderCircle className="h-4 w-4 animate-spin" /><span>{pendingLabel(busy)}</span>
          </div>
        </div>}
      </div>
      <div className="h-14 px-5 border-t border-bone/20 bg-[#171812] flex items-center justify-between">
        <span className="font-mono text-xs text-bone/70">AUTOSAVED WORKSPACE</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onRun} disabled={pending} className="px-5 py-2 rounded-btn border border-bone/40 text-bone text-xs font-mono font-semibold hover:bg-bone/10 hover:text-floral transition-colors flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-40"><Play className="w-3.5 h-3.5 fill-current" /><span>Run</span></button>
          <button type="button" onClick={onSubmit} disabled={pending} className="px-6 py-2 rounded-btn bg-bone text-smoky text-xs font-mono font-bold hover:bg-floral transition-colors flex items-center gap-2 shadow-md disabled:cursor-not-allowed disabled:opacity-40"><CheckCircle2 className="w-4 h-4" /><span>Submit</span></button>
        </div>
      </div>
    </div>
  );
}
