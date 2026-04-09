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
import { cn } from "@/lib/utils";

export default function WorkbenchLayout() {
  const searchParams = useSearchParams();
  const sceneParam = searchParams.get("scene") || "novel";
  const workId = searchParams.get("id");
  const isBackup = searchParams.get("v") === "backup1";
  const { leftCollapsed, leftPanelExpanded, toast, scene, workMode, resetToEmpty } =
    useEditorStore();
  const settingsFullscreen = useEditorStore((s) => s.settingsFullscreen);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Map URL scene params to internal scene names
    const sceneMap: Record<string, string> = {
      ecommerce: "marketing",
      reading: "knowledge",
    };
    const mappedScene = sceneMap[sceneParam] || sceneParam;

    const validScenes = [
      "novel",
      "screenplay",
      "marketing",
      "knowledge",
      "general",
    ] as const;

    if (validScenes.includes(mappedScene as (typeof validScenes)[number])) {
      const s = mappedScene as (typeof validScenes)[number];
      resetToEmpty(s);
    }
  }, [sceneParam, workId, resetToEmpty]);

  const isNovel = scene === "novel";
  const isScreenplay = scene === "screenplay";
  const isMarketing = scene === "marketing";
  const isKnowledge = scene === "knowledge";
  const isGeneral = scene === "general";
  const isSimple = isMarketing || isKnowledge;
  const isAgentScene = isNovel || isScreenplay || isMarketing || isKnowledge;

  const renderLeftPanel = () => {
    if (isGeneral) return <GeneralLeftPanel />;
    if (isSimple) return <SimpleLeftPanel />;
    if (scene === "screenplay") return <ScreenplayLeftPanel />;
    return <LeftPanel />;
  };

  // Agent mode → 2-panel: editor + chat
  if (isAgentScene && !isBackup && workMode !== "workflow") {
    return (
      <div className="h-screen flex bg-white overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100">
          <TopBar />
          <div className="flex-1 overflow-hidden">
            <RichTextEditor />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ChatPanel />
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
            leftCollapsed || settingsFullscreen ? "w-0 border-r-0" : leftPanelExpanded ? "w-[768px]" : "w-72"
          )}
        >
          {renderLeftPanel()}
        </div>

        {/* Center Editor */}
        <div className="flex-1 overflow-hidden">
          <RichTextEditor />
        </div>

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
  const settingsFullscreen = useEditorStore((s) => s.settingsFullscreen);

  if (settingsFullscreen) return null;

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
