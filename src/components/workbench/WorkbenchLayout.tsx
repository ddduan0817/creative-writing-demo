"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import TopBar from "./TopBar";
import LeftPanel from "./left/LeftPanel";
import GeneralLeftPanel from "./left/GeneralLeftPanel";
import SimpleLeftPanel from "./left/SimpleLeftPanel";
import ScreenplayLeftPanel from "./left/ScreenplayLeftPanel";
import RichTextEditor from "./editor/RichTextEditor";
import ChatPanel from "./chat/ChatPanel";
import CreationProgress from "./CreationProgress";
import { cn } from "@/lib/utils";
import { MessageSquare, ListChecks, Sparkles } from "lucide-react";

export default function WorkbenchLayout() {
  const searchParams = useSearchParams();
  const sceneParam = searchParams.get("scene") || "novel";
  const workId = searchParams.get("id");
  const isBackup = searchParams.get("v") === "backup1";
  const { leftCollapsed, leftPanelExpanded, toast, scene, resetToEmpty } =
    useEditorStore();

  const hasInitialized = useRef(false);
  const [workMode, setWorkMode] = useState<"agent" | "workflow" | null>(null);

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
  const needsModeSelect = (isNovel || isScreenplay) && !isBackup;

  const renderLeftPanel = () => {
    if (isGeneral) return <GeneralLeftPanel />;
    if (isSimple) return <SimpleLeftPanel />;
    if (scene === "screenplay") return <ScreenplayLeftPanel />;
    return <LeftPanel />;
  };

  // ── Mode Selection Screen ──────────────────────────────────
  if (needsModeSelect && workMode === null) {
    const sceneLabel = isNovel ? "小说" : "剧本";
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50/80">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-3">
            <span className="text-3xl font-light text-indigo-400 tracking-wide">选择创作模式</span>
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <p className="text-sm text-gray-400">{sceneLabel}创作 · 选择适合你的方式开始</p>
        </div>

        {/* Mode Cards */}
        <div className="flex gap-5">
          {/* Agent Mode */}
          <button
            onClick={() => setWorkMode("agent")}
            className="group w-64 bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition">
              <MessageSquare className="w-5 h-5 text-indigo-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">Agent 模式</h3>
            <p className="text-sm text-gray-500 leading-relaxed">自由对话，灵活探索</p>
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">通过 AI 对话逐步完成灵感→设定→世界观→角色→大纲→正文的完整创作流程</p>
          </button>

          {/* Workflow Mode */}
          <button
            onClick={() => setWorkMode("workflow")}
            className="group w-64 bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition">
              <ListChecks className="w-5 h-5 text-gray-600 group-hover:text-indigo-500 transition" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">Workflow 模式</h3>
            <p className="text-sm text-gray-500 leading-relaxed">成果导向，可控执行</p>
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">在配置面板中设定参数，按步骤生成内容，每一步都可精确调控</p>
          </button>
        </div>
      </div>
    );
  }

  // ── Agent Mode: Novel → 2-panel (editor + chat) ──────────
  if (isNovel && workMode === "agent") {
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

  // ── Workflow Mode (novel/screenplay) or Agent screenplay → 3-column layout ──
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
