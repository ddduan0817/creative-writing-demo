"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useEditorStore } from "@/stores/editorStore";
import TopBar from "./TopBar";
import LeftPanel from "./left/LeftPanel";
import GeneralLeftPanel from "./left/GeneralLeftPanel";
import SimpleLeftPanel from "./left/SimpleLeftPanel";
import ScreenplayLeftPanel from "./left/ScreenplayLeftPanel";
import RichTextEditor from "./editor/RichTextEditor";
import ChatPanel from "./chat/ChatPanel";
import WorkflowChatPanel from "./chat/WorkflowChatPanel";
import CreationProgress from "./CreationProgress";
import { cn } from "@/lib/utils";

export default function WorkbenchLayout() {
  const searchParams = useSearchParams();
  const sceneParam = searchParams.get("scene") || "novel";
  const workId = searchParams.get("id");
  const isBackup = searchParams.get("v") === "backup1";
  const { leftCollapsed, leftPanelExpanded, toast, scene, workMode, resetToEmpty } =
    useEditorStore();

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const validScenes = [
      "novel",
      "screenplay",
      "marketing",
      "knowledge",
      "general",
    ] as const;

    if (validScenes.includes(sceneParam as (typeof validScenes)[number])) {
      const s = sceneParam as (typeof validScenes)[number];
      resetToEmpty(s);
    }
  }, [sceneParam, workId, resetToEmpty]);

  const isNovel = scene === "novel";
  const isScreenplay = scene === "screenplay";
  const isGeneral = scene === "general";
  const isSimple = scene === "marketing" || scene === "knowledge";
  const isWorkflow = workMode === "workflow" && (isNovel || isScreenplay);

  const renderLeftPanel = () => {
    if (isGeneral) return <GeneralLeftPanel />;
    if (isSimple) return <SimpleLeftPanel />;
    if (scene === "screenplay") return <ScreenplayLeftPanel />;
    return <LeftPanel />;
  };

  // Novel Agent mode (or not yet selected) → 2-panel: editor + chat
  // Novel scene without backup flag always uses this layout
  if (isNovel && !isBackup && workMode !== "workflow") {
    return (
      <div className="h-screen flex bg-white overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100">
          <TopBar />
          <div className="flex-1 overflow-hidden">
            <RichTextEditor />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-10 flex-shrink-0">
            <CreationProgress />
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatPanel />
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg toast-enter z-50">
            {toast}
          </div>
        )}
      </div>
    );
  }

  // 3-column layout: left panel + editor (+ optional right)
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div
          className={cn(
            "border-r border-gray-100 transition-all duration-300 overflow-hidden flex-shrink-0",
            leftCollapsed ? "w-0" : leftPanelExpanded ? "w-[768px]" : "w-72"
          )}
        >
          {renderLeftPanel()}
        </div>

        {/* Center Editor */}
        <div className="flex-1 overflow-hidden">
          <RichTextEditor />
        </div>

        {/* Right Chat Panel (Workflow mode) */}
        {isWorkflow && (
          <div className="w-[360px] flex-shrink-0 border-l border-gray-100 overflow-hidden">
            <WorkflowChatPanel />
          </div>
        )}
      </div>

      {/* Collapse toggle buttons */}
      <ToggleButtons />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg toast-enter z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

function ToggleButtons() {
  const { leftCollapsed, leftPanelExpanded, toggleLeft } =
    useEditorStore();

  return (
    <button
      onClick={toggleLeft}
      className="fixed top-1/2 -translate-y-1/2 z-30 w-5 h-10 bg-white border border-gray-200 rounded-r-md flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
      style={{ left: leftCollapsed ? 0 : leftPanelExpanded ? 768 : 288, transition: "left 0.3s" }}
    >
      <span className="text-gray-400 text-xs">
        {leftCollapsed ? "›" : "‹"}
      </span>
    </button>
  );
}
