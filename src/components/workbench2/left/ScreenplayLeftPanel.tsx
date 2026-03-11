"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useState } from "react";
import {
  Tag,
  Users,
  FileText,
  List,
  Plus,
  ChevronDown,
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

type AccordionSection = "subscene" | "tags" | "characters" | "outline" | "scenes" | null;

export default function ScreenplayLeftPanel() {
  const { showToast } = useEditorStore();
  const [expandedSection, setExpandedSection] = useState<AccordionSection>("subscene");
  const [activeSubScene, setActiveSubScene] = useState("");
  const [isSelectingType, setIsSelectingType] = useState(true);
  const [outlineContent, setOutlineContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const [outlineStructure, setOutlineStructure] = useState("three-act");

  const toggleSection = (section: AccordionSection) => {
    setExpandedSection((prev) => (prev === section ? null : section));
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
    id: AccordionSection;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "subscene", label: "剧本/分镜", icon: Film },
    { id: "tags", label: "标签", icon: Tag },
    { id: "characters", label: "角色", icon: Users },
    { id: "outline", label: "内容大纲", icon: FileText },
    { id: "scenes", label: "场次信息", icon: List },
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
              {section.id === "scenes" && expandedSection !== "scenes" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    const num = useEditorStore.getState().chapters.length + 1;
                    useEditorStore.getState().addChapter(`第${num}场 新场次`);
                    useEditorStore.getState().showToast("已添加新场次");
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
              {/* 剧本/分镜 子类型 */}
              {section.id === "subscene" && (
                <div className="px-2 pb-2">
                  {isSelectingType ? (
                    // 选择模式：显示所有类型
                    <div className="space-y-0.5">
                      {subScenes.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveSubScene(sub.id);
                            setIsSelectingType(false);
                          }}
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
                  ) : (
                    // 已选模式：只显示当前类型 + 设定
                    <div>
                      {(() => {
                        const current = subScenes.find((s) => s.id === activeSubScene);
                        return current ? (
                          <div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                              <current.icon className="w-4 h-4 text-blue-600" />
                              <div className="flex-1">
                                <span className="block text-sm font-medium text-blue-700">{current.label}</span>
                                <span className="text-[10px] text-gray-400">{current.desc}</span>
                              </div>
                              <button
                                onClick={() => setIsSelectingType(true)}
                                className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition"
                              >
                                更换
                              </button>
                            </div>
                            <div className="mt-2 ml-2 border-l-2 border-blue-100">
                              <ScreenplaySettingsPanel subScene={current.id} />
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* 标签 */}
              {section.id === "tags" && <TagsPanel />}

              {/* 角色 */}
              {section.id === "characters" && <CharactersPanel />}

              {/* 内容大纲 */}
              {section.id === "outline" && (
                <ScreenplayOutlinePanel
                  outlineContent={outlineContent}
                  generating={generating}
                  outlineStructure={outlineStructure}
                  setOutlineStructure={setOutlineStructure}
                  onGenerate={handleGenerateOutline}
                />
              )}

              {/* 场次信息 */}
              {section.id === "scenes" && (
                <div>
                  <div className="flex items-center justify-end px-4 py-1">
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
        ))}
      </div>
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
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300"
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
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
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
