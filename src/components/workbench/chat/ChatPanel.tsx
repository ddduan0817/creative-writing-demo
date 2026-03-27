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
  Heart,
} from "lucide-react";

// ─── Mock Data ───────────────────────────────────────────────

interface InspirationCard {
  text: string;
  keywords: string[];
}

interface InspirationRound {
  prompt: string;
  cards: InspirationCard[];
  adjustPrompt: string;
}

const inspirationRounds: InspirationRound[] = [
  {
    prompt: "你好！我来帮你构思一个精彩的故事。先看看这几个方向，哪个更打动你？",
    cards: [
      {
        text: "现代都市，当红影后在事业巅峰突然失忆，被迫隐居在南方小镇。没有聚光灯的日子里，她意外发现这里藏着她遗忘的童年和一段未完的缘分。",
        keywords: ["都市", "失忆", "娱乐圈", "小镇", "治愈"],
      },
      {
        text: "架空古代，被退婚的废材郡主在绝境中觉醒前世记忆，发现自己曾是镇压妖族的大祭司。重活一世，她要用前世的知识改写命运、逆袭朝堂。",
        keywords: ["古代", "重生", "逆袭", "宫斗", "玄幻"],
      },
      {
        text: "近未来末世，一场全球性的信号中断让文明倒退五十年。前AI工程师带着最后一台能运行的终端，在废墟中寻找重建网络的可能，却发现断网背后是一个更大的阴谋。",
        keywords: ["末世", "科幻", "悬疑", "生存", "阴谋"],
      },
    ],
    adjustPrompt: "选得好！有没有想微调的？比如「想要更虐一点」「加入美食元素」之类的，随便说说就行～",
  },
  {
    prompt: "好方向！在这个基础上，你更偏好哪种风格走向？",
    cards: [
      {
        text: "甜宠日常：她在小镇开了一家面馆，和隔壁沉默寡言的中医馆馆主从互相看不顺眼到每天给对方留饭，小镇居民看在眼里急在心里。温暖治愈的慢节奏故事。",
        keywords: ["甜宠", "美食", "慢热", "日常", "欢喜冤家"],
      },
      {
        text: "悬疑暗线：小镇看似平静，但她的记忆碎片指向一个惊人的真相——她的失忆并非意外，身边最亲近的人可能就是幕后推手。每一章都有反转的烧脑叙事。",
        keywords: ["悬疑", "烧脑", "反转", "暗黑", "真相"],
      },
      {
        text: "爽文逆袭：她用娱乐圈摸爬滚打练出的手段，把小镇文艺汇演搞成了全网爆款，从此一路开挂重返巅峰。但这次她选择按自己的规则来，不再为资本低头。",
        keywords: ["爽文", "逆袭", "打脸", "励志", "开挂"],
      },
    ],
    adjustPrompt: "如果想调整什么细节也可以说，比如「节奏再快一点」「想加入职场线」，或者直接跳过～",
  },
  {
    prompt: "快要成型了！最后确认一下故事的走向和结局：",
    cards: [
      {
        text: "明线甜恋暗线揭秘，当她终于想起一切，要在复仇和眼前的幸福之间做选择。她选择放下执念，和他在小镇安定下来，用新的方式重新定义成功。温暖HE。",
        keywords: ["HE", "双线叙事", "治愈", "放下"],
      },
      {
        text: "层层反转，每个角色都有不可告人的秘密，真相像洋葱一样一层层剥开。最后她看清了所有人的面目，独自踏上新的旅程。开放式结局，余韵悠长。",
        keywords: ["开放式结局", "反转", "群像", "独立"],
      },
      {
        text: "治愈成长线，从迷失到被小镇的人情味治愈，重新理解「成功」的意义。她带着全新的自己回归，在事业和生活之间找到了属于自己的平衡点。温暖HE。",
        keywords: ["HE", "成长", "治愈", "回归", "平衡"],
      },
    ],
    adjustPrompt: "最后还有想补充的吗？比如「想要更甜」「结尾要有反转」，没有的话我就开始整理设定了～",
  },
];

