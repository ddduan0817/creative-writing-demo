"use client";

import { useEditorStore } from "@/stores/editorStore";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { simulateAIStream } from "@/lib/aiSimulator";
import { mockOutline } from "@/data/mockChapters";

export default function OutlinePanel() {
  const { outline, setOutline, showToast, setLeftView } = useEditorStore();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setOutline("");
    simulateAIStream(mockOutline, (current, done) => {
      setOutline(current);
      if (done) {
        setGenerating(false);
        showToast("总纲生成完成");
      }
    }, 20);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-50">
        <span className="text-sm font-semibold text-gray-700">内容大纲</span>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          生成总纲
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {outline ? (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-xs text-gray-600 leading-relaxed font-sans">
              {outline}
              {generating && <span className="ai-cursor" />}
            </pre>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-300">
            <p className="text-sm">点击「生成总纲」开始</p>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-gray-50">
        <button
          onClick={() => setLeftView("editor")}
          className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
        >
          返回编辑器
        </button>
      </div>
    </div>
  );
}
