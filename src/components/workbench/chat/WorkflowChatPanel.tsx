"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function WorkflowChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Mock AI reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "好的，我已收到你的需求。正在根据左侧设定为你生成内容，请稍候…",
        },
      ]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-300">有任何想法或调整，随时告诉我</p>
          </div>
        )}

        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] shadow-sm">
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">AI</span>
                </div>
                <span className="text-[10px] text-gray-400">文心</span>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed pl-7">{msg.content}</div>
            </div>
          )
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入需求或调整意见…"
              rows={1}
              className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 transition"
              style={{ minHeight: 40, maxHeight: 120 }}
            />
          </div>
          <button className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-gray-500 transition flex-shrink-0">
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
