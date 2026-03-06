"use client";

import { useEditorStore } from "@/stores/editorStore";
import SettingsPanel from "./SettingsPanel";
import TagsPanel from "./TagsPanel";
import CharactersPanel from "./CharactersPanel";
import ChapterList from "./ChapterList";
import {
  Settings,
  Tag,
  Users,
  FileText,
  List,
  Plus,
  ChevronDown,
  Upload,
  LayoutTemplate,
  GitBranch,
  Milestone,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type AccordionSection = "settings" | "tags" | "characters" | "outline" | "chapters" | null;

export default function LeftPanel() {
  const [expandedSection, setExpandedSection] = useState<AccordionSection>("settings");
  const [outlineStructure, setOutlineStructure] = useState("three-act");

  const toggleSection = (section: AccordionSection) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const sections: {
    id: AccordionSection;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "settings", label: "设定", icon: Settings },
    { id: "tags", label: "标签", icon: Tag },
    { id: "characters", label: "角色", icon: Users },
    { id: "outline", label: "内容大纲", icon: FileText },
    { id: "chapters", label: "章节信息", icon: List },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden w-72">
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.id} className="border-b border-gray-50">
            {/* Accordion header */}
            <button
              onClick={() => toggleSection(section.id)}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-3 text-sm transition hover:bg-gray-50",
                expandedSection === section.id
                  ? "text-indigo-700 font-medium bg-indigo-50/50"
                  : "text-gray-600"
              )}
            >
              <section.icon className="w-4 h-4" />
              <span className="flex-1 text-left">{section.label}</span>
              {section.id === "chapters" && expandedSection !== "chapters" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    const num = useEditorStore.getState().chapters.length + 1;
                    useEditorStore.getState().addChapter(`第${num}章 新章节`);
                    useEditorStore.getState().showToast("已添加新章节");
                  }}
                  className="p-1 text-gray-400 hover:text-indigo-600 rounded hover:bg-gray-100 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </span>
              )}
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-gray-400 transition-transform duration-200",
                  expandedSection === section.id ? "rotate-0" : "-rotate-90"
                )}
              />
            </button>

            {/* Accordion content */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-200",
                expandedSection === section.id ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              )}
            >
              {section.id === "settings" && <SettingsPanel />}
              {section.id === "tags" && <TagsPanel />}
              {section.id === "characters" && <CharactersPanel />}
              {section.id === "outline" && (
                <OutlinePanel
                  outlineStructure={outlineStructure}
                  setOutlineStructure={setOutlineStructure}
                />
              )}
              {section.id === "chapters" && (
                <div>
                  <div className="flex items-center justify-end px-4 py-1">
                    <button
                      onClick={() => {
                        const num = useEditorStore.getState().chapters.length + 1;
                        useEditorStore.getState().addChapter(`第${num}章 新章节`);
                        useEditorStore.getState().showToast("已添加新章节");
                      }}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded hover:bg-indigo-50 transition"
                    >
                      <Plus className="w-3 h-3" />
                      添加章节
                    </button>
                  </div>
                  <ChapterList />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutlinePanel({
  outlineStructure,
  setOutlineStructure,
}: {
  outlineStructure: string;
  setOutlineStructure: (v: string) => void;
}) {
  const { showToast } = useEditorStore();
  const [chapterNotes, setChapterNotes] = useState("");
  const [keyNodes, setKeyNodes] = useState({
    opening: "",
    turning: "",
    climax: "",
    ending: "",
  });

  const structures = [
    { id: "three-act", label: "三幕剧" },
    { id: "four-part", label: "起承转合" },
    { id: "episodic", label: "单元剧" },
  ];

  return (
    <div className="px-4 pb-4 space-y-4">
      {/* 上传大纲文档 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">上传大纲文档</span>
        </div>
        <button
          onClick={() => showToast("上传功能演示中...")}
          className="w-full border border-dashed border-gray-200 rounded-lg py-3 text-xs text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition flex items-center justify-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          点击上传或拖拽文件
        </button>
      </div>

      {/* 结构模板 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <LayoutTemplate className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">结构模板</span>
        </div>
        <div className="flex gap-2">
          {structures.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setOutlineStructure(s.id);
                showToast(`已选择「${s.label}」结构`);
              }}
              className={cn(
                "flex-1 px-2 py-1.5 text-xs rounded-lg border transition",
                outlineStructure === s.id
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700 font-medium"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 章节脉络 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">章节脉络</span>
        </div>
        <textarea
          value={chapterNotes}
          onChange={(e) => setChapterNotes(e.target.value)}
          placeholder="每章核心事件、伏笔埋设..."
          className="w-full text-xs border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300"
          rows={3}
        />
      </div>

      {/* 关键节点 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Milestone className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">关键节点</span>
        </div>
        <div className="space-y-2">
          {[
            { key: "opening" as const, label: "开场事件" },
            { key: "turning" as const, label: "转折点" },
            { key: "climax" as const, label: "高潮" },
            { key: "ending" as const, label: "结局" },
          ].map((node) => (
            <div key={node.key}>
              <label className="text-xs text-gray-400 mb-0.5 block">
                {node.label}
              </label>
              <input
                type="text"
                value={keyNodes[node.key]}
                onChange={(e) =>
                  setKeyNodes((prev) => ({ ...prev, [node.key]: e.target.value }))
                }
                placeholder={`填写${node.label}...`}
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
