"use client";

import { useEditorStore } from "@/stores/editorStore";
import { getSceneMockResponses } from "@/data/mockAIResponses";
import { simulateAIStream } from "@/lib/aiSimulator";
import {
  Lightbulb,
  Palette,
  Loader2,
  ArrowLeft,
  RefreshCw,
  PenLine,
  Copy,
  Check,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
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
  const { scene } = useEditorStore();
  const isMarketing = scene === "marketing";

  return (
    <div className="px-4 pb-4 space-y-2">
      <button
        onClick={() => onNavigate("tips")}
        className="w-full rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 hover:border-amber-200 p-4 text-left transition hover:shadow-sm group"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span className="text-base font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
            创作灵感
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-7">
          {isMarketing ? "不知道怎么写？看看这些思路" : "写作没方向？让 AI 给你灵感"}
        </p>
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
  const { scene, showToast, setPendingInsert } = useEditorStore();
  const mockData = getSceneMockResponses(scene);

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [editableResult, setEditableResult] = useState("");
  const [selectedTip, setSelectedTip] = useState<{ title: string; content: string } | null>(null);
  const [useAlt, setUseAlt] = useState(false);
  const [phase, setPhase] = useState<"outline" | "expanding" | "editing" | "confirmed" | "applied">("outline");
  const [expandedContent, setExpandedContent] = useState("");

  useEffect(() => {
    if (!generating && result && phase === "outline") {
      setEditableResult(result);
    }
  }, [generating, result, phase]);

  // 种草文案/知识专栏：直接展示3条灵感，不分类
  const tips = useAlt ? mockData.writingTipIdeaAlt : mockData.writingTipIdea;

  const expandedMock: Record<string, string> = mockData.expandedPlot;

  const handleTipClick = (tip: { title: string; content: string }) => {
    setSelectedTip(tip);
    setGenerating(true);
    setResult("");
    setEditableResult("");
    setPhase("outline");
    setExpandedContent("");
    simulateAIStream(tip.content, (current, done) => {
      setResult(current);
      if (done) setGenerating(false);
    });
  };

  const handleContinueWrite = () => {
    setPhase("expanding");
    setExpandedContent("");
    const expandText = expandedMock.idea || "";
    simulateAIStream(expandText, (current, done) => {
      setExpandedContent(current);
      if (done) setPhase("editing");
    });
  };

  const handleConfirmExpanded = () => {
    setPhase("confirmed");
  };

  const handleApplyToText = () => {
    setPendingInsert(expandedContent);
    setPhase("applied");
    showToast("已追加到正文");
  };

  const handleShuffleTips = () => {
    setUseAlt(!useAlt);
  };

  return (
    <div className="px-4 pb-4 space-y-3">
      <button
        onClick={() => {
          if (selectedTip) {
            setSelectedTip(null);
            setResult("");
            setEditableResult("");
            setPhase("outline");
            setExpandedContent("");
          } else {
            onBack();
          }
        }}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
      >
        <ArrowLeft className="w-3 h-3" /> {selectedTip ? "返回列表" : "返回"}
      </button>

      {/* 直接展示3条灵感，无分类tab */}
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
          <div className="rounded-lg bg-indigo-50/50 border border-indigo-100 overflow-hidden">
            <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
              <p className="text-xs font-medium text-indigo-700">{selectedTip.title}</p>
              <span className="text-[10px] text-indigo-400 px-1.5 py-0.5 bg-indigo-100 rounded">梗概</span>
            </div>
            {generating ? (
              <div className="px-3 pb-3">
                <p className="text-xs text-gray-600 leading-relaxed">
                  {result}<span className="ai-cursor" />
                </p>
              </div>
            ) : (
              <div className="px-3 pb-3">
                <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
                  {editableResult}
                </p>
              </div>
            )}
          </div>

          {(phase === "expanding" || phase === "editing" || phase === "confirmed" || phase === "applied") && (
            <div className="rounded-lg bg-green-50/50 border border-green-100 overflow-hidden">
              <div className="px-3 pt-2.5 pb-1 flex items-center justify-between">
                <p className="text-xs font-medium text-green-700">扩展正文</p>
                {phase === "expanding" && (
                  <Loader2 className="w-3 h-3 text-green-500 animate-spin" />
                )}
                {phase === "editing" && (
                  <span className="text-[10px] text-indigo-500 px-1.5 py-0.5 bg-indigo-100 rounded">可编辑</span>
                )}
                {(phase === "confirmed" || phase === "applied") && (
                  <span className="text-[10px] text-green-500 px-1.5 py-0.5 bg-green-100 rounded">
                    {phase === "applied" ? "已应用" : "已完成"}
                  </span>
                )}
              </div>
              {phase === "expanding" ? (
                <div className="px-3 pb-3">
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {expandedContent}
                    <span className="ai-cursor" />
                  </p>
                </div>
              ) : phase === "editing" ? (
                <textarea
                  value={expandedContent}
                  onChange={(e) => setExpandedContent(e.target.value)}
                  className="w-full text-xs text-gray-600 leading-relaxed bg-transparent px-3 pb-3 resize-none focus:outline-none"
                  rows={8}
                />
              ) : (
                <div className="px-3 pb-3">
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {expandedContent}
                  </p>
                </div>
              )}
            </div>
          )}

          {!generating && phase !== "applied" && (
            <div className="space-y-2">
              {phase === "outline" && (
                <button
                  onClick={handleContinueWrite}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                >
                  <PenLine className="w-3.5 h-3.5" /> 接着写
                </button>
              )}
              {phase === "editing" && (
                <div className="flex gap-2">
                  <button
                    onClick={handleConfirmExpanded}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    确认
                  </button>
                  <button
                    onClick={() => { setPhase("outline"); setExpandedContent(""); }}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    关闭
                  </button>
                </div>
              )}
              {phase === "confirmed" && (
                <button
                  onClick={handleApplyToText}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  <Check className="w-3.5 h-3.5" /> 应用到正文
                </button>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleTipClick(selectedTip)}
                  className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> 换一换
                </button>
                <button
                  onClick={() => {
                    const text = (phase === "editing" || phase === "confirmed") ? expandedContent : editableResult;
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

function StyleDiagnosisView({ onBack }: { onBack: () => void }) {
  const { scene } = useEditorStore();
  const mockData = getSceneMockResponses(scene);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useState(() => {
    setTimeout(() => setLoading(false), 1500);
  });

  const diagnosis = mockData.rhythmDiagnosis;

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
            {diagnosis.summary}
          </p>
          <div className="space-y-3">
            {diagnosis.issues.map((issue, i) => (
              <div key={i} className="p-3 rounded-lg border border-gray-100 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">
                    {issue.location}
                  </span>
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded",
                      issue.type.includes("佳") || issue.type.includes("良好")
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
          </div>
        </>
      )}
    </div>
  );
}
