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
import RightPanel from "./right/RightPanel";
import GeneralRightPanel from "./right/GeneralRightPanel";
import SimpleRightPanel from "./right/SimpleRightPanel";
import { cn } from "@/lib/utils";

export default function WorkbenchLayout() {
  const searchParams = useSearchParams();
  const sceneParam = searchParams.get("scene") || "novel";
  const workId = searchParams.get("id"); // 如果有 id 参数，说明是打开已有作品
  const { leftCollapsed, rightCollapsed, leftPanelExpanded, toast, scene, resetToEmpty } =
    useEditorStore();

  const hasInitialized = useRef(false);

  useEffect(() => {
    // 防止 React StrictMode 下重复执行
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

      if (workId) {
        // TODO: 有 id 参数时，从存储加载已有作品
        // 目前 demo 阶段直接重置为空白
        resetToEmpty(s);
      } else {
        // 没有 id 参数，说明是新建作品，重置为空白文档
        resetToEmpty(s);
      }
    }
  }, [sceneParam, workId, resetToEmpty]);

  const isGeneral = scene === "general";
  const isSimple = scene === "marketing" || scene === "knowledge";

  const renderLeftPanel = () => {
    if (isGeneral) return <GeneralLeftPanel />;
    if (isSimple) return <SimpleLeftPanel />;
    if (scene === "screenplay") return <ScreenplayLeftPanel />;
    return <LeftPanel />;
  };

  const renderRightPanel = () => {
    if (isGeneral) return <GeneralRightPanel />;
    if (isSimple) return <SimpleRightPanel />;
    return <RightPanel />;
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div
          className={cn(
            "border-r border-gray-100 transition-all duration-300 overflow-hidden flex-shrink-0",
            leftCollapsed ? "w-0" : leftPanelExpanded ? "w-[672px]" : "w-72"
          )}
        >
          {renderLeftPanel()}
        </div>

        {/* Center Editor */}
        <div className="flex-1 overflow-hidden">
          <RichTextEditor />
        </div>

        {/* Right Panel */}
        <div
          className={cn(
            "border-l border-gray-100 transition-all duration-300 overflow-hidden flex-shrink-0",
            rightCollapsed ? "w-0" : "w-80"
          )}
        >
          {renderRightPanel()}
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
  const { leftCollapsed, rightCollapsed, leftPanelExpanded, toggleLeft, toggleRight } =
    useEditorStore();

  return (
    <>
      <button
        onClick={toggleLeft}
        className="fixed top-1/2 -translate-y-1/2 z-30 w-5 h-10 bg-white border border-gray-200 rounded-r-md flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
        style={{ left: leftCollapsed ? 0 : leftPanelExpanded ? 672 : 288, transition: "left 0.3s" }}
      >
        <span className="text-gray-400 text-xs">
          {leftCollapsed ? "›" : "‹"}
        </span>
      </button>
      <button
        onClick={toggleRight}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-30 w-5 h-10 bg-white border border-gray-200 rounded-l-md flex items-center justify-center hover:bg-gray-50 transition shadow-sm",
          rightCollapsed ? "right-0" : "right-[320px]"
        )}
        style={{ transition: "right 0.3s" }}
      >
        <span className="text-gray-400 text-xs">
          {rightCollapsed ? "‹" : "›"}
        </span>
      </button>
    </>
  );
}
