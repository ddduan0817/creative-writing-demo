"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useState } from "react";
import {
  Tag,
  ChevronDown,
  FileText,
  MonitorSmartphone,
  BookOpen,
  Upload,
  LayoutTemplate,
  GitBranch,
  Milestone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SimpleSettingsPanel from "./SimpleSettingsPanel";
import SimpleTagsPanel from "./SimpleTagsPanel";

// 种草文案 - 内容形式选项
const marketingTypes = [
  { id: "graphic_seed", label: "图文种草", desc: "高转化商品文案" },
  { id: "live_script", label: "直播脚本", desc: "节奏与话术设计" },
  { id: "voice_script", label: "口播文案", desc: "短视频独白撰写" },
  { id: "video_script", label: "短视频脚本", desc: "综合拍摄台本" },
];

// 知识专栏 - 内容类型选项
const knowledgeTypes = [
  { id: "book_review", label: "拆书稿", desc: "书籍精华拆解" },
  { id: "video_explain", label: "视频解说", desc: "配音词撰写" },
  { id: "opinion", label: "观点输出", desc: "认知类短文创作" },
  { id: "course_outline", label: "课程大纲", desc: "知识付费产品规划" },
];

type AccordionSection = "type" | "tags" | "outline" | null;

export default function SimpleLeftPanel() {
  const { scene } = useEditorStore();
  const [expandedSection, setExpandedSection] = useState<AccordionSection>("type");
  const [activeType, setActiveType] = useState(
    scene === "marketing" ? "graphic_seed" : "book_review"
  );

  const toggleSection = (section: AccordionSection) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const isMarketing = scene === "marketing";
  const typeOptions = isMarketing ? marketingTypes : knowledgeTypes;

  const sections: {
    id: AccordionSection;
    label: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "type",
      label: isMarketing ? "内容形式" : "内容类型",
      icon: isMarketing ? MonitorSmartphone : BookOpen,
    },
    { id: "tags", label: "标签", icon: Tag },
    { id: "outline" as AccordionSection, label: "内容大纲", icon: FileText },
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
              {/* 内容形式 / 内容类型 选择 + 内联设定 */}
              {section.id === "type" && (
                <div className="px-2 pb-2 space-y-0.5">
                  {typeOptions.map((opt) => (
                    <div key={opt.id}>
                      <button
                        onClick={() => setActiveType(opt.id)}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition",
                          activeType === opt.id
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex-1 text-left">
                          <span className="block">{opt.label}</span>
                          <span className="text-[10px] text-gray-400 font-normal">{opt.desc}</span>
                        </div>
                      </button>
                      {activeType === opt.id && (
                        <div className="ml-2 border-l-2 border-blue-100">
                          <SimpleSettingsPanel scene={scene} activeType={opt.id} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.id === "tags" && <SimpleTagsPanel scene={scene} />}
              {section.id === "outline" && <SimpleOutlinePanel isMarketing={isMarketing} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleOutlinePanel({ isMarketing }: { isMarketing: boolean }) {
  const { showToast } = useEditorStore();
  const [outlineStructure, setOutlineStructure] = useState(
    isMarketing ? "aida" : "general"
  );
  const [contentNotes, setContentNotes] = useState("");
  const [keyNodes, setKeyNodes] = useState({
    node1: "",
    node2: "",
    node3: "",
    node4: "",
  });

  const structures = isMarketing
    ? [
        { id: "aida", label: "AIDA模型" },
        { id: "fabe", label: "FABE法则" },
        { id: "pain-solution", label: "痛点-方案-效果" },
      ]
    : [
        { id: "general", label: "总分总" },
        { id: "progressive", label: "递进式" },
        { id: "parallel", label: "并列式" },
      ];

  const nodeLabels = isMarketing
    ? [
        { key: "node1" as const, label: "开头钩子" },
        { key: "node2" as const, label: "核心卖点" },
        { key: "node3" as const, label: "信任背书" },
        { key: "node4" as const, label: "行动号召" },
      ]
    : [
        { key: "node1" as const, label: "核心论点" },
        { key: "node2" as const, label: "关键论据" },
        { key: "node3" as const, label: "案例/数据" },
        { key: "node4" as const, label: "结论升华" },
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

      {/* 内容脉络 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">内容脉络</span>
        </div>
        <textarea
          value={contentNotes}
          onChange={(e) => setContentNotes(e.target.value)}
          placeholder={
            isMarketing
              ? "开头钩子 → 产品引入 → 卖点展开 → 口碑证明 → 行动号召..."
              : "引言 → 核心论点 → 论据展开 → 总结升华..."
          }
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
          {nodeLabels.map((node) => (
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