// ─── Mock Settings Data (based on round selections) ─────────

const mockSettings: Record<string, { label: string; value: string }[]> = {
  "故事概念": [
    { label: "核心设定", value: "一位当红影后在事业巅峰突然失忆，被迫隐居南方小镇。没有聚光灯的日子里，她发现这里藏着她遗忘的童年和一段未完的缘分。" },
    { label: "故事基调", value: "甜宠日常，慢节奏温暖治愈。主角在小镇开了一家面馆，与隔壁沉默寡言的馆主从互相看不顺眼到每天给对方留饭，小镇居民看在眼里急在心里。" },
    { label: "故事走向", value: "明线甜恋暗线揭秘。当主角终于想起一切，要在复仇和眼前的幸福之间做选择。最终选择放下执念，用新的方式重新定义成功。" },
    { label: "核心冲突", value: "失忆真相 × 新旧生活的抉择 × 过去的伤害与当下的温暖" },
  ],
  "写作要素": [
    { label: "受众", value: "女频" },
    { label: "题材", value: "言情 · 都市" },
    { label: "时空", value: "现代" },
    { label: "剧情元素", value: "失忆 · 娱乐圈 · 治愈 · 美食" },
    { label: "人物关系", value: "欢喜冤家 · 青梅竹马" },
    { label: "风格调性", value: "甜宠 · 治愈 · 慢热" },
    { label: "结局", value: "HE" },
  ],
  "写作方式": [
    { label: "叙事视角", value: "第三人称" },
    { label: "叙事结构", value: "线性叙事（穿插记忆闪回）" },
    { label: "文风", value: "文艺抒情" },
    { label: "篇幅", value: "中长篇（8-15万字）" },
  ],
};

// ─── Mock Worldbuilding Data ─────────────────────────────────

interface WorldbuildingScene {
  name: string;
  description: string;
}

interface WorldbuildingData {
  summary: string;
  timeline: string;
  scenes: WorldbuildingScene[];
  socialEcology: string[];
  hiddenClues: string[];
}

const mockWorldbuilding: WorldbuildingData = {
  summary: "当代中国南方小镇「清岚镇」——一个依山傍水的千年古镇，青石板路、白墙黑瓦，手机信号时有时无。年轻人大多外出谋生，留下的都是老人和几个「不愿离开的怪人」。",
  timeline: "故事跨越一年四季，从盛夏到次年初夏。四季变化推动情感发展：夏天相遇→秋天暧昧→冬天误会→春天和解→初夏告白。",
  scenes: [
    { name: "清岚镇·主街", description: "唯一的主街，两侧是各种老字号店铺。早上有赶早市的吆喝声，傍晚有归家的炊烟。街尾是一棵三百年的老榕树，树下有石桌石凳，是全镇的八卦中心。" },
    { name: "一碗春面馆", description: "女主盘下的老面馆，前店后院。院子里有棵百年老桂花树，秋天整条街都能闻到香气。面馆只卖六种面，每天限量，卖完就关门。" },
    { name: "济世堂中医馆", description: "男主经营的祖传中医馆，就在面馆隔壁。一墙之隔，药香和面香混在一起。男主话少但医术高明，半个镇子的人都找他看病。" },
    { name: "古戏台", description: "镇中心的百年老戏台，逢年过节唱戏。后来成了女主组织文艺汇演的舞台，也是两人关系转折的重要场所。戏台背后有一间废弃的化妆间，藏着女主童年的秘密。" },
    { name: "后山竹林", description: "镇子背后的大片竹林，有一条隐秘的小路通向山顶的废弃凉亭。这里是男主独处的地方，也是两人第一次敞开心扉的场所。" },
  ],
  socialEcology: [
    "镇上人际关系极其紧密，任何新鲜事半小时内全镇皆知",
    "每周日早上有赶集，是全镇最热闹的时候，也是获取信息的重要渠道",
    "镇长王婶是个爱管闲事的热心肠，暗中撮合各种姻缘，是推动主线的关键配角",
    "镇上有个「三巨头」聊天团：王婶、杂货店老张、茶馆陈老，他们的对话是读者了解小镇的窗口",
  ],
  hiddenClues: [
    "女主小时候在清岚镇生活过三年，镇上有人认出了她但选择沉默守护",
    "失忆的真相与一场十五年前的车祸有关，肇事者与女主的经纪人有关联",
    "男主的爷爷曾经是女主母亲的主治医生，两家有一段未了的恩情",
    "面馆的院子里埋着一个时间胶囊，是女主童年时亲手埋下的",
  ],
};

