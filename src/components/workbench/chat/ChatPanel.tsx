"use client";

import { useState } from "react";
import {
  ChevronDown,
  Send,
  Mic,
  Plus,
} from "lucide-react";

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const [modelOpen, setModelOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* Model Selector */}
      <div className="px-4 py-3 border-b border-gray-100 bg-white">
        <button
          onClick={() => setModelOpen(!modelOpen)}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-800"
        >
          文心 4.5 Turbo
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Empty state */}
        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
          开始和 AI 对话，辅助你的创作
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="自动适配需求，复杂问题自动深析，有什么可以帮助你？"
            className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent min-h-[40px]"
            rows={1}
          />
          <div className="flex items-center justify-between mt-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition">
              <Plus className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 transition">
                <Mic className="w-4 h-4" />
              </button>
              <button className="p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          内容由AI生成，仅供参考，请仔细甄别
        </p>
      </div>
    </div>
  );
}
