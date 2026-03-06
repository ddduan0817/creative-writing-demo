"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useState } from "react";
import {
  Settings,
  Tag,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SimpleSettingsPanel from "./SimpleSettingsPanel";
import SimpleTagsPanel from "./SimpleTagsPanel";

export default function SimpleLeftPanel() {
  const { leftView, setLeftView, scene } = useEditorStore();
  const [settingsOpen, setSettingsOpen] = useState(true);

  const showDetailPanel = leftView === "settings" || leftView === "tags";

  return (
    <div className="h-full flex flex-col overflow-hidden w-72">
      <div className="flex-1 overflow-y-auto">
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
                {
                  id: "settings" as const,
                  label: "设定",
                  icon: Settings,
                },
                { id: "tags" as const, label: "标签", icon: Tag },
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

        {/* 设定/标签 详情面板 */}
        {showDetailPanel && (
          <div className="flex-1 overflow-y-auto">
            {leftView === "settings" && <SimpleSettingsPanel scene={scene} />}
            {leftView === "tags" && <SimpleTagsPanel scene={scene} />}
          </div>
        )}

        {/* 单篇模式提示 */}
        {!showDetailPanel && (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-gray-400">
              单篇模式，无需章节管理
            </p>
            <p className="text-xs text-gray-300 mt-1">
              点击上方「设定」或「标签」配置作品信息
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