// ─── Mock: free-input guided flow ────────────────────────────

const guidedFollowUps = [
  {
    analysis: "很棒的构思！我从你的描述中提取到了以下信息：\n\n• **题材方向**：都市言情\n• **核心设定**：影后失忆隐居小镇\n• **故事基调**：治愈温暖\n\n还有几个关键信息需要确认一下：",
    question: "你希望故事的**剧情元素**侧重哪些方面？比如：失忆、娱乐圈、美食、重生、职场等。另外，男女主之间是什么样的关系设定？",
  },
  {
    analysis: "明白了！我更新一下设定：\n\n• **剧情元素**：失忆 · 娱乐圈 · 美食 · 治愈\n• **人物关系**：欢喜冤家 · 青梅竹马\n\n最后确认一下：",
    question: "你想要什么样的**结局**？（HE / BE / 开放式）篇幅大概多长？叙事视角有偏好吗？",
  },
];

// ─── Types ───────────────────────────────────────────────────

type Message =
  | { id: string; sender: "model"; type: "inspiration"; prompt: string; cards: InspirationCard[]; round: number }
  | { id: string; sender: "model"; type: "thinking" }
  | { id: string; sender: "model"; type: "text"; content: string }
  | { id: string; sender: "model"; type: "settings-card"; prompt: string; settings: Record<string, { label: string; value: string }[]> }
  | { id: string; sender: "model"; type: "worldbuilding-card"; prompt: string; data: WorldbuildingData }
  | { id: string; sender: "model"; type: "welcome"; prompt: string }
  | { id: string; sender: "model"; type: "micro-adjust"; prompt: string; round: number }
  | { id: string; sender: "user"; type: "card-selection"; content: string }
  | { id: string; sender: "user"; type: "text"; content: string };

// ─── Component ───────────────────────────────────────────────

