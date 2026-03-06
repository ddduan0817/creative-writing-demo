"use client";

import { useEditorStore } from "@/stores/editorStore";
import { mockAIResponses } from "@/data/mockAIResponses";
import { simulateAIStream } from "@/lib/aiSimulator";
import { Send, Paperclip, Loader2, Pin, History, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AIChat() {
  const { chatMessages, addChatMessage } = useEditorStore();
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, streamingText]);

  const handleSend = () => {
    if (!input.trim() || generating) return;

    const userMsg = input.trim();
    addChatMessage({ role: "user", content: userMsg });
    setInput("");
    setGenerating(true);
    setStreamingText("");

    // Pick a relevant mock response
    const responseIdx = chatMessages.filter((m) => m.role === "assistant").length;
    const response =
      mockAIResponses.chatResponses[
        responseIdx % mockAIResponses.chatResponses.length
      ];

    simulateAIStream(response, (current, done) => {
      setStreamingText(current);
      if (done) {
        addChatMessage({ role: "assistant", content: response });
        setStreamingText("");
        setGenerating(false);
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">AI 对话</span>
        <div className="flex items-center gap-1">
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition" title="置顶">
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition" title="历史记录">
            <History className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition" title="新对话">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {chatMessages.length === 0 && !generating && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3">
              <span className="text-white text-sm font-bold">言</span>
            </div>
            <p className="text-sm text-gray-700 font-medium mb-1">嗨！我是你的创意写作助手一言</p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
              我可以帮你构思情节、打磨文笔、解答创作疑问，随时向我提问吧！
            </p>
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              <p className="text-xs leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {generating && streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg px-3 py-2 bg-gray-50 text-gray-700">
              <p className="text-xs leading-relaxed whitespace-pre-wrap">
                {streamingText}
                <span className="ai-cursor" />
              </p>
            </div>
          </div>
        )}

        {generating && !streamingText && (
          <div className="flex justify-start">
            <div className="rounded-lg px-3 py-2 bg-gray-50">
              <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-end gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <button className="p-1 text-gray-400 hover:text-gray-600 self-end mb-0.5">
            <Paperclip className="w-4 h-4" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入你的问题..."
            rows={1}
            className="flex-1 bg-transparent text-sm resize-none outline-none max-h-20 placeholder:text-gray-300"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || generating}
            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-30 self-end"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-gray-300 mt-1.5">内容由AI生成，仅供参考</p>
      </div>
    </div>
  );
}
