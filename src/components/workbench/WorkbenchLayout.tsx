"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useEditorStore } from "@/stores/editorStore";
import TopBar from "./TopBar";
import LeftPanel from "./left/LeftPanel";
import GeneralLeftPanel from "./left/GeneralLeftPanel";
import RichTextEditor from "./editor/RichTextEditor";
import RightPanel from "./right/RightPanel";
import GeneralRightPanel from "./right/GeneralRightPanel";
import { cn } from "@/lib/utils";

export default function WorkbenchLayout() {
  const searchParams = useSearchParams();
  const sceneParam = searchParams.get("scene") || "novel";
  const { leftCollapsed, rightCollapsed, toast, scene, setScene } =
    useEditorStore();

  useEffect(() => {
    const validScenes = [
      "novel",
      "screenplay",
      "storyboard",
      "knowledge",
      "general",
    ] as const;
    if (validScenes.includes(sceneParam as (typeof validScenes)[number])) {
      setScene(sceneParam as (typeof validScenes)[number]);
    }
  }, [sceneParam, setScene]);

  const isGeneral = scene === "general";

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div
          className={cn(
            "border-r border-gray-100 transition-all duration-300 overflow-hidden flex-shrink-0",
            leftCollapsed ? "w-0" : "w-72"
          )}
        >
          {isGeneral ? <GeneralLeftPanel /> : <LeftPanel />}
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
          {isGeneral ? <GeneralRightPanel /> : <RightPanel />}
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
  const { leftCollapsed, rightCollapsed, toggleLeft, toggleRight } =
    useEditorStore();

  return (
    <>
      <button
        onClick={toggleLeft}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-30 w-5 h-10 bg-white border border-gray-200 rounded-r-md flex items-center justify-center hover:bg-gray-50 transition shadow-sm",
          leftCollapsed ? "left-0" : "left-[288px]"
        )}
        style={{ transition: "left 0.3s" }}
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
