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
  const [useAlt, setUseAlt] = useState(false); // toggle between primary/alt tip sets
  // Two-phase: "outline" = initial tip shown, "expanded" = expanded content generated, "done" = ready to apply
  const [phase, setPhase] = useState<"outline" | "expanding" | "done">("outline");
  const [expandedContent, setExpandedContent] = useState("");
  const { showToast, setPendingInsert } = useEditorStore();

  // Sync editableResult when generation completes
  useEffect(() => {
    if (!generating && result && phase === "outline") {
      setEditableResult(result);
    }
  }, [generating, result, phase]);

  const tipSets = {
    idea: [mockAIResponses.writingTipIdea, mockAIResponses.writingTipIdeaAlt],
    setting: [mockAIResponses.writingTipSetting, mockAIResponses.writingTipSettingAlt],
    detail: [mockAIResponses.writingTipDetail, mockAIResponses.writingTipDetailAlt],
  };

  const tips = tipSets[category][useAlt ? 1 : 0];

  const expandedMock: Record<string, string> = mockAIResponses.expandedPlot;

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
    setPhase("outline");
    setExpandedContent("");
    simulateAIStream(tip.content, (current, done) => {
      setResult(current);
      if (done) setGenerating(false);
    });
  };

  // Phase 2: "接着写" triggers expanded content generation
  const handleContinueWrite = () => {
    setPhase("expanding");
    setExpandedContent("");
    const expandText = expandedMock[category] || expandedMock.idea;
    simulateAIStream(expandText, (current, done) => {
      setExpandedContent(current);
      if (done) setPhase("done");
    });
  };

  // Phase 3: "应用到正文" inserts and shows diff
  const handleApplyToText = () => {
    setPendingInsert(expandedContent);
    setShowDiff(true);
    showToast("已追加到正文");
  };

  const handleShuffleTips = () => {
    setUseAlt(!useAlt);
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

        {/* Before - outline */}
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-500">梗概</span>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
              {editableResult}
            </p>
          </div>
        </div>

        {/* After - expanded */}
        <div className="rounded-lg border border-green-200 overflow-hidden">
          <div className="px-3 py-1.5 bg-green-50 border-b border-green-200">
            <span className="text-xs font-medium text-green-700">扩展正文</span>
          </div>
          <div className="p-3">
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
              {expandedContent}
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => {
              setShowDiff(false);
              showToast("已应用到正文");
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            <Check className="w-3.5 h-3.5" />
            确认
          </button>
          <button
            onClick={() => setShowDiff(false)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <X className="w-3.5 h-3.5" />
            关闭
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
              setPhase("outline");
              setExpandedContent("");
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
          {tips.map((tip, i) => (
            <button
              key={`${useAlt}-${i}`}
              onClick={() => handleTipClick(tip)}
              className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition"
            >
              <p className="text-xs font-medium text-gray-800">{tip.title}</p>
            </button>
          ))}
          <button
            onClick={handleShuffleTips}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400 hover:text-indigo-600 transition"
          >
            <RefreshCw className="w-3 h-3" /> 换一换
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Phase 1: Outline / tip suggestion */}
          <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 overflow-hidden">
            <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
              <p className="text-xs font-medium text-indigo-700">
                {selectedTip.title}
              </p>
              <span className="text-[10px] text-indigo-400 px-1.5 py-0.5 bg-indigo-100 rounded">梗概</span>
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

          {/* Phase 2: Expanded content area */}
          {(phase === "expanding" || phase === "done") && (
            <div className="rounded-lg bg-green-50/50 border border-green-100 overflow-hidden">
              <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
                <p className="text-xs font-medium text-green-700">扩展正文</p>
                {phase === "expanding" && (
                  <Loader2 className="w-3 h-3 text-green-500 animate-spin" />
                )}
                {phase === "done" && (
                  <span className="text-[10px] text-green-500 px-1.5 py-0.5 bg-green-100 rounded">已完成</span>
                )}
              </div>
              <div className="px-3 pb-3">
                <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {expandedContent}
                  {phase === "expanding" && <span className="ai-cursor" />}
                </p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!generating && (
            <div className="space-y-2">
              {/* Primary action - changes based on phase */}
              {phase === "outline" && (
                <button
                  onClick={handleContinueWrite}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                >
                  <PenLine className="w-3.5 h-3.5" />
                  接着写
                </button>
              )}
              {phase === "done" && (
                <button
                  onClick={handleApplyToText}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  应用到正文
                </button>
              )}

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
                    const text = phase === "done" ? expandedContent : editableResult;
                    navigator.clipboard.writeText(text);
                    showToast("已复制");
                  }}
                  className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> 复制
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
