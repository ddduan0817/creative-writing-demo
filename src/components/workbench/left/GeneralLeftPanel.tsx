"use client";

import { useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import {
  templateCategories,
  templateCards,
  recentTemplateIds,
} from "@/data/mockGeneralTemplates";
import {
  LayoutGrid,
  Clock,
  Briefcase,
  GraduationCap,
  Share2,
  Coffee,
  Wand2,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Clock,
  Briefcase,
  GraduationCap,
  Share2,
  Coffee,
  Wand2,
};

export default function GeneralLeftPanel() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { showToast, selectedTemplateId, setSelectedTemplate } =
    useEditorStore();

  const activeCategoryObj = templateCategories.find(
    (c) => c.id === activeCategory
  );

  const filteredCards =
    activeCategory === "all"
      ? templateCards
      : activeCategory === "recent"
      ? templateCards.filter((c) => recentTemplateIds.includes(c.id))
      : templateCards.filter((c) => c.categoryId === activeCategory);

  return (
    <div className="h-full flex overflow-hidden w-72">
      {/* Category tabs - vertical */}
      <div className="w-14 flex-shrink-0 border-r border-gray-100 py-2 flex flex-col items-center gap-0.5 overflow-y-auto">
        {templateCategories.map((cat) => {
          const Icon = iconMap[cat.icon] || LayoutGrid;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "w-12 flex flex-col items-center gap-0.5 py-2 rounded-lg text-[10px] transition",
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Template cards area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-3 border-b border-gray-50">
          <p className="text-xs text-gray-400">
            当前选择{" "}
            <span className="text-gray-700 font-semibold">
              {activeCategoryObj?.label || "全部"}
            </span>
          </p>
        </div>
        <div className="p-2 space-y-1.5">
          {filteredCards.map((card) => (
            <button
              key={card.id}
              onClick={() => {
                setSelectedTemplate(card.id);
                showToast(`已选择模板：${card.title}`);
              }}
              className={cn(
                "w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition group",
                selectedTemplateId === card.id
                  ? "bg-indigo-50 ring-1 ring-indigo-200"
                  : "hover:bg-gray-50"
              )}
            >
              <div
                className={`w-8 h-8 rounded-lg ${card.iconColor} flex items-center justify-center flex-shrink-0 text-base`}
              >
                {card.iconEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {card.title}
                  </span>
                  <MoreHorizontal className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5 line-clamp-2">
                  {card.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
