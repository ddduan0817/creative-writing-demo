"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useState } from "react";
import {
  Settings,
  Tag,
  Users,
  FileText,
  List,
  Plus,
  ChevronDown,
  ChevronRight,
  Film,
  Clapperboard,
  BookImage,
  ScanLine,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ScreenplaySettingsPanel from "./ScreenplaySettingsPanel";
import TagsPanel from "./TagsPanel";
import CharactersPanel from "./CharactersPanel";
import ChapterList from "./ChapterList";

const subScenes = [
  { id: "movie", label: "影视剧本", icon: Film, desc: "标准电影/电视剧本" },
  { id: "short", label: "短剧剧本", icon: Clapperboard, desc: "快节奏卡点本" },
  { id: "comic", label: "漫剧剧本", icon: BookImage, desc: "动态漫画故事本" },
  { id: "storyboard", label: "分镜脚本", icon: ScanLine, desc: "执行指令拆解" },
  { id: "comic_script", label: "漫剧脚本", icon: Layers, desc: "画师执行指令" },
];

export default function ScreenplayLeftPanel() {
  const { leftView, setLeftView } = useEditorStore();
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [activeSubScene, setActiveSubScene] = useState("movie");
  const [subSceneOpen, setSubSceneOpen] = useState(true);

  const showDetailPanel = leftView !== "editor" && leftView !== "outline";

  return (
    <div className="h-full flex flex-col overflow-hidden w-72">
      <div className="flex-1 overflow-y-auto">
        {/* 子场景选择 */}
        <div className="border-b border-gray-50">
          <button
            onClick={() => setSubSceneOpen(!subSceneOpen)}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {subSceneOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            剧本类型
          </button>
          {subSceneOpen && (
            <div className="px-2 pb-2 space-y-0.5">
              {subScenes.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubScene(sub.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                    activeSubScene === sub.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <sub.icon className="w-4 h-4" />
                  <div className="flex-1 text-left">
                    <span className="block">{sub.label}</span>
                    <span className="text-[10px] text-gray-400 font-normal">{sub.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 作品设置 group */}
        <div className="border-b border-gray-50">
          <button
            onClick={() => {
              const next = !settingsOpen;
              setSettingsOpen(next);
              if (!next && showDetailPanel) {
                setLeftView("editor");
              }
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            {settingsOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            作品设置
          </button>
          {settingsOpen && (
            <div className="px-2 pb-2 space-y-0.5">
              {[
                { id: "settings" as const, label: "设定", icon: Settings },
                { id: "tags" as const, label: "标签", icon: Tag },
                { id: "characters" as const, label: "角色", icon: Users },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLeftView(leftView === item.id ? "editor" : item.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                    leftView === item.id
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 设定/标签/角色 详情面板 */}
        {showDetailPanel ? (
          <div className="flex-1 overflow-y-auto">
            {leftView === "settings" && <ScreenplaySettingsPanel subScene={activeSubScene} />}
            {leftView === "tags" && <TagsPanel />}
            {leftView === "characters" && <CharactersPanel />}
          </div>
        ) : (
          <>
            {/* 内容大纲 */}
            <button
              onClick={() => setLeftView("outline")}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-3 text-sm border-b border-gray-50 transition",
                leftView === "outline"
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <FileText className="w-4 h-4" />
              内容大纲
            </button>

            {/* 章节/场次信息 */}
            <div className="border-b border-gray-50">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    场次信息
                  </span>
                </div>
                <button
                  onClick={() => {
                    const num = useEditorStore.getState().chapters.length + 1;
                    useEditorStore.getState().addChapter(`场 ${num}`);
                    useEditorStore.getState().showToast("已添加新场次");
                  }}
                  className="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-gray-100 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <ChapterList />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