export default function ChatPanel() {
  const setCreationStage = useEditorStore((s) => s.setCreationStage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selections, setSelections] = useState<Record<number, number>>({}); // round → selected card index
  const [currentRound, setCurrentRound] = useState(0); // 0=welcome, 1-3=inspiration, 4=confirm stage
  const [flowMode, setFlowMode] = useState<"none" | "inspiration" | "freeform">("none");
  const [freeformStep, setFreeformStep] = useState(0);
  const [awaitingAdjust, setAwaitingAdjust] = useState(false); // waiting for user micro-adjust
  const [adjustRound, setAdjustRound] = useState(0); // which round is awaiting adjust
  const [favKeywords, setFavKeywords] = useState<Set<string>>(new Set());
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

  // Scene card entry: model sends welcome message
  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;

    const thinkingId = `thinking-init`;
    setMessages([{ id: thinkingId, sender: "model", type: "thinking" }]);

    setTimeout(() => {
      setMessages([
        {
          id: "model-welcome",
          sender: "model",
          type: "welcome",
          prompt: "你好！欢迎来到小说创作工作台 ✨\n\n你可以让我帮你找灵感，也可以直接在下面描述你的故事——\n一段梗概、一个画面、甚至一句「我想写一个关于__的故事」都可以，我们一起把它变成完整的创作蓝图。",
        },
      ]);
    }, 1200);
  }, []);

  // Toggle keyword favorite
  const toggleKeyword = useCallback((kw: string) => {
    setFavKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(kw)) next.delete(kw);
      else next.add(kw);
      return next;
    });
  }, []);

  // Handle "帮我找灵感" button click
  const handleStartInspiration = useCallback(() => {
    setFlowMode("inspiration");

    const thinkingId = `thinking-r1`;
    setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);

    setTimeout(() => {
      const round = inspirationRounds[0];
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingId),
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
    }, 1500);
  }, []);

  // Proceed to next round (after adjust or skip)
  const proceedToNextRound = useCallback(
    (fromRound: number) => {
      setAwaitingAdjust(false);

      if (fromRound < 3) {
        // Show thinking, then next round
        const thinkingId = `thinking-r${fromRound + 1}`;
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);

        setTimeout(() => {
          const nextRound = inspirationRounds[fromRound];
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-r${fromRound + 1}`,
              sender: "model",
              type: "inspiration",
              prompt: nextRound.prompt,
              cards: nextRound.cards,
              round: fromRound + 1,
            },
          ]);
          setCurrentRound(fromRound + 1);
        }, 1500);
      } else {
        // Round 3 done → generate settings card
        const thinkingId = `thinking-settings`;
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);

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
          setCreationStage(1);
        }, 2500);
      }
    },
    [setCreationStage]
  );

  // Handle card selection → show micro-adjust prompt
  const handleCardSelect = useCallback(
    (round: number, cardIndex: number) => {
      if (selections[round] !== undefined) return;
      const cardText = inspirationRounds[round - 1].cards[cardIndex].text;

      setSelections((prev) => ({ ...prev, [round]: cardIndex }));

      setMessages((prev) => [
        ...prev,
        { id: `user-r${round}`, sender: "user", type: "card-selection", content: cardText },
      ]);

      // Show thinking, then micro-adjust prompt
      const thinkingId = `thinking-adj-${round}`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: `model-adj-${round}`,
            sender: "model",
            type: "micro-adjust",
            prompt: inspirationRounds[round - 1].adjustPrompt,
            round,
          },
        ]);
        setAwaitingAdjust(true);
        setAdjustRound(round);
      }, 1500);
    },
    [selections]
  );

  // Handle "就这样" skip
  const handleSkipAdjust = useCallback(() => {
    proceedToNextRound(adjustRound);
  }, [adjustRound, proceedToNextRound]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    // Mock: no-op
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

    // If awaiting micro-adjust, user typed adjustment → proceed
    if (awaitingAdjust) {
      const thinkingId = `thinking-adj-ack-${adjustRound}`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: `model-adj-ack-${adjustRound}`,
            sender: "model",
            type: "text",
            content: "收到，已记录你的偏好！",
          },
        ]);
        setTimeout(() => proceedToNextRound(adjustRound), 500);
      }, 1200);
      return;
    }

    // If at confirm stage (after settings card shown), user confirmed → generate world-building
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
            type: "worldbuilding-card",
            prompt: "世界观构建完成！我为「清岚镇」搭建了完整的场景和社会生态。你可以在编辑区查看完整内容，觉得没问题就可以开始创建角色了。",
            data: mockWorldbuilding,
          },
        ]);
        setCurrentRound(5);
        setCreationStage(2);
      }, 2500);
      return;
    }

    // If at worldbuilding confirm stage, user confirmed → start character stage
    if (currentRound === 5) {
      const thinkingId = `thinking-char`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-characters",
            sender: "model",
            type: "text",
            content: "好的，正在为你创建角色设定…（角色 — 待实现）",
          },
        ]);
        setCurrentRound(6);
        setCreationStage(3);
      }, 2500);
      return;
    }

    // Free-form input flow
    if (flowMode === "none" || flowMode === "freeform") {
      setFlowMode("freeform");

      if (freeformStep < guidedFollowUps.length) {
        const followUp = guidedFollowUps[freeformStep];
        const thinkingId = `thinking-ff-${freeformStep}`;

        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-ff-${freeformStep}`,
              sender: "model",
              type: "text",
              content: followUp.analysis + "\n\n" + followUp.question,
            },
          ]);
          setFreeformStep((s) => s + 1);
        }, 2000);
      } else {
        const thinkingId = `thinking-ff-settings`;

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
              prompt: "根据你的描述，我为你整理了以下创作设定。确认无误就可以开始生成世界观了，你也可以告诉我需要调整的地方。",
              settings: mockSettings,
            },
          ]);
          setCurrentRound(4);
          setCreationStage(1);
        }, 2500);
      }
    }
  }, [input, awaitingAdjust, adjustRound, currentRound, flowMode, freeformStep, setCreationStage, proceedToNextRound]);

  // Collect all keywords from all rounds for the "fav bar"
  const allFavKeywords = Array.from(favKeywords);

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* Favorited Keywords Bar */}
      {allFavKeywords.length > 0 && (
        <div className="px-5 py-2.5 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-400 shrink-0">收藏的元素</span>
            {allFavKeywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 bg-pink-50 text-pink-500 text-xs rounded-full border border-pink-100 flex items-center gap-1"
              >
                <Heart className="w-2.5 h-2.5 fill-pink-400" />
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

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
                      <div key={i}>
                        <button
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
                              {card.text}
                            </p>
                          </div>
                        </button>

                        {/* Keywords */}
                        {!isOther && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5 ml-8">
                            {card.keywords.map((kw) => {
                              const isFav = favKeywords.has(kw);
                              return (
                                <button
                                  key={kw}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleKeyword(kw);
                                  }}
                                  className={`px-2 py-0.5 text-[11px] rounded-full border transition-all duration-150 flex items-center gap-1 ${
                                    isFav
                                      ? "bg-pink-50 text-pink-500 border-pink-200"
                                      : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-500"
                                  }`}
                                >
                                  <Heart className={`w-2.5 h-2.5 ${isFav ? "fill-pink-400" : ""}`} />
                                  {kw}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
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

          // ── Model: micro-adjust prompt ──
          if (msg.sender === "model" && msg.type === "micro-adjust") {
            const isActive = awaitingAdjust && adjustRound === msg.round;
            return (
              <div key={msg.id} className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>
                {isActive && (
                  <div className="pl-8">
                    <button
                      onClick={handleSkipAdjust}
                      className="px-3.5 py-1.5 text-xs text-gray-500 bg-gray-50 rounded-full border border-gray-200 hover:bg-gray-100 transition"
                    >
                      就这样 👌
                    </button>
                  </div>
                )}
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
                <div className="text-sm text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">{msg.content}</div>
              </div>
            );
          }

          // ── Model: welcome message ──
          if (msg.sender === "model" && msg.type === "welcome") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">{msg.prompt}</div>

                {/* Entry button */}
                {flowMode === "none" && (
                  <div className="pl-8 mt-2">
                    <button
                      onClick={handleStartInspiration}
                      className="px-4 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl border border-indigo-100 hover:bg-indigo-100 transition"
                    >
                      ✨ 帮我找灵感
                    </button>
                  </div>
                )}
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

          // ── Model: worldbuilding card ──
          if (msg.sender === "model" && msg.type === "worldbuilding-card") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                {/* Worldbuilding Card - truncated with fade */}
                <div className="pl-8">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                    <div className="max-h-[200px] overflow-hidden">
                      {/* Summary */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">故事世界</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{msg.data.summary}</p>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Scenes preview */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">核心场景</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.data.scenes.map((s) => (
                            <span key={s.name} className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Timeline */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">时间线</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{msg.data.timeline}</p>
                      </div>
                    </div>
                    {/* Gradient fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    <div className="relative px-4 py-2.5 text-center border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">查看完整世界观请点击编辑区</span>
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
            placeholder={
              flowMode === "none"
                ? "描述你的故事构思，一段梗概、一个画面、甚至一句话..."
                : awaitingAdjust
                ? "想微调什么？直接说就行，或者点「就这样」跳过"
                : "输入你的想法..."
            }
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
