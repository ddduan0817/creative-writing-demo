"use client";

import { useEditorStore } from "@/stores/editorStore";
import { mockAIResponses } from "@/data/mockAIResponses";
import { simulateAIStream } from "@/lib/aiSimulator";
import {
  Lightbulb,
  Palette,
  Loader2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type View = "main" | "tips" | "style";

export default function SimpleInspirationCards() {
  const [view, setView] = useState<View>("main");

  if (view === "main") return <MainView onNavigate={setView} />;
  if (view === "tips") return <WritingTipsView onBack={() => setView("main")} />;
  if (view === "style") return <StyleDiagnosisView onBack={() => setView("main")} />;
  return null;
}

function MainView({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="px-4 pb-4 space-y-2">
      <button
        onClick={() => onNavigate("tips")}
        className="w-full rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 hover:border-amber-200 p-4 text-left transition hover:shadow-sm group"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span className="text-base font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            卡文锦囊
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-7">思路卡了？让 AI 帮你找到方向</p>
      </button>
      <button
        onClick={() => onNavigate("style")}
        className="w-full rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 hover:border-pink-200 p-4 text-left transition hover:shadow-sm group"
      >
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-500" />
          <span className="text-base font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            风格诊断
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-7">分析内容风格，提升文案质感</p>
      </button>
    </div>
  );
}

function WritingTipsView({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState<"idea" | "setting" | "detail">("idea");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [selectedTip, setSelectedTip] = useState<{ title: string; content: string } | null>(null);
  const { showToast } = useEditorStore();

  const tips = {
    idea: mockAIResponses.writingTipIdea,
    setting: mockAIResponses.writingTipSetting,
    detail: mockAIResponses.writingTipDetail,
  };

  const categories = [
    { id: "idea" as const, label: "思路卡了", emoji: "🧠" },
    { id: "setting" as const, label: "设定卡了", emoji: "🏗️" },
    { id: "detail" as const, label: "细节卡了", emoji: "🔍" },
  ];

  const handleTipClick = (tip: { title: string; content: string }) => {
    setSelectedTip(tip);
    setGenerating(true);
    setResult("");
    simulateAIStream(tip.content, (current, done) => {
      setResult(current);
      if (done) setGenerating(false);
    });
  };

  return (
    <div className="px-4 pb-4 space-y-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
      >
        <ArrowLeft className="w-3 h-3" /> 返回
      </button>

      <div className="flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setCategory(cat.id);
              setSelectedTip(null);
              setResult("");
            }}
            className={cn(
              "flex-1 py-2 text-xs rounded-lg border transition text-center",
              category === cat.id
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "border-gray-100 text-gray-500 hover:bg-gray-50"
            )}
          >
            <span className="block text-base mb-0.5">{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {!selectedTip ? (
        <div className="space-y-2">
          {tips[category].map((tip, i) => (
            <button
              key={i}
              onClick={() => handleTipClick(tip)}
              className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition"
            >
              <p className="text-xs font-medium text-gray-800">{tip.title}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100">
            <p className="text-xs font-medium text-indigo-700 mb-1">
              {selectedTip.title}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {result}
              {generating && <span className="ai-cursor" />}
            </p>
          </div>
          {!generating && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  showToast("已复制");
                }}
                className="text-xs text-gray-500 hover:text-indigo-600"
              >
                复制
              </button>
              <button
                onClick={() => handleTipClick(selectedTip)}
                className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> 换一换
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StyleDiagnosisView({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useState(() => {
    setTimeout(() => setLoading(false), 1500);
  });

  const mockDiagnosis = {
    summary: "整体文风偏理性叙述，种草感不足。建议增加场景代入和感官描写，让读者产生共鸣。",
    items: [
      {
        label: "种草感",
        score: 65,
        color: "bg-amber-500",
        suggestion: "增加使用场景描述，让读者代入真实体验。",
      },
      {
        label: "转化力",
        score: 50,
        color: "bg-red-400",
        suggestion: "结尾缺少明确的行动引导，建议加入限时优惠或口令。",
      },
      {
        label: "可读性",
        score: 85,
        color: "bg-green-500",
        suggestion: "句式简洁，节奏良好，继续保持。",
      },
      {
        label: "独特性",
        score: 70,
        color: "bg-blue-500",
        suggestion: "可加入个人真实体验或独家对比，增强辨识度。",
      },
    ],
  };

  return (
    <div className="px-4 pb-4 space-y-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
      >
        <ArrowLeft className="w-3 h-3" /> 返回
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Palette className="w-4 h-4 text-pink-500" />
        <span className="text-sm font-semibold text-gray-700">风格诊断</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-6 justify-center text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">诊断中...</span>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            {mockDiagnosis.summary}
          </p>
          <div className="space-y-3">
            {mockDiagnosis.items.map((item) => (
              <div key={item.label} className="p-3 rounded-lg border border-gray-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.score}/100</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{item.suggestion}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
