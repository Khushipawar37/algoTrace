"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, RotateCcw, FileText, Activity, CheckCircle2 } from "lucide-react";
import { ProblemPane } from "@/components/workspace/ProblemPane";
import { CodeEditorPane } from "@/components/workspace/CodeEditorPane";
import { TutorPanel } from "@/components/workspace/TutorPanel";
import { TestPanel } from "@/components/workspace/TestPanel";
import { TracePanel } from "@/components/workspace/TracePanel";
import { AcceptedPanel } from "@/components/workspace/AcceptedPanel";

export default function ProblemWorkspacePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "two-sum";

  const [activeRightTab, setActiveRightTab] = useState<"tutor" | "trace">("tutor");
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [code, setCode] = useState("");

  const titleFormatted = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const handleRun = () => {
    setShowTestPanel(true);
  };

  const handleSubmit = () => {
    setShowAcceptedModal(true);
  };

  return (
    <div className="h-screen bg-smoky text-floral flex flex-col justify-between overflow-hidden selection:bg-bone selection:text-smoky">
      {/* Workspace Top Bar (Section 13) */}
      <header className="h-14 bg-[#171812] border-b border-bone/20 px-4 md:px-6 flex items-center justify-between font-mono text-xs z-20">
        <div className="flex items-center gap-4">
          <Link
            href={"/problems" as any}
            className="flex items-center gap-1.5 text-bone/80 hover:text-floral transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Problems</span>
          </Link>

          <span className="text-bone/40">/</span>

          <span className="font-bold text-floral font-sans text-sm">{titleFormatted}</span>

          <span className="px-2.5 py-0.5 rounded-full border border-bone/30 text-bone text-[10px] uppercase font-semibold">
            Easy
          </span>
        </div>

        {/* Right Bar Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-smoky p-1 rounded-btn border border-bone/20">
            <button
              onClick={() => setActiveRightTab("tutor")}
              className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                activeRightTab === "tutor" ? "bg-bone text-smoky font-bold" : "text-bone/70 hover:text-floral"
              }`}
            >
              <span>Tutor</span>
            </button>
            <button
              onClick={() => setActiveRightTab("trace")}
              className={`px-3 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
                activeRightTab === "trace" ? "bg-bone text-smoky font-bold" : "text-bone/70 hover:text-floral"
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Trace Log</span>
            </button>
          </div>

          <button className="px-3 py-1.5 rounded-btn border border-bone/30 text-bone/80 hover:text-floral hover:bg-bone/10 transition-colors flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Notes</span>
          </button>
        </div>
      </header>

      {/* Main 3-Pane Resizable Grid Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Pane: Problem Description (4 Cols) */}
        <div className="lg:col-span-4 h-full overflow-hidden">
          <ProblemPane title={titleFormatted} />
        </div>

        {/* Center Pane: Monaco Editor + Test Panel (5 Cols) */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CodeEditorPane
              code={code}
              onChangeCode={setCode}
              onRun={handleRun}
              onSubmit={handleSubmit}
            />
          </div>

          {showTestPanel && (
            <div className="h-56">
              <TestPanel />
            </div>
          )}
        </div>

        {/* Right Pane: AlgoTrace Tutor / Trace Log (3 Cols) */}
        <div className="lg:col-span-3 h-full overflow-hidden bg-[#171812]">
          {activeRightTab === "tutor" ? <TutorPanel /> : <TracePanel />}
        </div>
      </div>

      {/* Accepted Confirmation Modal */}
      {showAcceptedModal && (
        <AcceptedPanel onClose={() => setShowAcceptedModal(false)} />
      )}
    </div>
  );
}
