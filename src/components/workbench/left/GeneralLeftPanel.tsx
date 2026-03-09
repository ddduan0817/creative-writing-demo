"use client";

import { useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import {
  templateCategories,
  templateCards,
  recentTemplateIds,
  getSubTemplates,
  getTemplateConfig,
  type TemplateField,
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
  ChevronLeft,
  Sparkles,
  Loader2,
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

type ViewLevel = "category" | "subTemplate" | "form";

export default function GeneralLeftPanel() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewLevel, setViewLevel] = useState<ViewLevel>("category");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedSubTemplateId, setSelectedSubTemplateId] = useState<string | null>(null);
  const { showToast, selectedTemplateId, setSelectedTemplate } = useEditorStore();

  const activeCategoryObj = templateCategories.find((c) => c.id === activeCategory);
  const selectedCard = templateCards.find((c) => c.id === selectedCardId);
  const subTemplates = selectedCardId ? getSubTemplates(selectedCardId) : [];
  const templateConfig = selectedSubTemplateId ? getTemplateConfig(selectedSubTemplateId) : null;
  const selectedSubTemplate = subTemplates.find((s) => s.id === selectedSubTemplateId);

  const filteredCards =
    activeCategory === "all"
      ? templateCards
      : activeCategory === "recent"
      ? templateCards.filter((c) => recentTemplateIds.includes(c.id))
      : templateCards.filter((c) => c.categoryId === activeCategory);

  // 选择二级模板后进入三级
  const handleSelectCard = (cardId: string) => {
    const subs = getSubTemplates(cardId);
    setSelectedCardId(cardId);
    setSelectedTemplate(cardId);

    if (subs.length === 0) {
      // 没有三级模板，直接显示通用表单
      showToast(`已选择模板：${templateCards.find(c => c.id === cardId)?.title}`);
    } else if (subs.length === 1) {
      // 只有一个三级模板，直接进入四级
      setSelectedSubTemplateId(subs[0].id);
      setViewLevel("form");
    } else {
      // 多个三级模板，显示三级选择
      setViewLevel("subTemplate");
    }
  };

  // 选择三级模板后进入四级
  const handleSelectSubTemplate = (subId: string) => {
    setSelectedSubTemplateId(subId);
    setViewLevel("form");
  };

  // 返回上一级
  const handleBack = () => {
    if (viewLevel === "form") {
      if (subTemplates.length > 1) {
        setViewLevel("subTemplate");
      } else {
        setViewLevel("category");
        setSelectedCardId(null);
        setSelectedSubTemplateId(null);
      }
    } else if (viewLevel === "subTemplate") {
      setViewLevel("category");
      setSelectedCardId(null);
      setSelectedSubTemplateId(null);
    }
  };

  // 渲染三级模板选择
  const renderSubTemplateView = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Header with back button */}
      <div className="px-3 py-3 border-b border-gray-50 flex items-center gap-2">
        <button
          onClick={handleBack}
          className="p-1 hover:bg-gray-100 rounded transition"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded ${selectedCard?.iconColor} flex items-center justify-center flex-shrink-0 text-sm`}
          >
            {selectedCard?.iconEmoji}
          </div>
          <span className="text-sm font-medium text-gray-800">
            {selectedCard?.title}
          </span>
        </div>
      </div>
      <div className="p-2 space-y-1.5">
        {subTemplates.map((sub) => (
          <button
            key={sub.id}
            onClick={() => handleSelectSubTemplate(sub.id)}
            className={cn(
              "w-full flex items-start gap-2.5 p-2.5 rounded-lg text-left transition group",
              selectedSubTemplateId === sub.id
                ? "bg-indigo-50 ring-1 ring-indigo-200"
                : "hover:bg-gray-50"
            )}
          >
            <div
              className={`w-8 h-8 rounded-lg ${selectedCard?.iconColor} opacity-80 flex items-center justify-center flex-shrink-0 text-base`}
            >
              {selectedCard?.iconEmoji}
            </div>
            <div className="flex-1 min-w-0 flex items-center">
              <span className="text-sm font-medium text-gray-800">
                {sub.title}
              </span>
            </div>
            <MoreHorizontal className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 flex-shrink-0 self-center" />
          </button>
        ))}
      </div>
    </div>
  );

  // 渲染四级表单
  const renderFormView = () => (
    <div className="flex-1 overflow-y-auto">
      {/* Header with back button */}
      <div className="px-3 py-3 border-b border-gray-50 flex items-center gap-2">
        <button
          onClick={handleBack}
          className="p-1 hover:bg-gray-100 rounded transition"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded ${selectedCard?.iconColor} flex items-center justify-center flex-shrink-0 text-sm`}
          >
            {selectedCard?.iconEmoji}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-800">
              {selectedCard?.title}
            </span>
            {selectedSubTemplate && (
              <>
                <span className="text-gray-300">/</span>
                <span className="text-sm text-gray-500">
                  {selectedSubTemplate.title}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="p-3">
        {templateConfig ? (
          <TemplateForm fields={templateConfig.fields} />
        ) : (
          <p className="text-xs text-gray-400">暂无配置</p>
        )}
      </div>
    </div>
  );

  // 渲染二级模板列表
  const renderCategoryView = () => (
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
            onClick={() => handleSelectCard(card.id)}
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
  );

  return (
    <div className="h-full flex overflow-hidden w-72">
      {/* Category tabs - vertical (只在 category 视图显示) */}
      {viewLevel === "category" && (
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
      )}

      {/* Content area */}
      {viewLevel === "category" && renderCategoryView()}
      {viewLevel === "subTemplate" && renderSubTemplateView()}
      {viewLevel === "form" && renderFormView()}
    </div>
  );
}

