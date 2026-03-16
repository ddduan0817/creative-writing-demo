"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useState } from "react";
import {
  Tag,
  Users,
  FileText,
  List,
  Plus,
  ChevronRight,
  Film,
  Clapperboard,
  BookImage,
  ScanLine,
  Layers,
  Upload,
  LayoutTemplate,
  GitBranch,
  Milestone,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ScreenplaySettingsPanel from "./ScreenplaySettingsPanel";
import TagsPanel from "./TagsPanel";
import CharactersPanel from "./CharactersPanel";
import ChapterList from "./ChapterList";
import { simulateAIStream } from "@/lib/aiSimulator";
import { mockScreenplayOutline } from "@/data/mockChapters";

const subScenes = [
  { id: "movie", label: "影视剧本", icon: Film, desc: "标准电影/电视剧本" },
  { id: "short", label: "短剧剧本", icon: Clapperboard, desc: "快节奏卡点本" },
  { id: "comic", label: "漫剧剧本", icon: BookImage, desc: "动态漫画故事本" },
  { id: "storyboard", label: "分镜脚本", icon: ScanLine, desc: "执行指令拆解" },
  { id: "comic_script", label: "漫剧脚本", icon: Layers, desc: "画师执行指令" },
];

type ExpandedSection = "subscene" | "tags" | "characters" | "outline" | "scenes" | null;

export default function ScreenplayLeftPanel() {
  const { showToast, setLeftPanelExpanded } = useEditorStore();
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(null);
  const [activeSubScene, setActiveSubScene] = useState("");
  const [outlineContent, setOutlineContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [outlineStructure, setOutlineStructure] = useState("three-act");

  // 切换展开面板（类似小说的展开方式）
  const toggleSection = (section: ExpandedSection) => {
    if (expandedSection === section) {
      setExpandedSection(null);
      setLeftPanelExpanded(false);
    } else {
      setExpandedSection(section);
      setLeftPanelExpanded(true);
    }
  };

  // 关闭展开面板
  const closeExpansion = () => {
    setExpandedSection(null);
    setLeftPanelExpanded(false);
  };

  const handleGenerateOutline = () => {
    setGenerating(true);
    setOutlineContent("");
    simulateAIStream(mockScreenplayOutline, (current, done) => {
      setOutlineContent(current);
      if (done) {
        setGenerating(false);
        showToast("总纲生成完成");
      }
    }, 20);
  };

  const sections: {
    id: ExpandedSection;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "subscene", label: "剧本/分镜", icon: Film },
    { id: "tags", label: "标签", icon: Tag },
    { id: "characters", label: "角色", icon: Users },
    { id: "outline", label: "内容大纲", icon: FileText },
    { id: "scenes", label: "场次信息", icon: List },
  ];

  // 获取当前选中的子场景
  const currentSubScene = subScenes.find((s) => s.id === activeSubScene);

  return (
    <div className="h-full flex">
      {/* 左列 - 主面板 */}
      <div className="w-72 flex-shrink-0 h-full flex flex-col bg-white">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {sections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition text-sm",
                    expandedSection === section.id
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <section.icon className="w-4 h-4" />
                    <span>{section.label}</span>
                    {/* 显示已选信息 */}
                    {section.id === "subscene" && currentSubScene && (
                      <span className="text-xs text-indigo-500">
                        {currentSubScene.label}
                      </span>
                    )}
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 transition-transform",
                      expandedSection === section.id && "rotate-90"
                    )}
                  />
                </button>

                {/* 已选子场景预览 */}
                {section.id === "subscene" && currentSubScene && expandedSection !== "subscene" && (
                  <div className="mt-2 px-3 py-2 bg-blue-50 rounded-lg flex items-center gap-2">
                    <currentSubScene.icon className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-blue-700">{currentSubScene.label}</span>
                      <span className="text-[10px] text-gray-400 ml-2">{currentSubScene.desc}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右列 - 展开面板 */}
      {expandedSection && (
        <div className="w-[480px] flex-shrink-0 h-full border-l border-gray-100 overflow-y-auto bg-gray-50/30">
          <div className="p-4">
            {/* 面板标题 */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                {sections.find((s) => s.id === expandedSection)?.label}
              </span>
              <button
                onClick={closeExpansion}
                className="p-1 hover:bg-gray-200 rounded transition"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* 剧本/分镜 子类型 */}
            {expandedSection === "subscene" && (
              <div className="space-y-2">
                {subScenes.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubScene(sub.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                      activeSubScene === sub.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-100 border border-transparent"
                    )}
                  >
                    <sub.icon className="w-4 h-4" />
                    <div className="flex-1 text-left">
                      <span className="block font-medium">{sub.label}</span>
                      <span className="text-[11px] text-gray-400">{sub.desc}</span>
                    </div>
                  </button>
                ))}

                {/* 选中后显示设定 */}
                {activeSubScene && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <ScreenplaySettingsPanel subScene={activeSubScene} />
                  </div>
                )}
              </div>
            )}

            {/* 标签 */}
            {expandedSection === "tags" && <TagsPanel />}

            {/* 角色 */}
            {expandedSection === "characters" && <CharactersPanel />}

            {/* 内容大纲 */}
            {expandedSection === "outline" && (
              <ScreenplayOutlinePanel
                outlineContent={outlineContent}
                generating={generating}
                outlineStructure={outlineStructure}
                setOutlineStructure={setOutlineStructure}
                onGenerate={handleGenerateOutline}
              />
            )}

            {/* 场次信息 */}
            {expandedSection === "scenes" && (
              <div>
                <div className="flex items-center justify-end mb-2">
                  <button
                    onClick={() => {
                      const num = useEditorStore.getState().chapters.length + 1;
                      useEditorStore.getState().addChapter(`第${num}场 新场次`);
                      useEditorStore.getState().showToast("已添加新场次");
                    }}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded hover:bg-indigo-50 transition"
                  >
                    <Plus className="w-3 h-3" />
                    添加场次
                  </button>
                </div>
                <ChapterList sceneType="screenplay" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ScreenplayOutlinePanel({
  outlineContent,
  generating,
  outlineStructure,
  setOutlineStructure,
  onGenerate,
}: {
  outlineContent: string;
  generating: boolean;
  outlineStructure: string;
  setOutlineStructure: (v: string) => void;
  onGenerate: () => void;
}) {
  const { showToast } = useEditorStore();
  const [sceneNotes, setSceneNotes] = useState("");
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
    <div className="space-y-4">
      {/* 上传大纲文档 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">上传大纲文档</span>
        </div>
        <button
          onClick={() => showToast("上传功能演示中...")}
          className="w-full border border-dashed border-gray-200 rounded-lg py-3 text-xs text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition flex items-center justify-center gap-1.5 bg-white"
        >
          <Upload className="w-3.5 h-3.5" />
          点击上传或拖拽文件
        </button>
        <p className="text-[10px] text-gray-300 mt-1.5 leading-relaxed">可选，上传后 AI 将参考您的资料生成内容</p>
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
                "flex-1 px-2 py-1.5 text-xs rounded-lg border transition bg-white",
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

      {/* 场次脉络 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">场次脉络</span>
        </div>
        <textarea
          value={sceneNotes}
          onChange={(e) => setSceneNotes(e.target.value)}
          placeholder="每场核心事件、伏笔埋设..."
          className="w-full text-xs border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300 bg-white"
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
            { key: "opening" as const, label: "开场" },
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
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300 bg-white"
              />
            </div>
          ))}
        </div>
      </div>

      {/* AI 生成总纲 */}
      <div>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          生成总纲
        </button>
        {outlineContent && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
            <pre className="whitespace-pre-wrap text-xs text-gray-600 leading-relaxed font-sans">
              {outlineContent}
              {generating && <span className="ai-cursor" />}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
