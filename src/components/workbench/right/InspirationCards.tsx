"use client";

import { useEditorStore } from "@/stores/editorStore";
import { mockAIResponses } from "@/data/mockAIResponses";
import { simulateAIStream } from "@/lib/aiSimulator";
import {
  Lightbulb,
  Activity,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  PenLine,
  Copy,
  FileText,
  Check,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type View = "main" | "tips" | "rhythm" | "consistency";

export default function InspirationCards() {
  const [view, setView] = useState<View>("main");

  if (view === "main") return <MainView onNavigate={setView} />;
  if (view === "tips") return <WritingTipsView onBack={() => setView("main")} />;
  if (view === "rhythm") return <RhythmView onBack={() => setView("main")} />;
  if (view === "consistency") return <ConsistencyView onBack={() => setView("main")} />;
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
        onClick={() => onNavigate("rhythm")}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 hover:border-emerald-200 p-4 text-left transition hover:shadow-sm group"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          <span className="text-base font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            节奏诊断
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-7">分析叙事节奏，让故事更有张力</p>
      </button>
      <button
        onClick={() => onNavigate("consistency")}
        className="w-full rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 p-4 text-left transition hover:shadow-sm group"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-500" />
          <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            一致性校对
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-7">检查角色、设定是否前后一致</p>
      </button>
    </div>
  );
}

function WritingTipsView({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState<"idea" | "setting" | "detail">("idea");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [editableResult, setEditableResult] = useState("");
  const [selectedTip, setSelectedTip] = useState<{ title: string; content: string } | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const { showToast, setPendingInsert } = useEditorStore();

  // Sync editableResult when generation completes
  useEffect(() => {
    if (!generating && result) {
      setEditableResult(result);
    }
  }, [generating, result]);

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
    setEditableResult("");
    setShowDiff(false);
    simulateAIStream(tip.content, (current, done) => {
      setResult(current);
      if (done) setGenerating(false);
    });
  };

  const handleInsert = () => {
    setPendingInsert(editableResult);
    showToast("已追加到正文");
  };

  const handleApplyDiff = () => {
    // In real app, this would replace specific parts. For demo, use pendingInsert.
    setPendingInsert(mockAIResponses.diffAfter);
    setShowDiff(false);
    showToast("已应用修改");
  };

  // Diff comparison view
  if (showDiff) {
    return (
      <div className="px-4 pb-4 space-y-3">
        <button
          onClick={() => setShowDiff(false)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="w-3 h-3" /> 返回建议
        </button>

        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700">修改对比</span>
        </div>

        {/* Before */}
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-500">修改前</span>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
              {mockAIResponses.diffBefore}
            </p>
          </div>
        </div>

        {/* After */}
        <div className="rounded-lg border border-green-200 overflow-hidden">
          <div className="px-3 py-1.5 bg-green-50 border-b border-green-200">
            <span className="text-xs font-medium text-green-700">修改后</span>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
              {mockAIResponses.diffAfter.split("——").map((segment, i, arr) =>
                i < arr.length - 1 ? (
                  <span key={i}>
                    {segment}
                    <span className="bg-green-100 text-green-800">——</span>
                  </span>
                ) : (
                  <span key={i}>{segment}</span>
                )
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleApplyDiff}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            <Check className="w-3.5 h-3.5" />
            确认应用
          </button>
          <button
            onClick={() => setShowDiff(false)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <X className="w-3.5 h-3.5" />
            取消
          </button>
        </div>
      </div>
    );
  }

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
              setEditableResult("");
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
          <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 overflow-hidden">
            <div className="px-3 pt-2.5 pb-1">
              <p className="text-xs font-medium text-indigo-700">
                {selectedTip.title}
              </p>
            </div>
            {generating ? (
              <div className="px-3 pb-3">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {result}
                  <span className="ai-cursor" />
                </p>
              </div>
            ) : (
              <textarea
                value={editableResult}
                onChange={(e) => setEditableResult(e.target.value)}
                className="w-full text-xs text-gray-600 leading-relaxed bg-transparent px-3 pb-3 resize-none focus:outline-none"
                rows={5}
              />
            )}
          </div>

          {!generating && (
            <div className="space-y-2">
              {/* Primary action */}
              <button
                onClick={handleInsert}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
              >
                <PenLine className="w-3.5 h-3.5" />
                接着写
              </button>

              {/* Secondary actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTipClick(selectedTip)}
                  className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> 换一换
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(editableResult);
                    showToast("已复制");
                  }}
                  className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> 复制
                </button>
                <button
                  onClick={() => setShowDiff(true)}
                  className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" /> 应用到全文
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RhythmView({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(true);
  const data = mockAIResponses.rhythmDiagnosis;

  // Simulate loading
  useState(() => {
    setTimeout(() => setLoading(false), 1500);
  });

  return (
    <div className="px-4 pb-4 space-y-3">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
      >
        <ArrowLeft className="w-3 h-3" /> 返回
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Activity className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-semibold text-gray-700">节奏诊断</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-6 justify-center text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">诊断中...</span>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            {data.summary}
          </p>
          {data.issues.map((issue, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-gray-100 space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-400">
                  {issue.location}
                </span>
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded",
                    issue.type === "高潮节奏佳"
                      ? "bg-green-50 text-green-600"
                      : "bg-amber-50 text-amber-600"
                  )}
                >
                  {issue.type}
                </span>
              </div>
              <p className="text-xs text-gray-600">{issue.description}</p>
              <p className="text-xs text-indigo-600">💡 {issue.suggestion}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function ConsistencyView({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(true);
  const data = mockAIResponses.consistencyCheck;

  useState(() => {
    setTimeout(() => setLoading(false), 2000);
  });

  const severityConfig = {
    warning: {
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50" },
    pass: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
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
        <ShieldCheck className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-semibold text-gray-700">一致性校对</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-6 justify-center text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs">校对中...</span>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            {data.summary}
          </p>
          {data.issues.map((issue, i) => {
            const config =
              severityConfig[issue.severity as keyof typeof severityConfig];
            const Icon = config.icon;
            return (
              <div
                key={i}
                className="p-3 rounded-lg border border-gray-100 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-3.5 h-3.5", config.color)} />
                  <span className="text-xs font-medium text-gray-700">
                    {issue.type}
                  </span>
                  <span className="text-xs text-gray-400">
                    {issue.location}
                  </span>
                </div>
                <p className="text-xs text-gray-600 pl-5">
                  {issue.description}
                </p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
