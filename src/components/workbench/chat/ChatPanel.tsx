"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useEditorStore } from "@/stores/editorStore";
import {
  Send,
  Mic,
  Plus,
  FileUp,
  ImageIcon,
  AudioLines,
  Video,
  Star,
  Clock,
  RefreshCw,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────

const inspirationRounds = [
  {
    prompt: "你好！我来帮你构思一个精彩的故事。先看看这几个方向，哪个更打动你？",
    cards: [
      "现代都市，当红影后苏瑾在事业巅峰突然失忆，被迫隐居在南方小镇。没有聚光灯的日子里，她意外发现这里藏着她遗忘的童年和一段未完的缘分。",
      "架空古代，被退婚的废材郡主在绝境中觉醒前世记忆，发现自己曾是镇压妖族的大祭司。重活一世，她要用前世的知识改写命运、逆袭朝堂。",
      "近未来末世，一场全球性的信号中断让文明倒退五十年。前AI工程师带着最后一台能运行的终端，在废墟中寻找重建网络的可能，却发现断网背后是一个更大的阴谋。",
    ],
  },
  {
    prompt: "好方向！在这个基础上，你更偏好哪种风格走向？",
    cards: [
      "甜宠日常：她在小镇开了一家面馆，和隔壁沉默寡言的中医馆馆主从互相看不顺眼到每天给对方留饭，小镇居民看在眼里急在心里。温暖治愈的慢节奏故事。",
      "悬疑暗线：小镇看似平静，但她的记忆碎片指向一个惊人的真相——她的失忆并非意外，身边最亲近的人可能就是幕后推手。每一章都有反转的烧脑叙事。",
      "爽文逆袭：她用娱乐圈摸爬滚打练出的手段，把小镇文艺汇演搞成了全网爆款，从此一路开挂重返巅峰。但这次她选择按自己的规则来，不再为资本低头。",
    ],
  },
  {
    prompt: "快要成型了！最后确认一下故事的走向和结局：",
    cards: [
      "明线甜恋暗线揭秘，当她终于想起一切，要在复仇和眼前的幸福之间做选择。她选择放下执念，和他在小镇安定下来，用新的方式重新定义成功。温暖HE。",
      "层层反转，每个角色都有不可告人的秘密，真相像洋葱一样一层层剥开。最后她看清了所有人的面目，独自踏上新的旅程。开放式结局，余韵悠长。",
      "治愈成长线，从迷失到被小镇的人情味治愈，重新理解「成功」的意义。她带着全新的自己回归，在事业和生活之间找到了属于自己的平衡点。温暖HE。",
    ],
  },
];

// ─── Mock Settings Data (based on round selections) ─────────

// Each key in settingsMap corresponds to round1 card index
// In real app this would be AI-generated; here we pre-define for card 0
const mockSettings: Record<string, { label: string; value: string }[]> = {
  "写作要素": [
    { label: "受众", value: "女频" },
    { label: "题材", value: "言情 · 都市" },
    { label: "时空", value: "现代" },
    { label: "剧情元素", value: "失忆 · 重生 · 娱乐圈 · 治愈" },
    { label: "人物关系", value: "欢喜冤家 · 青梅竹马" },
    { label: "风格调性", value: "甜宠 · 治愈 · 慢热" },
    { label: "结局", value: "HE" },
  ],
  "写作方式": [
    { label: "叙事视角", value: "第三人称" },
    { label: "叙事结构", value: "线性叙事（穿插记忆闪回）" },
    { label: "文风", value: "文艺抒情" },
  ],
};

// ─── Types ───────────────────────────────────────────────────

type Message =
  | { id: string; sender: "model"; type: "inspiration"; prompt: string; cards: string[]; round: number }
  | { id: string; sender: "model"; type: "thinking" }
  | { id: string; sender: "model"; type: "text"; content: string }
  | { id: string; sender: "model"; type: "settings-card"; prompt: string; settings: Record<string, { label: string; value: string }[]> }
  | { id: string; sender: "user"; type: "card-selection"; content: string }
  | { id: string; sender: "user"; type: "text"; content: string };

// ─── Component ───────────────────────────────────────────────

export default function ChatPanel() {
  const setCreationStage = useEditorStore((s) => s.setCreationStage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selections, setSelections] = useState<Record<number, number>>({}); // round → selected card index
  const [currentRound, setCurrentRound] = useState(0); // 0=not started, 1-3=inspiration, 4=confirm stage
  const [input, setInput] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const attachRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Click outside attach menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Scene card entry: model sends first round automatically
  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;

    const thinkingId = `thinking-init`;
    setMessages([{ id: thinkingId, sender: "model", type: "thinking" }]);

    setTimeout(() => {
      const round = inspirationRounds[0];
      setMessages([
        {
          id: "model-r1",
          sender: "model",
          type: "inspiration",
          prompt: round.prompt,
          cards: round.cards,
          round: 1,
        },
      ]);
      setCurrentRound(1);
    }, 1200);
  }, []);

  // Handle card selection
  const handleCardSelect = useCallback(
    (round: number, cardIndex: number) => {
      if (selections[round] !== undefined) return; // already selected
      const cardText = inspirationRounds[round - 1].cards[cardIndex];

      // Record selection
      setSelections((prev) => ({ ...prev, [round]: cardIndex }));

      // Add user message
      setMessages((prev) => [
        ...prev,
        { id: `user-r${round}`, sender: "user", type: "card-selection", content: cardText },
      ]);

      if (round < 3) {
        // Show thinking, then next round
        const thinkingId = `thinking-r${round + 1}`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);

        setTimeout(() => {
          const nextRound = inspirationRounds[round];
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-r${round + 1}`,
              sender: "model",
              type: "inspiration",
              prompt: nextRound.prompt,
              cards: nextRound.cards,
              round: round + 1,
            },
          ]);
          setCurrentRound(round + 1);
        }, 1500);
      } else {
        // Round 3 done → generate settings card directly
        const thinkingId = `thinking-settings`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-settings",
              sender: "model",
              type: "settings-card",
              prompt: "根据你的灵感方向，我为你整理了以下创作设定。确认无误就可以开始生成世界观了，你也可以告诉我需要调整的地方。",
              settings: mockSettings,
            },
          ]);
          setCurrentRound(4);
          setCreationStage(1); // 设定完成，进入世界观阶段
        }, 2500);
      }
    },
    [selections, setCreationStage]
  );

  // Handle refresh
  const handleRefresh = useCallback(() => {
    // Mock: just show a toast-like effect, in real app would regenerate
    // For now we do nothing visible
  }, []);

  // Handle send
  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", type: "text", content: text },
    ]);

    // If at confirm stage, user confirmed settings → start world-building
    if (currentRound === 4) {
      const thinkingId = `thinking-wb`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-worldbuilding",
            sender: "model",
            type: "text",
            content: "好的，正在为你生成世界观设定…（世界观 — 待实现）",
          },
        ]);
        setCurrentRound(5);
        setCreationStage(2); // 世界观完成，进入角色阶段
      }, 2500);
    }
  }, [input, currentRound, setCreationStage]);

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5" ref={scrollRef}>
        {messages.map((msg) => {
          // ── Thinking indicator ──
          if (msg.type === "thinking") {
            return (
              <div key={msg.id} className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            );
          }

          // ── Model: inspiration cards ──
          if (msg.sender === "model" && msg.type === "inspiration") {
            const isActive = currentRound === msg.round && selections[msg.round] === undefined;
            return (
              <div key={msg.id} className="space-y-3">
                {/* Model header */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                {/* Cards */}
                <div className="pl-8 space-y-2">
                  {msg.cards.map((card, i) => {
                    const isSelected = selections[msg.round] === i;
                    const isOther = selections[msg.round] !== undefined && !isSelected;
                    return (
                      <button
                        key={i}
                        onClick={() => isActive && handleCardSelect(msg.round, i)}
                        disabled={!isActive}
                        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-indigo-400 bg-indigo-50/80 shadow-sm"
                            : isOther
                            ? "border-transparent bg-gray-50 opacity-40"
                            : "border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5 ${
                              isSelected
                                ? "bg-indigo-500 text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <p className={`text-sm leading-relaxed ${isSelected ? "text-gray-800" : "text-gray-600"}`}>
                            {card}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                  {/* Refresh button */}
                  {isActive && (
                    <button
                      onClick={() => handleRefresh()}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-400 hover:text-indigo-500 transition mt-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      换一换
                    </button>
                  )}
                </div>
              </div>
            );
          }

          // ── Model: text message ──
          if (msg.sender === "model" && msg.type === "text") {
            return (
              <div key={msg.id} className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.content}</p>
              </div>
            );
          }

          // ── User: card selection ──
          if (msg.sender === "user" && msg.type === "card-selection") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] shadow-sm">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          }

          // ── User: text message ──
          if (msg.sender === "user" && msg.type === "text") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] shadow-sm">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          }

          // ── Model: settings card ──
          if (msg.sender === "model" && msg.type === "settings-card") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                {/* Settings Card - truncated with fade */}
                <div className="pl-8">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                    <div className="max-h-[160px] overflow-hidden">
                      {Object.entries(msg.settings).map(([group, items], gi) => (
                        <div key={group}>
                          {gi > 0 && <div className="border-t border-gray-100" />}
                          <div className="px-4 py-3">
                            <h4 className="text-xs font-semibold text-gray-500 mb-2.5">{group}</h4>
                            <div className="space-y-2">
                              {items.map((item) => (
                                <div key={item.label} className="flex items-start gap-2">
                                  <span className="text-xs text-gray-400 w-16 shrink-0 pt-0.5">{item.label}</span>
                                  <div className="flex flex-wrap gap-1">
                                    {item.value.split(" · ").map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Gradient fade overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    {/* View full in editor hint */}
                    <div className="relative px-4 py-2.5 text-center border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">查看完整设定请点击编辑区</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入你的想法..."
            className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent min-h-[40px]"
            rows={1}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="relative" ref={attachRef}>
              <button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
              {showAttachMenu && (
                <div className="absolute left-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-28 z-20">
                  {[
                    { icon: FileUp, label: "文档", color: "text-blue-500" },
                    { icon: ImageIcon, label: "图片", color: "text-green-500" },
                    { icon: AudioLines, label: "音频", color: "text-purple-500" },
                    { icon: Video, label: "视频", color: "text-red-500" },
                  ].map((item) => (
                    <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-gray-100 my-1" />
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                    <span className="w-4 h-4 text-blue-500 text-sm leading-4">☁️</span>
                    网盘
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                    <Star className="w-4 h-4 text-gray-500" />
                    收藏
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                    <Clock className="w-4 h-4 text-gray-500" />
                    最近
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 transition">
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                className="p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
              >
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
