"use client";

import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, CheckCircle2, RotateCcw, Code2 } from "lucide-react";

interface CodeEditorPaneProps {
  code?: string;
  onChangeCode?: (val: string) => void;
  onRun?: () => void;
  onSubmit?: () => void;
  language?: string;
  onChangeLanguage?: (lang: string) => void;
}

const DEFAULT_CPP_CODE = `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`;

export function CodeEditorPane({
  code = DEFAULT_CPP_CODE,
  onChangeCode,
  onRun,
  onSubmit,
  language = "cpp",
  onChangeLanguage,
}: CodeEditorPaneProps) {
  const [internalCode, setInternalCode] = useState(code);

  const handleEditorChange = (value?: string) => {
    const v = value || "";
    setInternalCode(v);
    if (onChangeCode) onChangeCode(v);
  };

  const handleReset = () => {
    setInternalCode(DEFAULT_CPP_CODE);
    if (onChangeCode) onChangeCode(DEFAULT_CPP_CODE);
  };

  return (
    <div className="h-full bg-smoky text-floral flex flex-col justify-between border-r border-bone/20 overflow-hidden">
      {/* Editor Controls Bar */}
      <div className="h-12 px-4 border-b border-bone/20 bg-[#171812] flex items-center justify-between font-mono text-xs text-bone">
        <div className="flex items-center gap-3">
          <Code2 className="w-4 h-4 text-bone" />
          <select
            value={language}
            onChange={(e) => onChangeLanguage && onChangeLanguage(e.target.value)}
            className="bg-smoky border border-bone/30 text-bone text-xs font-mono px-2.5 py-1 rounded focus:outline-none"
          >
            <option value="cpp">C++20</option>
            <option value="python">Python 3</option>
            <option value="java">Java 17</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded border border-bone/30 text-bone/80 hover:text-floral hover:bg-bone/10 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor Canvas */}
      <div className="flex-1 relative bg-smoky">
        <Editor
          height="100%"
          language={language === "cpp" ? "cpp" : language === "python" ? "python" : "java"}
          value={internalCode}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "JetBrains Mono, monospace",
            minimap: { enabled: false },
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Bottom Action Controls */}
      <div className="h-14 px-5 border-t border-bone/20 bg-[#171812] flex items-center justify-between">
        <span className="font-mono text-xs text-bone/70">AUTOSAVED WORKSPACE</span>

        <div className="flex items-center gap-3">
          <button
            onClick={onRun}
            className="px-5 py-2 rounded-btn border border-bone/40 text-bone text-xs font-mono font-semibold hover:bg-bone/10 hover:text-floral transition-colors flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run</span>
          </button>

          <button
            onClick={onSubmit}
            className="px-6 py-2 rounded-btn bg-bone text-smoky text-xs font-mono font-bold hover:bg-floral transition-colors flex items-center gap-2 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
