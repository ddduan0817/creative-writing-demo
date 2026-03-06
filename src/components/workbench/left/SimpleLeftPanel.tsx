"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useState } from "react";
import {
  Settings,
  Tag,
  ChevronDown,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SimpleSettingsPanel from "./SimpleSettingsPanel";
import SimpleTagsPanel from "./SimpleTagsPanel";

type AccordionSection = "settings" | "tags" | null;

export default function SimpleLeftPanel() {
  const { scene } = useEditorStore();
  const [expandedSection, setExpandedSection] = useState<AccordionSection>("settings");

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
            {scene === "marketing"
              ? "种草文案为单篇创作，无需章节管理。配置好设定和标签后即可开始写作。"
              : "知识专栏为单篇创作，无需章节管理。配置好设定和标签后即可开始写作。"}
          </p>
        </div>
      </div>
    </div>
  );
}