// 四级表单组件
function TemplateForm({ fields }: { fields: TemplateField[] }) {
  const { showToast } = useEditorStore();
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [generating, setGenerating] = useState(false);

  const updateField = (key: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTag = (key: string, tag: string) => {
    const current = (formData[key] as string[]) || [];
    if (current.includes(tag)) {
      updateField(key, current.filter((t) => t !== tag));
    } else {
      updateField(key, [...current, tag]);
    }
  };

  const handleGenerate = () => {
    // 检查必填字段
    const missingFields = fields
      .filter((f) => f.required && !formData[f.key])
      .map((f) => f.label);

    if (missingFields.length > 0) {
      showToast(`请填写必填项：${missingFields.join("、")}`);
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      showToast("内容生成完成！");
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
            {field.label}
            {field.required && <span className="text-red-400">*</span>}
          </label>

          {field.type === "input" && (
            <input
              type="text"
              value={(formData[field.key] as string) || ""}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300"
            />
          )}

          {field.type === "textarea" && (
            <textarea
              value={(formData[field.key] as string) || ""}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={field.rows || 3}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300"
            />
          )}

          {field.type === "select" && field.options && (
            <div className="flex flex-wrap gap-2">
              {field.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateField(field.key, formData[field.key] === opt ? "" : opt)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-lg border transition",
                    formData[field.key] === opt
                      ? "border-indigo-300 bg-indigo-50 text-indigo-700 font-medium"
                      : "border-gray-200 text-gray-500 hover:border-indigo-200 hover:bg-gray-50"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {field.type === "tags" && field.options && (
            <div className="flex flex-wrap gap-1.5">
              {field.options.map((opt) => {
                const selected = ((formData[field.key] as string[]) || []).includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleTag(field.key, opt)}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-full border transition",
                      selected
                        ? "border-indigo-300 bg-indigo-100 text-indigo-700"
                        : "border-gray-200 text-gray-500 hover:border-indigo-200"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            生成中...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            生成内容
          </>
        )}
      </button>
    </div>
  );
}
