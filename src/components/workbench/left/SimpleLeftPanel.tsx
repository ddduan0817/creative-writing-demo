"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useState } from "react";
import {
  Settings,
  Tag,
  ChevronDown,
  FileText,
  MonitorSmartphone,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SimpleSettingsPanel from "./SimpleSettingsPanel";
import SimpleTagsPanel from "./SimpleTagsPanel";

// 种草文案 - 发布平台选项
const marketingPlatforms = [
  { id: "xiaohongshu", label: "小红书", desc: "图文种草笔记" },
  { id: "douyin", label: "抖音", desc: "短视频脚本" },
  { id: "weibo", label: "微博", desc: "话题营销文案" },
  { id: "wechat", label: "公众号", desc: "深度种草长文" },
  { id: "bilibili", label: "B站", desc: "视频图文混排" },
  { id: "kuaishou", label: "快手", desc: "接地气安利" },
];

// 知识专栏 - 内容类型选项
const knowledgeTypes = [
  { id: "book_review", label: "拆书稿", desc: "书籍精华拆解" },
  { id: "video_script", label: "视频解说", desc: "知识类视频脚本" },
  { id: "opinion", label: "观点输出", desc: "深度观点文章" },
  { id: "course", label: "课程大纲", desc: "系统化课程设计" },
  { id: "analysis", label: "深度分析", desc: "专题研究报告" },
];

type AccordionSection = "type" | "settings" | "tags" | null;

export default function SimpleLeftPanel() {
  const { scene } = useEditorStore();
  const [expandedSection, setExpandedSection] = useState<AccordionSection>("type");
  const [activeType, setActiveType] = useState(
    scene === "marketing" ? "xiaohongshu" : "book_review"
  );

  const toggleSection = (section: AccordionSection) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const isMarketing = scene === "marketing";
  const typeOptions = isMarketing ? marketingPlatforms : knowledgeTypes;

  const sections: {
    id: AccordionSection;
    label: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "type",
      label: isMarketing ? "发布平台" : "内容类型",
      icon: isMarketing ? MonitorSmartphone : BookOpen,
    },
    { id: "settings", label: "设定", icon: Settings },
    { id: "tags", label: "标签", icon: Tag },
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
              {/* 发布平台 / 内容类型 选择 */}
              {section.id === "type" && (
                <div className="px-2 pb-2 space-y-0.5">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.id}
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
                  ))}
                </div>
              )}

              {section.id === "settings" && <SimpleSettingsPanel scene={scene} />}
              {section.id === "tags" && <SimpleTagsPanel scene={scene} />}
            </div>
          </div>
        ))}

        {/* 单篇模式提示 */}
        <div className="px-4 py-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-300" />
            <span className="text-xs font-medium text-gray-400">单篇模式</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {isMarketing
              ? "种草文案为单篇创作，无需章节管理。配置好设定和标签后即可开始写作。"
              : "知识专栏为单篇创作，无需章节管理。配置好设定和标签后即可开始写作。"}
          </p>
        </div>
      </div>
    </div>
  );
}
