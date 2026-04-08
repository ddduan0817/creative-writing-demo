"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";
import FloatingSelectionToolbar from "./FloatingSelectionToolbar";
import { useEffect, useState, useCallback, useRef } from "react";
import { getSceneMockResponses } from "@/data/mockAIResponses";
import { simulateAIStream } from "@/lib/aiSimulator";
import {
  ChevronDown,
  RefreshCw,
  MoveHorizontal,
  Palette,
  Sparkles,
  List,
  Check,
  Loader2,
  Maximize2,
  Minimize2,
} from "lucide-react";

export default function RichTextEditor() {
  const {
    chapters,
    currentChapterId,
    updateChapterContent,
    leftView,
    outline,
    showToast,
    scene,
    pendingInsert,
    setPendingInsert,
    creationStage,
    novelChapters,
    currentNovelChapter,
    setCurrentNovelChapter,
    setNovelChapterContent,
    workMode,
    agentStageData,
  } = useEditorStore();

  const currentChapter = chapters.find((c) => c.id === currentChapterId);
  const isSimpleScene = scene === "marketing" || scene === "knowledge";
  const [tocOpen, setTocOpen] = useState(false);
  const [fullscreenEdit, setFullscreenEdit] = useState(false);
  const [floatingToolbar, setFloatingToolbar] = useState<{
    show: boolean;
    top: number;
    left: number;
  }>({ show: false, top: 0, left: 0 });
  const [showAIMenu, setShowAIMenu] = useState(false);
  const [atmosphereDialog, setAtmosphereDialog] = useState<{
    show: boolean;
    text: string;
    generating: boolean;
    result: string;
    actionLabel: string;
  }>({ show: false, text: "", generating: false, result: "", actionLabel: "" });
  const editorWrapRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !((scene === "novel" || scene === "screenplay") && workMode === null),
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "开始你的创作...",
      }),
    ],
    content: currentChapter?.content || "",
    onUpdate: ({ editor: e }) => {
      if (currentChapterId) {
        updateChapterContent(currentChapterId, e.getHTML());
      }
    },
    onSelectionUpdate: ({ editor: e }) => {
      const { from, to } = e.state.selection;
      if (from === to) {
        setFloatingToolbar({ show: false, top: 0, left: 0 });
        setShowAIMenu(false);
        return;
      }
      // Get position from the DOM
      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0 && editorWrapRef.current) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const wrapRect = editorWrapRef.current.getBoundingClientRect();
        setFloatingToolbar({
          show: true,
          top: rect.top - wrapRect.top + editorWrapRef.current.scrollTop - 48,
          left: rect.left - wrapRect.left + rect.width / 2 - 180,
        });
        setShowAIMenu(false);
      }
    },
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none px-8 py-4",
      },
    },
  });

  // Toggle editable when workMode changes
  useEffect(() => {
    if (editor) {
      const shouldBeEditable = !((scene === "novel" || scene === "screenplay") && workMode === null);
      if (editor.isEditable !== shouldBeEditable) {
        editor.setEditable(shouldBeEditable);
      }
    }
  }, [editor, scene, workMode]);

  // Sync content when chapter changes
  useEffect(() => {
    if (editor && currentChapter) {
      const currentContent = editor.getHTML();
      if (currentContent !== currentChapter.content) {
        editor.commands.setContent(currentChapter.content || "");
      }
    }
  }, [currentChapterId, editor, currentChapter]);

  // Handle pending insert from inspiration cards
  useEffect(() => {
    if (editor && pendingInsert) {
      editor
        .chain()
        .focus("end")
        .insertContent(
          pendingInsert
            .split("\n\n")
            .map((p) => `<p>${p}</p>`)
            .join("")
        )
        .run();
      setPendingInsert(null);
    }
  }, [editor, pendingInsert, setPendingInsert]);

  // IntersectionObserver to track visible chapter and update TOC highlight on scroll
  useEffect(() => {
    if (creationStage < 5) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            if (id?.startsWith("chapter-")) {
              const idx = parseInt(id.replace("chapter-", ""), 10);
              if (!isNaN(idx)) setCurrentNovelChapter(idx);
            }
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    novelChapters.forEach((_, i) => {
      const el = document.getElementById(`chapter-${i}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [creationStage, novelChapters.length, setCurrentNovelChapter]);

  // Track which chapter we already scrolled to, to avoid repeat scrolls
  const scrollToChapter = useEditorStore((s) => s.scrollToChapter);
  const setScrollToChapter = useEditorStore((s) => s.setScrollToChapter);
  // The "active" chapter is the latest generating or last done chapter
  const [showPreviousChapters, setShowPreviousChapters] = useState(false);
  // Fullscreen editor refs
  const fullscreenWrapRef = useRef<HTMLDivElement>(null);
  const [fsFloatingToolbar, setFsFloatingToolbar] = useState<{ show: boolean; top: number; left: number }>({ show: false, top: 0, left: 0 });
  const [fsShowAIMenu, setFsShowAIMenu] = useState(false);

  // Fullscreen TipTap editor for stage 1-4 content editing
  const fullscreenEditor = useEditor({
    immediatelyRender: false,
    editable: true,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "编辑内容..." }),
    ],
    content: "",
    onSelectionUpdate: ({ editor: e }) => {
      const { from, to } = e.state.selection;
      if (from === to) {
        setFsFloatingToolbar({ show: false, top: 0, left: 0 });
        setFsShowAIMenu(false);
        return;
      }
      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0 && fullscreenWrapRef.current) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const wrapRect = fullscreenWrapRef.current.getBoundingClientRect();
        setFsFloatingToolbar({
          show: true,
          top: rect.top - wrapRect.top + fullscreenWrapRef.current.scrollTop - 48,
          left: rect.left - wrapRect.left + rect.width / 2 - 180,
        });
        setFsShowAIMenu(false);
      }
    },
    editorProps: {
      attributes: {
        class: "tiptap focus:outline-none px-8 py-4",
      },
    },
  });
  // Reset showPreviousChapters when a new chapter starts generating
  useEffect(() => {
    if (scrollToChapter !== null && scrollToChapter >= 1) {
      setShowPreviousChapters(false);
      setScrollToChapter(null);
    }
  }, [scrollToChapter, setScrollToChapter]);

  const handleAIAction = useCallback(
    (action: string) => {
      setFloatingToolbar((p) => ({ ...p, show: false }));

      // Try TipTap editor selection first, fallback to window selection
      let selectedText = "";
      if (editor) {
        const { from, to } = editor.state.selection;
        if (from !== to) {
          selectedText = editor.state.doc.textBetween(from, to, " ") || "";
        }
      }
      if (!selectedText) {
        const sel = window.getSelection();
        selectedText = sel ? sel.toString() : "";
      }

      const mockData = getSceneMockResponses(scene);
      if (action === "atmosphere" || action === "polish" || action === "grassify" || action === "rewrite" || action === "condense") {
        let responseText: string;
        let label: string;
        switch (action) {
          case "atmosphere":
            responseText = mockData.atmosphere;
            label = "氛围增强";
            break;
          case "grassify":
            responseText = mockData.grassify || mockData.atmosphere;
            label = "种草感增强";
            break;
          case "polish":
            responseText = mockData.polish;
            label = "润色";
            break;
          case "rewrite":
            responseText = mockData.rewrite || mockData.polish;
            label = "改写";
            break;
          case "condense":
            responseText = mockData.condense || selectedText.slice(0, 50);
            label = "缩写";
            break;
          default:
            responseText = mockData.polish;
            label = "AI调整";
        }
        setAtmosphereDialog({
          show: true,
          text:
            selectedText.slice(0, 15) +
            (selectedText.length > 15 ? "..." : ""),
          generating: true,
          result: "",
          actionLabel: label,
        });
        simulateAIStream(responseText, (current, done) => {
          setAtmosphereDialog((prev) => ({
            ...prev,
            result: current,
            generating: !done,
          }));
        });
      }
    },
    [editor, scene]
  );

  const handleReplace = useCallback(() => {
    if (!editor || !atmosphereDialog.result) return;
    const { from, to } = editor.state.selection;
    editor
      .chain()
      .focus()
      .deleteRange({ from, to })
      .insertContent(
        atmosphereDialog.result
          .split("\n\n")
          .map((p) => `<p>${p}</p>`)
          .join("")
      )
      .run();
    setAtmosphereDialog({
      show: false,
      text: "",
      generating: false,
      result: "",
      actionLabel: "",
    });
    showToast("已替换选中内容");
  }, [editor, atmosphereDialog.result, showToast]);

  const handleCopyResult = useCallback(() => {
    navigator.clipboard.writeText(atmosphereDialog.result);
    showToast("已复制");
  }, [atmosphereDialog.result, showToast]);

  const handleRegenerate = useCallback(() => {
    const mockData = getSceneMockResponses(scene);
    setAtmosphereDialog((prev) => ({ ...prev, generating: true, result: "" }));
    simulateAIStream(mockData.atmosphere, (current, done) => {
      setAtmosphereDialog((prev) => ({
        ...prev,
        result: current,
        generating: !done,
      }));
    });
  }, [scene]);

  const handleSelectionCopy = useCallback(() => {
    let text = "";
    if (editor) {
      const { from, to } = editor.state.selection;
      if (from !== to) text = editor.state.doc.textBetween(from, to, " ");
    }
    if (!text) {
      const sel = window.getSelection();
      text = sel ? sel.toString() : "";
    }
    if (text) {
      navigator.clipboard.writeText(text);
      showToast("已复制");
    }
  }, [editor, showToast]);

  const handleMouseUpSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim() && editorWrapRef.current) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const wrapRect = editorWrapRef.current.getBoundingClientRect();
      setFloatingToolbar({
        show: true,
        top: rect.top - wrapRect.top + editorWrapRef.current.scrollTop - 48,
        left: rect.left - wrapRect.left + rect.width / 2 - 180,
      });
      setShowAIMenu(false);
    } else {
      setFloatingToolbar({ show: false, top: 0, left: 0 });
      setShowAIMenu(false);
    }
  }, []);

  // Check if editor is empty
  const editorIsEmpty = !editor?.getText().trim();

  // Handle AI actions in fullscreen editor
  const handleFsAIAction = useCallback(
    (action: string) => {
      setFsFloatingToolbar((p) => ({ ...p, show: false }));
      if (!fullscreenEditor) return;
      const { from, to } = fullscreenEditor.state.selection;
      const selectedText = fullscreenEditor.state.doc.textBetween(from, to, " ");
      if (!selectedText.trim()) {
        showToast("请先选择要调整的文本");
        return;
      }
      const mockData = getSceneMockResponses(scene);
      let responseText: string;
      let label: string;
      switch (action) {
        case "atmosphere": responseText = mockData.atmosphere; label = "氛围增强"; break;
        case "polish": responseText = mockData.polish; label = "润色"; break;
        case "rewrite": responseText = mockData.rewrite || mockData.polish; label = "改写"; break;
        case "condense": responseText = mockData.condense || selectedText.slice(0, 50); label = "缩写"; break;
        default: responseText = mockData.polish; label = "AI调整";
      }
      setAtmosphereDialog({ show: true, text: selectedText.slice(0, 15) + (selectedText.length > 15 ? "..." : ""), generating: true, result: "", actionLabel: label });
      simulateAIStream(responseText, (current, done) => {
        setAtmosphereDialog((prev) => ({ ...prev, result: current, generating: !done }));
      });
    },
    [fullscreenEditor, scene, showToast]
  );

  const handleFsSelectionCopy = useCallback(() => {
    let text = "";
    if (fullscreenEditor) {
      const { from, to } = fullscreenEditor.state.selection;
      if (from !== to) text = fullscreenEditor.state.doc.textBetween(from, to, " ");
    }
    if (!text) {
      const sel = window.getSelection();
      text = sel ? sel.toString() : "";
    }
    if (text) {
      navigator.clipboard.writeText(text);
      showToast("已复制");
    }
  }, [fullscreenEditor, showToast]);

  // Agent flow: show settings/worldbuilding in editor (read-only)
  if ((scene === "novel" || scene === "screenplay" || scene === "marketing" || scene === "knowledge") && creationStage >= 1 && creationStage <= 4) {
    // creationStage 1 = 设定, 2 = 世界观, 3 = 角色, 4 = 大纲, 5 = 正文(退出只读)
    const showWorldbuilding = creationStage === 2;
    const showCharacters = creationStage === 3;
    const showOutline = creationStage >= 4;

    const novelSettingsData = [
      {
        group: "故事概念",
        type: "text" as const,
        items: [
          { label: "核心设定", value: "一位当红影后在事业巅峰突然失忆，被迫隐居南方小镇。没有聚光灯的日子里，她发现这里藏着她遗忘的童年和一段未完的缘分。" },
          { label: "故事基调", value: "甜宠日常，慢节奏温暖治愈。主角在小镇开了一家面馆，与隔壁沉默寡言的馆主从互相看不顺眼到每天给对方留饭，小镇居民看在眼里急在心里。" },
          { label: "故事走向", value: "明线甜恋暗线揭秘。当主角终于想起一切，要在复仇和眼前的幸福之间做选择。最终选择放下执念，用新的方式重新定义成功。" },
          { label: "核心冲突", value: "失忆真相 × 新旧生活的抉择 × 过去的伤害与当下的温暖" },
        ],
      },
      {
        group: "写作要素",
        type: "tags" as const,
        items: [
          { label: "受众", value: "女频" },
          { label: "题材", value: "言情 · 都市" },
          { label: "时空", value: "现代" },
          { label: "剧情元素", value: "失忆 · 娱乐圈 · 治愈 · 美食" },
          { label: "人物关系", value: "欢喜冤家 · 青梅竹马" },
          { label: "风格调性", value: "甜宠 · 治愈 · 慢热" },
          { label: "结局", value: "HE" },
        ],
      },
      {
        group: "写作方式",
        type: "tags" as const,
        items: [
          { label: "叙事视角", value: "第三人称" },
          { label: "叙事结构", value: "线性叙事（穿插记忆闪回）" },
          { label: "文风", value: "文艺抒情" },
          { label: "篇幅", value: "中长篇（8-15万字）" },
        ],
      },
    ];

    const marketingSettingsData = [
      {
        group: "产品信息",
        type: "text" as const,
        items: [
          { label: "产品名称", value: "Wireless Bluetooth Headset · 隐形蓝牙耳机" },
          { label: "核心卖点", value: "极致隐形 · IPX5防水 · 主动降噪 · 36H续航" },
          { label: "价格", value: "$29.99（竞品均价$49-79）" },
          { label: "目标人群", value: "18-35岁，追求便携和性价比的年轻用户" },
        ],
      },
      {
        group: "视频策略",
        type: "tags" as const,
        items: [
          { label: "时长", value: "40秒" },
          { label: "风格", value: "UGC真人出镜 · 自然分享" },
          { label: "平台", value: "TikTok" },
          { label: "语言", value: "英文口语" },
        ],
      },
      {
        group: "角色与转化",
        type: "tags" as const,
        items: [
          { label: "出镜角色", value: "Jimmy · 20-30岁男性 · 休闲穿搭" },
          { label: "开篇策略", value: "视觉对比 · 普通耳机 vs 隐形耳机" },
          { label: "转化策略", value: "功能叠加 + 价格锚定" },
          { label: "CTA", value: "Link in bio · 限时优惠" },
        ],
      },
    ];

    const knowledgeSettingsData = [
      {
        group: "书籍信息",
        type: "text" as const,
        items: [
          { label: "书名", value: "《诡秘之主》" },
          { label: "作者", value: "爱潜水的乌贼" },
          { label: "总字数", value: "约450万字" },
          { label: "章节数", value: "8卷 · 1413章" },
        ],
      },
      {
        group: "分析配置",
        type: "tags" as const,
        items: [
          { label: "分析方向", value: "设定体系 · 魔药/序列/途径" },
          { label: "分析深度", value: "深度拆解 · 引用原文+标注出处" },
          { label: "输出形式", value: "结构化报告" },
        ],
      },
      {
        group: "自动识别",
        type: "tags" as const,
        items: [
          { label: "核心角色", value: "克莱恩·莫雷蒂 · 奥黛丽·霍尔 · 阿尔杰·威尔逊等47位" },
          { label: "主要势力", value: "7大正统教会 · 3大隐秘组织 · 塔罗会" },
          { label: "核心设定", value: "22条非凡途径 · 序列0-9 · 灰雾之上" },
          { label: "预处理", value: "分章索引✅ · 实体识别✅ · 向量化✅" },
        ],
      },
    ];

    const settingsDataMap: Record<string, typeof novelSettingsData> = {
      novel: novelSettingsData,
      screenplay: novelSettingsData,
      marketing: marketingSettingsData,
      knowledge: knowledgeSettingsData,
    };
    // Use store data from ChatPanel if available, else hardcoded
    const storeSettings = agentStageData?.settings as Record<string, { label: string; value: string }[]> | undefined;
    const settingsData = storeSettings
      ? Object.entries(storeSettings).map(([group, items], i) => ({
          group,
          type: (i === 0 ? "text" : "tags") as "text" | "tags",
          items,
        }))
      : (settingsDataMap[scene] || novelSettingsData);

    const settingsTitleMap: Record<string, string> = {
      novel: "创作设定",
      screenplay: "创作设定",
      marketing: "视频策略Brief",
      knowledge: "分析配置",
    };
    const settingsTitle = settingsTitleMap[scene] || "创作设定";
    const settingsSubtitle = scene === "marketing" || scene === "knowledge"
      ? "如需修改，请在右侧对话中告诉我"
      : "如需修改，请在右侧对话中告诉我";

    // ── Worldbuilding data per scene ──
    const worldbuildingData: Record<string, {
      title: string;
      summaryLabel: string;
      summary: string;
      timelineLabel: string;
      timeline: string;
      scenesTitle: string;
      scenes: { name: string; desc: string }[];
      ecologyTitle: string;
      ecology: string[];
      cluesTitle: string;
      clues: string[];
    }> = {
      novel: {
        title: "世界观",
        summaryLabel: "世界概述",
        summary: "当代中国南方小镇「清岚镇」——一个依山傍水的千年古镇，青石板路、白墙黑瓦，手机信号时有时无。年轻人大多外出谋生，留下的都是老人和几个「不愿离开的怪人」。",
        timelineLabel: "时间线",
        timeline: "故事跨越一年四季，从盛夏到次年初夏。四季变化推动情感发展：夏天相遇→秋天暧昧→冬天误会→春天和解→初夏告白。",
        scenesTitle: "核心场景",
        scenes: [
          { name: "清岚镇·主街", desc: "唯一的主街，两侧是各种老字号店铺。早上有赶早市的吆喝声，傍晚有归家的炊烟。街尾是一棵三百年的老榕树，树下有石桌石凳，是全镇的八卦中心。" },
          { name: "一碗春面馆", desc: "女主盘下的老面馆，前店后院。院子里有棵百年老桂花树，秋天整条街都能闻到香气。面馆只卖六种面，每天限量，卖完就关门。" },
          { name: "济世堂中医馆", desc: "男主经营的祖传中医馆，就在面馆隔壁。一墙之隔，药香和面香混在一起。男主话少但医术高明，半个镇子的人都找他看病。" },
          { name: "古戏台", desc: "镇中心的百年老戏台，逢年过节唱戏。后来成了女主组织文艺汇演的舞台，也是两人关系转折的重要场所。戏台背后有一间废弃的化妆间，藏着女主童年的秘密。" },
          { name: "后山竹林", desc: "镇子背后的大片竹林，有一条隐秘的小路通向山顶的废弃凉亭。这里是男主独处的地方，也是两人第一次敞开心扉的场所。" },
        ],
        ecologyTitle: "社会生态",
        ecology: [
          "镇上人际关系极其紧密，任何新鲜事半小时内全镇皆知",
          "每周日早上有赶集，是全镇最热闹的时候，也是获取信息的重要渠道",
          "镇长王婶是个爱管闲事的热心肠，暗中撮合各种姻缘，是推动主线的关键配角",
          "镇上有个「三巨头」聊天团：王婶、杂货店老张、茶馆陈老，他们的对话是读者了解小镇的窗口",
        ],
        cluesTitle: "隐藏线索",
        clues: [
          "女主小时候在清岚镇生活过三年，镇上有人认出了她但选择沉默守护",
          "失忆的真相与一场十五年前的车祸有关，肇事者与女主的经纪人有关联",
          "男主的爷爷曾经是女主母亲的主治医生，两家有一段未了的恩情",
          "面馆的院子里埋着一个时间胶囊，是女主童年时亲手埋下的",
        ],
      },
      marketing: {
        title: "故事线设计",
        summaryLabel: "视频概述",
        summary: "40秒UGC风格TikTok带货视频。真人出镜对比开场，功能逐个击破，价格锚定+多色展示收口。目标：3秒抓住注意力，30秒建立信任，最后10秒促成转化。",
        timelineLabel: "时间线",
        timeline: "0-5s 对比钩子 → 5-14s 痛点+隐形演示 → 14-18s 防水测试 → 18-27s 降噪+舒适度 → 27-32s 多色展示 → 32-40s 价格揭晓+CTA",
        scenesTitle: "核心场景",
        scenes: [
          { name: "开场 · 对比钩子", desc: "左手普通耳机右手隐形耳机，一句话点题。灰色卫衣，光线自然，家居背景。" },
          { name: "痛点 · 共鸣", desc: "展示普通耳机的问题（大、显眼、不舒服），表情略不满，制造「我也是」的认同感。" },
          { name: "防水 · 硬核演示", desc: "水龙头下冲洗耳机，特写水流，抬头惊喜表情：「It still works!」" },
          { name: "降噪 · 场景展示", desc: "地铁/咖啡厅嘈杂环境，戴上耳机世界安静。用音效对比表现降噪效果。" },
          { name: "舒适 · 侧躺演示", desc: "侧躺在床上，展示耳机不硌耳朵。轻松自然的表情，「Even while sleeping」。" },
          { name: "收口 · 价格+CTA", desc: "展示3种颜色的耳机排列（白/黑/蓝）。价格字幕动画弹出，「Link in bio」手指向下指。" },
        ],
        ecologyTitle: "平台策略",
        ecology: [
          "TikTok算法偏好：前3秒高停留 + 完播率 + 互动（评论问链接）",
          "评论区预埋策略：安排3-5条「Link?」「Where to buy?」「Just ordered!」",
          "发布时间建议：美东时间 7-9AM 或 7-10PM",
          "话题标签：#invisibleearbuds #tiktokmademebuyit #techreview #amazonfinds",
        ],
        cluesTitle: "关键洞察",
        clues: [
          "对比开场的3秒完播率决定了整条视频的流量级别",
          "防水测试环节是评论区讨论度最高的部分，会带来自然互动",
          "价格揭晓要放在功能叠加之后，观众已认可价值再看价格 = 超值感",
          "多色展示不只是展示颜色，更是在暗示「选一个」的行动指令",
        ],
      },
      knowledge: {
        title: "设定体系拆解",
        summaryLabel: "体系概述",
        summary: "《诡秘之主》的设定体系以「22条非凡途径 × 10个序列等级」为核心骨架，辅以「消化/扮演」法则、教会/组织势力格局、历史暗线三个维度。整个体系最精妙之处在于：设定不是静态的百科词条，而是随主角的探索逐步揭开。",
        timelineLabel: "设定揭露节奏",
        timeline: "设定揭露节奏：第1卷（序列基础+扮演法则）→ 第2-3卷（教会格局+途径关联）→ 第4-5卷（历史真相+高序列存在）→ 第6-8卷（真神本质+终极秘密）",
        scenesTitle: "核心设定",
        scenes: [
          { name: "22条非凡途径", desc: "从「占卜家」到「黑皇帝」，每条途径代表一种力量哲学。途径不是孤立的——序列4/3/2/1存在大量交叉和融合。克莱恩走的「愚者」途径是唯一的「全能途径」。" },
          { name: "消化与扮演", desc: "核心规则：服用魔药后必须「扮演」对应角色特质才能消化。序列越高，扮演难度越大，稍有不慎就会失控。这个规则让升级不只是战力提升，更是身份认同的考验。" },
          { name: "七大正统教会", desc: "每个教会守护1-3条途径的晋升资源，表面维护秩序，实则各有算计。教会的真正秘密：他们侍奉的「神」不全是神。" },
          { name: "灰雾之上", desc: "故事的核心空间。克莱恩在这里召开塔罗会、获取情报、行使「愚者」权柄。灰雾之上的真正含义在终卷才完全揭示。" },
          { name: "历史暗线", desc: "第四纪的历史被教会大量篡改。真实历史中发生了什么？外神为何要入侵？这些问题的答案散落在450万字中。" },
        ],
        ecologyTitle: "分析特征",
        ecology: [
          "设定服务叙事：每个设定的揭露都伴随角色的成长和剧情的转折",
          "层层嵌套：表层设定（魔药/序列）→ 深层规则（扮演/消化）→ 终极真相（真神/外神）",
          "读者参与感：大量设定需要读者自己推理，评论区的考据文化是作品魅力的一部分",
          "伏笔密度：平均每10章埋下一个重要伏笔，最长的伏笔跨越800+章才回收",
        ],
        cluesTitle: "隐藏线索",
        clues: [
          "克莱恩的「扮演」不只是消化魔药——他一直在扮演自己：从周明瑞到克莱恩到愚者",
          "塔罗会的成员选择并非随机——每个人都对应一张塔罗牌的象征意义",
          "「不要回头看」「不要回应」这类禁忌规则暗示了外神干涉的机制",
          "全书最大的伏笔：第1章的梦境内容在最终卷才完全解读",
        ],
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storeWb = agentStageData?.worldbuilding as any;
    const wb: {
      title: string;
      summaryLabel: string;
      summary: string;
      timelineLabel: string;
      timeline: string;
      scenesTitle: string;
      scenes: { name: string; desc: string }[];
      ecologyTitle: string;
      ecology: string[];
      cluesTitle: string;
      clues: string[];
    } = storeWb
      ? {
          title: scene === "marketing" ? "故事线设计" : scene === "knowledge" ? "设定体系拆解" : "世界观",
          summaryLabel: scene === "marketing" ? "视频概述" : scene === "knowledge" ? "体系概述" : "世界概述",
          summary: storeWb.summary,
          timelineLabel: scene === "knowledge" ? "设定揭露节奏" : "时间线",
          timeline: storeWb.timeline,
          scenesTitle: scene === "knowledge" ? "核心设定" : "核心场景",
          scenes: (storeWb.scenes || []).map((s: { name: string; description: string }) => ({ name: s.name, desc: s.description })),
          ecologyTitle: scene === "marketing" ? "平台策略" : scene === "knowledge" ? "分析特征" : "社会生态",
          ecology: storeWb.socialEcology || [],
          cluesTitle: scene === "marketing" ? "关键洞察" : "隐藏线索",
          clues: storeWb.hiddenClues || [],
        }
      : (worldbuildingData[scene] || worldbuildingData.novel);

    // ── Characters data per scene ──
    const charactersData: Record<string, {
      title: string;
      leadATitle: string;
      leadA: { name: string; subtitle?: string; color: string; items: { label: string; value: string }[] };
      leadBTitle: string;
      leadB: { name: string; subtitle?: string; color: string; items: { label: string; value: string }[] };
      supportingTitle: string;
      supporting: { name: string; role: string; desc: string }[];
      relationships: string;
    }> = {
      novel: {
        title: "角色档案",
        leadATitle: "女主角",
        leadA: {
          name: "苏念",
          subtitle: "小名念念",
          color: "purple",
          items: [
            { label: "身份", value: "前当红影后，现清岚镇「一碗春」面馆老板娘" },
            { label: "性格", value: "外柔内刚，失忆后展现出天然的亲和力和不服输的韧劲" },
            { label: "外貌", value: "杏眼桃腮，常扎麻花辫，最爱穿素色棉麻围裙" },
            { label: "习惯", value: "做面时会无意识哼歌，那首歌是她失忆前拍戏时的插曲" },
            { label: "秘密", value: "随身带着一枚旧铜钥匙，不知道它能打开什么" },
          ],
        },
        leadBTitle: "男主角",
        leadB: {
          name: "陆知行",
          color: "blue",
          items: [
            { label: "身份", value: "济世堂第四代传人，清岚镇唯一的中医" },
            { label: "性格", value: "沉默寡言但行动力强，面对苏念时语气会不自觉变软" },
            { label: "外貌", value: "清瘦高挑，常穿白衬衫，手指修长带着淡淡药香" },
            { label: "习惯", value: "深夜在后山竹林练八段锦，是他唯一的独处时间" },
            { label: "秘密", value: "认出了苏念的真实身份，但选择沉默守护她的平静生活" },
          ],
        },
        supportingTitle: "关键配角",
        supporting: [
          { name: "王婶", role: "镇长 / 非官方媒人", desc: "热心到让人招架不住，全镇姻缘她操了一半的心。口头禅：'我看你俩啊…'" },
          { name: "老张", role: "杂货店老板", desc: "话痨担当，消息灵通，是小镇的情报中心。什么事都瞒不过他的八卦雷达" },
          { name: "陈老", role: "茶馆掌柜", desc: "看似糊涂的智者，泡茶时偶尔一句话就能点醒所有人" },
          { name: "小鱼", role: "面馆学徒", desc: "16岁留守少年，把苏念当亲姐姐。是日常线的萌点担当，也是情感催化剂" },
        ],
        relationships: "苏念 × 陆知行：欢喜冤家 → 暗生情愫 → 互相守护\n王婶 → 全镇：操心一切，推动主线发展\n小鱼 → 苏念：姐弟情深，治愈线担当\n陈老 → 陆知行：亦师亦友，关键时刻点拨",
      },
      marketing: {
        title: "出镜角色设定",
        leadATitle: "出镜者",
        leadA: {
          name: "出镜者 · Jimmy",
          color: "amber",
          items: [
            { label: "身份", value: "20-25岁男性，普通大学生/年轻上班族形象" },
            { label: "表现", value: "自然不做作，像在跟朋友分享好物。会用TikTok高频口语表达" },
            { label: "外形", value: "灰色卫衣+牛仔裤，干净短发，不化妆" },
            { label: "表演要点", value: "说到关键卖点时会不自觉凑近镜头，展示产品时手势自然" },
            { label: "核心策略", value: "不是在「卖货」，而是在「分享一个自己真心喜欢的东西」" },
          ],
        },
        leadBTitle: "产品",
        leadB: {
          name: "产品 · 隐形蓝牙耳机",
          color: "blue",
          items: [
            { label: "产品", value: "Wireless Bluetooth Headset · 核心SKU" },
            { label: "调性", value: "科技感+极致小巧，每次出场都要让观众惊叹「这么小？」" },
            { label: "外观", value: "纯白/纯黑/深蓝三色可选，豆状造型，光泽感好" },
            { label: "出场方式", value: "每次出场都配合慢动作或特写，强调「隐形」和「精致」" },
            { label: "画面技巧", value: "产品在画面中的占比要小——越小越能强调「隐形」卖点" },
          ],
        },
        supportingTitle: "辅助元素",
        supporting: [
          { name: "字幕系统", role: "信息传达", desc: "每个核心卖点用白色粗体弹出，价格用黄色/红色突出。确保静音观看也能获取80%信息" },
          { name: "BGM", role: "节奏引导", desc: "选择TikTok热门轻快BGM，节拍与切镜节奏同步。音量控制在口播的30%-40%" },
          { name: "场景/道具", role: "可信度", desc: "家居背景（真实感）、水龙头（防水测试）、普通耳机（对比道具）" },
        ],
        relationships: "Jimmy × 产品：真实用户的自然推荐关系\n字幕 × 口播：互补关系，口播讲感受，字幕强化数据\nBGM × 节奏：踩点切镜，音乐驱动观看节奏",
      },
      knowledge: {
        title: "角色分析",
        leadATitle: "主角",
        leadA: {
          name: "克莱恩·莫雷蒂（周明瑞）",
          color: "purple",
          items: [
            { label: "身份", value: "穿越者→占卜家→小丑→魔术师→…→愚者 | 灰雾之上的主人" },
            { label: "性格", value: "初期谨慎小心，中期理性果决，后期背负沉重。最突出的特质：善于「扮演」" },
            { label: "外貌", value: "黑发黑瞳，身材修长。常穿黑色长风衣+半高帽。随序列提升气质逐渐变为「不可直视的存在」" },
            { label: "习惯", value: "紧张时默念自我暗示。写日记记录重要信息。对美食有执念" },
            { label: "秘密", value: "全书最大的身份之谜：他到底是谁？作者在终卷给出了第三种答案" },
          ],
        },
        leadBTitle: "核心反派",
        leadB: {
          name: "阿蒙 · 诡诈之魔",
          color: "red",
          items: [
            { label: "身份", value: "序列1「偷盗者」→ 试图成为「错误」途径的真神 | 亚当之弟" },
            { label: "性格", value: "表面永远微笑的绅士。本质：极致的「偷盗者」——偷时间、偷身份、偷命运" },
            { label: "外貌", value: "单片眼镜，黑色正装，永恒的微笑。他出现过的地方，时钟会异常" },
            { label: "行为", value: "偷盗他人的身份并完美扮演（和克莱恩的「扮演」法则形成镜像）" },
            { label: "秘密", value: "阿蒙可能是全书最「理解」克莱恩的人——两人都在扮演，都在对抗被吞噬的命运" },
          ],
        },
        supportingTitle: "关键角色",
        supporting: [
          { name: "奥黛丽·霍尔(正义)", role: "塔罗会核心 · 心理学家途径", desc: "从天真的伯爵之女成长为独当一面的非凡者。能力：读心+情绪操控" },
          { name: "阿尔杰·威尔逊(吊人)", role: "塔罗会元老 · 风暴途径", desc: "教会叛逃者，实用主义者。他的故事线体现了「信任」的主题" },
          { name: "亚当 · 命运之轮", role: "终极反派之一", desc: "表面是温和的教会大主教，实则是操控命运的存在" },
          { name: "老尼尔", role: "克莱恩的引路人", desc: "值夜者成员，克莱恩在非凡世界的第一个导师。他的牺牲是全书最催泪的情节之一" },
        ],
        relationships: "克莱恩 × 塔罗会：从「愚者先生」的伪装到真正的战友情谊\n克莱恩 × 阿蒙：宿敌+镜像，两个「扮演者」的终极对决\n克莱恩 × 老尼尔：师徒+遗志，贯穿全书的情感暗线\n亚当 × 阿蒙：兄弟+对手，各自追求成神的不同路径",
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storeChars = agentStageData?.characters as any;
    const profileToItems = (p: { name?: string; identity?: string; personality?: string; appearance?: string; habit?: string; secret?: string }) => [
      { label: "身份", value: p.identity || "" },
      { label: "性格", value: p.personality || "" },
      { label: "外貌", value: p.appearance || "" },
      { label: "习惯", value: p.habit || "" },
      { label: "秘密", value: p.secret || "" },
    ];
    const chars = storeChars
      ? {
          title: scene === "marketing" ? "出镜角色设定" : scene === "knowledge" ? "角色分析" : "角色档案",
          leadATitle: scene === "marketing" ? "出镜者" : scene === "knowledge" ? "主角" : "女主角",
          leadA: {
            name: storeChars.femaleLead?.name || "",
            subtitle: undefined as string | undefined,
            color: "purple",
            items: profileToItems(storeChars.femaleLead || {}),
          },
          leadBTitle: scene === "marketing" ? "产品" : scene === "knowledge" ? "核心反派" : "男主角",
          leadB: {
            name: storeChars.maleLead?.name || "",
            subtitle: undefined as string | undefined,
            color: "blue",
            items: profileToItems(storeChars.maleLead || {}),
          },
          supportingTitle: scene === "marketing" ? "辅助元素" : "关键配角",
          supporting: (storeChars.supporting || []) as { name: string; role: string; desc: string }[],
          relationships: (storeChars.relationships || "") as string,
        }
      : (charactersData[scene] || charactersData.novel);

    // ── Outline data per scene ──
    const outlineData: Record<string, {
      title: string;
      badge: string;
      info: string;
      chapters: { title: string; summary: string; keyEvent: string; tag: string }[];
      tagColors: Record<string, string>;
    }> = {
      novel: {
        title: "故事大纲",
        badge: "四季章回 · 甜中带虐",
        info: "16章 · 约12万字",
        chapters: [
          { title: "第一章 盛夏来客", summary: "苏念失忆后独自来到清岚镇，盘下破旧的面馆「一碗春」。第一次见到隔壁中医馆的陆知行，两人因为排水管道问题大吵一架。", keyEvent: "女主到达小镇 · 男女主初遇", tag: "夏" },
          { title: "第二章 面馆开张", summary: "苏念改造面馆，只卖六种面。开张当天只来了三个客人，但做出的面让全镇轰动。王婶成了第一个常客。", keyEvent: "面馆立足 · 王婶登场", tag: "夏" },
          { title: "第三章 隔墙药香", summary: "面馆和中医馆只隔一面墙。苏念发现陆知行会在深夜默默把治跌打的药膏放在她门口。两人的关系从敌对变成了别扭的邻居。", keyEvent: "关系破冰 · 日常拌嘴开始", tag: "夏" },
          { title: "第四章 赶集日", summary: "苏念第一次参加清岚镇赶集，被小镇的烟火气治愈。在集市上意外看到一张旧照片，上面的小女孩像极了自己。", keyEvent: "融入小镇 · 第一条线索出现", tag: "夏" },
          { title: "第五章 秋天的桂花", summary: "院子里的百年桂花树开了，整条街都是香气。苏念用桂花入面，创出新品爆款。陆知行第一次主动来面馆吃面。", keyEvent: "暧昧萌芽 · 秋季开始", tag: "秋" },
          { title: "第六章 古戏台", summary: "王婶筹划中秋文艺汇演，苏念被推举为总导演。排练中发现古戏台后面的废弃化妆间，触发一段模糊的记忆闪回。", keyEvent: "记忆碎片 · 古戏台线索", tag: "秋" },
          { title: "第七章 竹林月色", summary: "苏念失眠夜游，撞见在后山竹林练八段锦的陆知行。两人在月下第一次敞开心扉，聊了很多。", keyEvent: "感情升温 · 互相了解", tag: "秋" },
          { title: "第八章 汇演之夜", summary: "中秋文艺汇演大成功，全镇出动。苏念在舞台上的光芒让陆知行确认了她的身份，但他选择沉默。演出结束后两人在古戏台对视。", keyEvent: "高光时刻 · 陆知行确认身份", tag: "秋" },
          { title: "第九章 冬日来信", summary: "一封从北京寄来的信打破了平静——苏念的前经纪人找到了她。陆知行变得沉默寡言，苏念感觉到异样。", keyEvent: "外界入侵 · 冬季转折", tag: "冬" },
          { title: "第十章 真相碎片", summary: "经纪人来到小镇，试图带苏念回去。在争执中透露了失忆的部分真相：那场'意外'并不简单。陆知行挺身而出。", keyEvent: "真相浮现 · 冲突升级", tag: "冬" },
          { title: "第十一章 信任裂痕", summary: "苏念发现陆知行早就知道她的身份却一直隐瞒。愤怒和被背叛的感觉让她关上了面馆的门。", keyEvent: "信任危机 · 低谷", tag: "冬" },
          { title: "第十二章 小鱼的眼泪", summary: "小鱼偷偷跑去中医馆质问陆知行，陈老用一个故事化解了误会的一部分。苏念在面馆院子里发现了时间胶囊。", keyEvent: "催化剂 · 时间胶囊", tag: "冬" },
          { title: "第十三章 春暖花开", summary: "打开时间胶囊，苏念终于想起了一切——她小时候在清岚镇度过的三年，和一个叫'小行'的男孩的约定。", keyEvent: "记忆恢复 · 真相大白", tag: "春" },
          { title: "第十四章 重逢与抉择", summary: "苏念面临选择：回到娱乐圈复仇，还是留在清岚镇。她选择先面对过去，用自己的方式解决问题。", keyEvent: "核心抉择 · 成长", tag: "春" },
          { title: "第十五章 一碗春再开张", summary: "苏念以真实身份重新开张面馆。外界的关注带来了纷扰，但小镇的人们站在了她身边。", keyEvent: "回归 · 新的开始", tag: "春" },
          { title: "第十六章 初夏的约定", summary: "一年轮回，又是盛夏。面馆门口多了一块新招牌：'一碗春·念念不忘'。陆知行在桂花树下说出了那句迟到的告白。", keyEvent: "告白 · HE", tag: "春" },
        ],
        tagColors: {
          "夏": "bg-orange-50 text-orange-500 border-orange-100",
          "秋": "bg-amber-50 text-amber-500 border-amber-100",
          "冬": "bg-sky-50 text-sky-500 border-sky-100",
          "春": "bg-green-50 text-green-500 border-green-100",
        },
      },
      marketing: {
        title: "分幕脚本",
        badge: "钩子→痛点→功能演示×3→转化收口",
        info: "6个分幕 · 40秒",
        chapters: [
          { title: "分幕1 · 开篇钩子与对比", summary: "左手普通耳机，右手隐形耳机。「Normal earbud, invisible earbud. See the difference?」", keyEvent: "0-5s · 视觉对比吸引注意力", tag: "0-5s" },
          { title: "分幕2 · 痛点触达", summary: "展示普通耳机的问题：大、显眼、运动容易掉。转折亮出隐形耳机。", keyEvent: "5-14s · 制造共鸣引发焦虑", tag: "5-14s" },
          { title: "分幕3 · 防水演示", summary: "水龙头下冲洗耳机特写。拿起来塞入耳朵，音乐响起。「Fully waterproof.」", keyEvent: "14-18s · 硬核测试制造惊叹", tag: "14-18s" },
          { title: "分幕4 · 降噪与保护", summary: "嘈杂场景→戴上耳机→世界安静。「Like the world just... goes quiet.」", keyEvent: "18-27s · 场景演示功能价值", tag: "18-27s" },
          { title: "分幕5 · 舒适度与设计", summary: "侧躺在沙发上，展示耳机贴合耳朵不突出。「Zero pressure. Can't even feel it.」", keyEvent: "27-32s · 舒适卖点+隐形再强调", tag: "27-32s" },
          { title: "分幕6 · 转化号召", summary: "展示三种颜色，价格字幕弹出。「Trust me, you need this. Link in bio.」", keyEvent: "32-40s · 多色+价格+强CTA", tag: "32-40s" },
        ],
        tagColors: {
          "0-5s": "bg-rose-50 text-rose-500 border-rose-100",
          "5-14s": "bg-orange-50 text-orange-500 border-orange-100",
          "14-18s": "bg-cyan-50 text-cyan-500 border-cyan-100",
          "18-27s": "bg-violet-50 text-violet-500 border-violet-100",
          "27-32s": "bg-emerald-50 text-emerald-500 border-emerald-100",
          "32-40s": "bg-amber-50 text-amber-500 border-amber-100",
        },
      },
      knowledge: {
        title: "结构化分析大纲",
        badge: "总览→设定→角色→结构→深度 · 五维拆解",
        info: "约8篇分析 · 每篇2000-3000字",
        chapters: [
          { title: "总览 · 诡秘世界全景", summary: "全书8卷的宏观结构分析。从篇幅分布、叙事节奏到情节密度。", keyEvent: "全景视角 · 框架认知", tag: "总览" },
          { title: "设定 · 22途径体系", summary: "22条非凡途径的完整梳理。途径关联图、序列对应表。", keyEvent: "核心设定 · 体系全貌", tag: "设定" },
          { title: "设定 · 消化与扮演", summary: "「扮演」法则的深度分析——规则本身、发现过程、对主角成长的影响。", keyEvent: "核心规则 · 深度解读", tag: "设定" },
          { title: "角色 · 克莱恩弧光", summary: "从第1章到最终章，克莱恩的完整性格演变曲线。", keyEvent: "主角分析 · 弧光追踪", tag: "角色" },
          { title: "角色 · 塔罗会群像", summary: "塔罗会全员的角色图鉴——每人的途径/性格/成长/贡献。", keyEvent: "群像分析 · 团队进化", tag: "角色" },
          { title: "结构 · 叙事手法", summary: "伏笔回收机制、多线并行技巧、节奏控制、悬念设置。", keyEvent: "写作技巧 · 叙事分析", tag: "结构" },
          { title: "深度 · 隐藏暗线", summary: "全书最隐蔽的伏笔和暗线整理。第1章的梦境在终章才解读。", keyEvent: "暗线考据 · 硬核挖掘", tag: "深度" },
          { title: "报告 · 拆书总结", summary: "综合所有分析，输出完整拆书报告。包含评分、推荐理由。", keyEvent: "终稿 · 完整报告", tag: "报告" },
        ],
        tagColors: {
          "总览": "bg-indigo-50 text-indigo-500 border-indigo-100",
          "设定": "bg-purple-50 text-purple-500 border-purple-100",
          "角色": "bg-rose-50 text-rose-500 border-rose-100",
          "结构": "bg-cyan-50 text-cyan-500 border-cyan-100",
          "深度": "bg-amber-50 text-amber-500 border-amber-100",
          "报告": "bg-green-50 text-green-500 border-green-100",
        },
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storeOutline = agentStageData?.outline as any;
    const ol: {
      title: string;
      badge: string;
      info: string;
      chapters: { title: string; summary: string; keyEvent: string; tag: string }[];
      tagColors: Record<string, string>;
    } = storeOutline
      ? {
          title: scene === "marketing" ? "分幕脚本" : scene === "knowledge" ? "结构化分析大纲" : "故事大纲",
          badge: storeOutline.structure || "",
          info: `${storeOutline.totalChapters || storeOutline.chapters?.length || 0}章 · ${storeOutline.estimatedWords || ""}`,
          chapters: (storeOutline.chapters || []).map((ch: { title: string; summary: string; keyEvent: string }, i: number) => ({
            ...ch,
            tag: `${i + 1}`,
          })),
          tagColors: {} as Record<string, string>,
        }
      : (outlineData[scene] || outlineData.novel);

    return (
      <div className="h-full flex flex-col">
        {editor && <EditorToolbar editor={editor} />}
        <div className="flex-1 overflow-y-auto px-10 py-8 relative" ref={editorWrapRef} onMouseUp={handleMouseUpSelection}>
          {/* Floating Selection Toolbar for stage 1-4 */}
          {floatingToolbar.show && (
            <FloatingSelectionToolbar
              top={floatingToolbar.top}
              left={floatingToolbar.left}
              editor={editor}
              showAIMenu={showAIMenu}
              setShowAIMenu={setShowAIMenu}
              onAIAction={handleAIAction}
              onCopy={handleSelectionCopy}
              showToast={showToast}
            />
          )}

          <div className="max-w-2xl mx-auto space-y-8" style={{ outline: "none" }}>
            {/* ── 各阶段内容展示 ── */}
            {showOutline ? (
              <>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{ol.title}</h2>
                  <p className="text-xs text-gray-400">如需修改，请在右侧对话中告诉我</p>
                </div>

                {/* 结构信息 */}
                <div>
                  <span className="text-sm font-bold text-gray-700">{ol.badge}</span>
                  <span className="text-sm text-gray-500 ml-3">{ol.info}</span>
                </div>

                {/* 章节列表 */}
                <div className="space-y-5">
                  {ol.chapters.map((ch, i) => (
                      <div key={i}>
                        <div className="mb-1">
                          <span className="text-xs font-bold text-gray-500 mr-2">[{ch.tag}]</span>
                          <span className="text-sm font-bold text-gray-800">{ch.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-1">{ch.summary}</p>
                        <p className="text-xs text-gray-400">{ch.keyEvent}</p>
                      </div>
                  ))}
                </div>
              </>
            ) : showCharacters ? (
              <>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{chars.title}</h2>
                  <p className="text-xs text-gray-400">如需修改，请在右侧对话中告诉我</p>
                </div>

                {/* Lead A */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">
                    {chars.leadATitle}
                  </h3>
                  <div className="space-y-2 ml-1">
                    <div>
                      <span className="text-base font-bold text-gray-900">{chars.leadA.name}</span>
                      {chars.leadA.subtitle && <span className="text-xs text-gray-400 ml-2">{chars.leadA.subtitle}</span>}
                    </div>
                    {chars.leadA.items.map((item) => (
                      <div key={item.label}>
                        <span className="text-xs font-bold text-gray-500">{item.label}：</span>
                        <span className="text-sm text-gray-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead B */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">
                    {chars.leadBTitle}
                  </h3>
                  <div className="space-y-2 ml-1">
                    <div>
                      <span className="text-base font-bold text-gray-900">{chars.leadB.name}</span>
                      {chars.leadB.subtitle && <span className="text-xs text-gray-400 ml-2">{chars.leadB.subtitle}</span>}
                    </div>
                    {chars.leadB.items.map((item) => (
                      <div key={item.label}>
                        <span className="text-xs font-bold text-gray-500">{item.label}：</span>
                        <span className="text-sm text-gray-700">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supporting */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">
                    {chars.supportingTitle}
                  </h3>
                  <div className="space-y-3 ml-1">
                    {chars.supporting.map((c) => (
                      <div key={c.name}>
                        <span className="text-sm font-bold text-gray-800">{c.name}</span>
                        <span className="text-xs text-gray-400 ml-2">{c.role}</span>
                        <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 人物关系 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">
                    人物关系
                  </h3>
                  <div className="space-y-1.5 ml-1">
                    {chars.relationships.split("\n").map((line, i) => (
                      <p key={i} className="text-sm text-gray-700 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              </>
            ) : showWorldbuilding ? (
              <>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{wb.title}</h2>
                  <p className="text-xs text-gray-400">如需修改，请在右侧对话中告诉我</p>
                </div>

                {/* 故事世界 + 时间线 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">
                    {wb.title}
                  </h3>
                  <div className="space-y-4 ml-1">
                    <div>
                      <span className="text-xs font-bold text-gray-500 block mb-1">{wb.summaryLabel}</span>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {wb.summary}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-500 block mb-1">{wb.timelineLabel}</span>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {wb.timeline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 核心场景 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">
                    {wb.scenesTitle}
                  </h3>
                  <div className="space-y-3 ml-1">
                    {wb.scenes.map((s) => (
                      <div key={s.name}>
                        <span className="text-sm font-bold text-gray-800 block mb-0.5">{s.name}</span>
                        <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 社会生态 / 平台策略 / 分析特征 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">
                    {wb.ecologyTitle}
                  </h3>
                  <ul className="space-y-1.5 ml-1">
                    {wb.ecology.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed">
                        · {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 隐藏线索 / 关键洞察 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">
                    {wb.cluesTitle}
                  </h3>
                  <ul className="space-y-1.5 ml-1">
                    {wb.clues.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed">
                        · {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              /* ── 设定展示 ── */
              <>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{settingsTitle}</h2>
                  <p className="text-xs text-gray-400">{settingsSubtitle}</p>
                </div>

                {settingsData.map((section) => (
                  <div key={section.group}>
                    <h3 className="text-sm font-bold text-gray-700 mb-3">
                      {section.group}
                    </h3>
                    {section.type === "text" ? (
                      <div className="space-y-4 ml-1">
                        {section.items.map((item) => (
                          <div key={item.label}>
                            <span className="text-xs font-bold text-gray-500 block mb-1">{item.label}</span>
                            <p className="text-sm text-gray-700 leading-relaxed">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 ml-1">
                        {section.items.map((item) => (
                          <div key={item.label}>
                            <span className="text-sm font-bold text-gray-500">{item.label}：</span>
                            <span className="text-sm text-gray-700">{item.value.split(" · ").join("、")}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Expand to fullscreen button */}
          <div className="flex justify-end mt-4 max-w-2xl mx-auto">
            <button
              onClick={() => {
                // Build HTML from current stage content
                let html = "";
                if (showOutline) {
                  html += `<h2>${ol.title}</h2>`;
                  html += `<p><strong>${ol.badge}</strong> ${ol.info}</p>`;
                  ol.chapters.forEach((ch) => {
                    html += `<h3>[${ch.tag}] ${ch.title}</h3>`;
                    html += `<p>${ch.summary}</p>`;
                    html += `<p><em>${ch.keyEvent}</em></p>`;
                  });
                } else if (showCharacters) {
                  html += `<h2>${chars.title}</h2>`;
                  html += `<h3>${chars.leadATitle}</h3>`;
                  html += `<p><strong>${chars.leadA.name}</strong>${chars.leadA.subtitle ? ` ${chars.leadA.subtitle}` : ""}</p>`;
                  chars.leadA.items.forEach((item) => { html += `<p><strong>${item.label}：</strong>${item.value}</p>`; });
                  html += `<h3>${chars.leadBTitle}</h3>`;
                  html += `<p><strong>${chars.leadB.name}</strong>${chars.leadB.subtitle ? ` ${chars.leadB.subtitle}` : ""}</p>`;
                  chars.leadB.items.forEach((item) => { html += `<p><strong>${item.label}：</strong>${item.value}</p>`; });
                  html += `<h3>${chars.supportingTitle}</h3>`;
                  chars.supporting.forEach((c) => { html += `<p><strong>${c.name}</strong> ${c.role}</p><p>${c.desc}</p>`; });
                  html += `<h3>人物关系</h3>`;
                  chars.relationships.split("\n").forEach((line) => { html += `<p>${line}</p>`; });
                } else if (showWorldbuilding) {
                  html += `<h2>${wb.title}</h2>`;
                  html += `<p><strong>${wb.summaryLabel}</strong></p><p>${wb.summary}</p>`;
                  html += `<p><strong>${wb.timelineLabel}</strong></p><p>${wb.timeline}</p>`;
                  html += `<h3>${wb.scenesTitle}</h3>`;
                  wb.scenes.forEach((s) => { html += `<p><strong>${s.name}</strong></p><p>${s.desc}</p>`; });
                  html += `<h3>${wb.ecologyTitle}</h3>`;
                  wb.ecology.forEach((item) => { html += `<p>· ${item}</p>`; });
                  html += `<h3>${wb.cluesTitle}</h3>`;
                  wb.clues.forEach((item) => { html += `<p>· ${item}</p>`; });
                } else {
                  html += `<h2>${settingsTitle}</h2>`;
                  settingsData.forEach((section) => {
                    html += `<h3>${section.group}</h3>`;
                    if (section.type === "text") {
                      section.items.forEach((item) => { html += `<p><strong>${item.label}</strong></p><p>${item.value}</p>`; });
                    } else {
                      section.items.forEach((item) => { html += `<p><strong>${item.label}：</strong>${item.value.split(" · ").join("、")}</p>`; });
                    }
                  });
                }
                fullscreenEditor?.commands.setContent(html);
                setFullscreenEdit(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition"
              title="全屏编辑"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Fullscreen editing overlay */}
        {fullscreenEdit && (
          <div className="fixed inset-0 z-50 bg-gray-900/60 flex items-center justify-center" onClick={() => setFullscreenEdit(false)}>
            <div
              className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[900px] h-[85vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with stage title */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">
                  {showOutline ? (scene === "marketing" ? "描述视频分幕脚本" : scene === "knowledge" ? "描述结构化分析大纲" : "描述故事背景、故事线、核心冲突等") : showCharacters ? "描述角色档案" : showWorldbuilding ? "描述世界观、场景、时间线等" : "描述故事背景、故事线、核心冲突等"}
                </p>
              </div>

              {/* Editor toolbar */}
              {fullscreenEditor && (
                <div className="px-6 py-2 border-b border-gray-50 flex items-center gap-1">
                  <button onClick={() => fullscreenEditor.chain().focus().undo().run()} className="p-1.5 rounded hover:bg-gray-100 text-gray-400" title="撤销">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
                  </button>
                  <button onClick={() => fullscreenEditor.chain().focus().redo().run()} className="p-1.5 rounded hover:bg-gray-100 text-gray-400" title="重做">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
                  </button>
                  <div className="w-px h-4 bg-gray-200 mx-1" />
                  <div className="relative">
                    <button
                      onClick={() => {
                        const menu = document.getElementById("fs-heading-menu");
                        if (menu) menu.classList.toggle("hidden");
                      }}
                      className={`flex items-center gap-0 p-1.5 rounded transition ${fullscreenEditor.isActive("heading") ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100"}`}
                    >
                      <span className="text-sm font-medium">T</span>
                      <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
                    </button>
                    <div id="fs-heading-menu" className="hidden absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-32 z-30">
                      {[
                        { label: "正文", action: () => fullscreenEditor.chain().focus().setParagraph().run() },
                        { label: "H1 一级标题", action: () => fullscreenEditor.chain().focus().toggleHeading({ level: 1 }).run() },
                        { label: "H2 二级标题", action: () => fullscreenEditor.chain().focus().toggleHeading({ level: 2 }).run() },
                        { label: "H3 三级标题", action: () => fullscreenEditor.chain().focus().toggleHeading({ level: 3 }).run() },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => { opt.action(); document.getElementById("fs-heading-menu")?.classList.add("hidden"); }}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => fullscreenEditor.chain().focus().toggleBold().run()} className={`p-1.5 rounded transition ${fullscreenEditor.isActive("bold") ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100"}`} title="加粗">
                    <span className="text-sm font-bold">B</span>
                  </button>
                  <button onClick={() => fullscreenEditor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded transition ${fullscreenEditor.isActive("italic") ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100"}`} title="斜体">
                    <span className="text-sm italic">I</span>
                  </button>
                  <button onClick={() => fullscreenEditor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded transition ${fullscreenEditor.isActive("strike") ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100"}`} title="删除线">
                    <span className="text-sm line-through">S</span>
                  </button>
                  <button onClick={() => fullscreenEditor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded transition ${fullscreenEditor.isActive("underline") ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100"}`} title="下划线">
                    <span className="text-sm underline">U</span>
                  </button>
                </div>
              )}

              {/* Editor content area */}
              <div className="flex-1 overflow-y-auto relative" ref={fullscreenWrapRef}>
                {fsFloatingToolbar.show && (
                  <FloatingSelectionToolbar
                    top={fsFloatingToolbar.top}
                    left={fsFloatingToolbar.left}
                    editor={fullscreenEditor}
                    showAIMenu={fsShowAIMenu}
                    setShowAIMenu={setFsShowAIMenu}
                    onAIAction={handleFsAIAction}
                    onCopy={handleFsSelectionCopy}
                    showToast={showToast}
                  />
                )}
                <div className="max-w-3xl mx-auto py-6">
                  {fullscreenEditor && <EditorContent editor={fullscreenEditor} />}
                </div>
              </div>

              {/* Bottom bar: input + exit button */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200">
                  <input
                    type="text"
                    placeholder="输入改写要求"
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        showToast("改写功能演示中...");
                      }
                    }}
                  />
                  <button
                    onClick={() => showToast("改写功能演示中...")}
                    className="p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
                <button
                  onClick={() => setFullscreenEdit(false)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition whitespace-nowrap"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  退出全屏
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Atmosphere Enhancement Dialog for stage 1-4 */}
        {atmosphereDialog.show && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/10">
            <div className="bg-white rounded-xl shadow-2xl border w-[440px] max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">AI 调整</span>
                {!atmosphereDialog.generating && (
                  <button onClick={() => setAtmosphereDialog({ show: false, text: "", generating: false, result: "", actionLabel: "" })} className="text-gray-400 hover:text-gray-600 text-xs">关闭</button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="flex justify-end">
                  <div className="bg-indigo-50 rounded-lg px-3 py-2 max-w-[80%]">
                    <p className="text-xs text-indigo-600 font-medium">{atmosphereDialog.actionLabel || "AI 调整"}</p>
                    <p className="text-xs text-gray-500 mt-0.5">「{atmosphereDialog.text}」</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {atmosphereDialog.result}
                    {atmosphereDialog.generating && <span className="ai-cursor" />}
                  </p>
                </div>
              </div>
              {!atmosphereDialog.generating && atmosphereDialog.result && (
                <div className="px-4 py-3 border-t border-gray-100 flex gap-4">
                  <button onClick={() => { showToast("已替换"); setAtmosphereDialog({ show: false, text: "", generating: false, result: "", actionLabel: "" }); }} className="text-sm text-gray-700 hover:text-indigo-600 transition">替换原文</button>
                  <button onClick={handleCopyResult} className="text-sm text-gray-700 hover:text-indigo-600 transition">复制</button>
                  <button onClick={handleRegenerate} className="text-sm text-gray-700 hover:text-indigo-600 transition">换一换</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Writing mode: chapter editor with collapsible TOC
  if ((scene === "novel" || scene === "screenplay" || scene === "marketing" || scene === "knowledge") && creationStage >= 5 && novelChapters.length > 0) {

    return (
      <div className="h-full flex flex-col relative">
        {editor && <EditorToolbar editor={editor} />}

        <div className="flex-1 flex overflow-hidden relative">
          {/* TOC toggle button */}
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="absolute top-3 left-3 z-30 w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition text-gray-500"
            title="章节目录"
          >
            <List className="w-4 h-4" />
          </button>

          {/* TOC overlay panel */}
          {tocOpen && (
            <>
              <div className="absolute inset-0 z-20" onClick={() => setTocOpen(false)} />
              <div className="absolute top-0 left-0 z-30 w-56 h-full bg-white border-r border-gray-200 shadow-lg overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">章节目录</span>
                  <button onClick={() => setTocOpen(false)} className="text-gray-400 hover:text-gray-600 text-xs">
                    收起
                  </button>
                </div>
                <div className="py-1">
                  {novelChapters.map((ch, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const el = document.getElementById(`chapter-${i}`);
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        setCurrentNovelChapter(i);
                        setTocOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 transition text-sm ${
                        i === currentNovelChapter
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {ch.status === "done" ? (
                        <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      ) : ch.status === "generating" ? (
                        <Loader2 className="w-3.5 h-3.5 text-blue-500 shrink-0 animate-spin" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-gray-200 shrink-0" />
                      )}
                      <span className="truncate">{ch.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Editor area — show current chapter only */}
          <div className="flex-1 overflow-y-auto px-8 py-6 pl-14 relative" ref={editorWrapRef} onMouseUp={handleMouseUpSelection}>
            {/* Floating Selection Toolbar for writing mode */}
            {floatingToolbar.show && (
              <FloatingSelectionToolbar
                top={floatingToolbar.top}
                left={floatingToolbar.left}
                editor={editor}
                showAIMenu={showAIMenu}
                setShowAIMenu={setShowAIMenu}
                onAIAction={handleAIAction}
                onCopy={handleSelectionCopy}
                showToast={showToast}
              />
            )}
            <div className="max-w-3xl mx-auto">
              {(() => {
                // Find the "active" chapter: the latest generating, or the last done
                const activeIdx = novelChapters.findIndex((c) => c.status === "generating");
                const latestIdx = activeIdx >= 0 ? activeIdx : novelChapters.reduce((acc, c, idx) => c.status === "done" ? idx : acc, 0);

                return novelChapters.map((ch, i) => {
                  if (ch.status === "pending") return null;
                  // Hide previous chapters unless user clicked "查看上文"
                  if (i < latestIdx && !showPreviousChapters) return null;
                  const isChGenerating = ch.status === "generating";
                  return (
                    <div key={i} id={`chapter-${i}`} className="mb-12">
                      {/* Show "查看上文" button at top of active chapter */}
                      {i === latestIdx && latestIdx > 0 && !showPreviousChapters && (
                        <button
                          onClick={() => setShowPreviousChapters(true)}
                          className="mb-6 text-xs text-indigo-500 hover:text-indigo-700 transition flex items-center gap-1"
                        >
                          <span>↑</span> 查看前面的章节
                        </button>
                      )}
                      {/* Chapter title */}
                      <h2 className="text-lg font-bold text-gray-900 mb-1">{ch.title}</h2>
                      <p className="text-xs text-gray-400 mb-4">
                        {isChGenerating ? "正在生成中..." : ch.status === "done" ? "已生成，可直接编辑" : ""}
                      </p>

                      {/* Chapter content */}
                      {ch.content ? (
                        <div className="prose prose-sm max-w-none">
                          {isChGenerating ? (
                            <div className="text-sm text-gray-700 leading-[1.8] whitespace-pre-wrap">
                              {ch.content}
                              <span className="inline-block w-0.5 h-4 bg-indigo-500 animate-pulse ml-0.5 align-middle" />
                            </div>
                          ) : (
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onInput={(e) => setNovelChapterContent(i, (e.target as HTMLDivElement).innerText)}
                              className="w-full text-sm text-gray-700 leading-[1.8] outline-none bg-transparent whitespace-pre-wrap"
                            >
                              {ch.content}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-300 italic">等待生成...</div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Floating Bottom Action Bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 max-w-[90%]">
          <div className="inline-flex items-center gap-0.5 bg-white/95 backdrop-blur-sm rounded-full shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-gray-100/80 px-2.5 py-1.5 whitespace-nowrap">
            <button
              onClick={() => showToast("调整风格功能演示中...")}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] text-gray-800 rounded-full hover:bg-gray-50 transition"
            >
              <Palette className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>调整风格</span>
              <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
            </button>
            <button
              onClick={() => showToast("调整长度功能演示中...")}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] text-gray-800 rounded-full hover:bg-gray-50 transition"
            >
              <MoveHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>调整长度</span>
              <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
            </button>
            <button
              onClick={() => showToast("全文润色中...")}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] text-gray-800 rounded-full hover:bg-gray-50 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>全文润色</span>
            </button>
            <button
              onClick={() => showToast("重新生成中...")}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] text-gray-800 rounded-full hover:bg-gray-50 transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span>重新生成</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show outline if in outline mode (novel only)
  if (leftView === "outline" && scene !== "general" && !isSimpleScene) {
    return (
      <div className="h-full overflow-y-auto px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">内容大纲</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
            {outline || "点击左侧「生成总纲」开始生成大纲"}
          </pre>
        </div>
      </div>
    );
  }

  if (!editor) return null;

  return (
    <div className="h-full flex flex-col relative">
      <div className="relative z-10">
        <EditorToolbar editor={editor} />
      </div>

      <div className="flex-1 overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-y-auto" ref={editorWrapRef}>
        <div className="max-w-4xl mx-auto px-4 relative">
          {scene !== "general" && !isSimpleScene && currentChapter && !editorIsEmpty && (
            <h2 className="text-lg font-bold text-gray-800 px-8 pt-6">
              {currentChapter.title}
            </h2>
          )}

          {/* Floating Selection Toolbar */}
          {floatingToolbar.show && (
            <FloatingSelectionToolbar
              top={floatingToolbar.top}
              left={floatingToolbar.left}
              editor={editor}
              showAIMenu={showAIMenu}
              setShowAIMenu={setShowAIMenu}
              onAIAction={handleAIAction}
              onCopy={handleSelectionCopy}
              showToast={showToast}
            />
          )}

          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Floating Bottom Action Bar - hide when no mode selected or Agent pre-正文 */}
      {!((scene === "novel" || scene === "screenplay" || scene === "marketing" || scene === "knowledge") && (workMode === null || (workMode === "agent" && creationStage < 5))) && (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 max-w-[90%]">
        <div className="inline-flex items-center gap-0.5 bg-white/95 backdrop-blur-sm rounded-full shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-gray-100/80 px-2.5 py-1.5 whitespace-nowrap">
          {/* Group 1: AI 调整功能 */}
          <button
            onClick={() => showToast("调整风格功能演示中...")}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] text-gray-800 rounded-full hover:bg-gray-50 transition"
          >
            <Palette className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span>调整风格</span>
            <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
          </button>
          <button
            onClick={() => showToast("调整长度功能演示中...")}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] text-gray-800 rounded-full hover:bg-gray-50 transition"
          >
            <MoveHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span>调整长度</span>
            <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
          </button>
          <button
            onClick={() => showToast("全文润色中...")}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] text-gray-800 rounded-full hover:bg-gray-50 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            <span>全文润色</span>
          </button>
          <button
            onClick={() => showToast("重新生成中...")}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] text-gray-800 rounded-full hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>重新生成</span>
          </button>
        </div>
      </div>
      )}

      {/* Atmosphere Enhancement Dialog */}
      {atmosphereDialog.show && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/10">
          <div
            className="bg-white rounded-xl shadow-2xl border w-[440px] max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                ✨ AI 调整
              </span>
              {!atmosphereDialog.generating && (
                <button
                  onClick={() =>
                    setAtmosphereDialog({
                      show: false,
                      text: "",
                      generating: false,
                      result: "",
                      actionLabel: "",
                    })
                  }
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  关闭
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex justify-end">
                <div className="bg-indigo-50 rounded-lg px-3 py-2 max-w-[80%]">
                  <p className="text-xs text-indigo-600 font-medium">
                    {atmosphereDialog.actionLabel || "氛围增强"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    「{atmosphereDialog.text}」
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {atmosphereDialog.result}
                  {atmosphereDialog.generating && (
                    <span className="ai-cursor" />
                  )}
                </p>
              </div>
            </div>

            {!atmosphereDialog.generating && atmosphereDialog.result && (
              <div className="px-4 py-3 border-t border-gray-100 flex gap-4">
                <button
                  onClick={handleReplace}
                  className="text-sm text-gray-700 hover:text-indigo-600 transition"
                >
                  替换原文
                </button>
                <button
                  onClick={handleCopyResult}
                  className="text-sm text-gray-700 hover:text-indigo-600 transition"
                >
                  复制
                </button>
                <button
                  onClick={handleRegenerate}
                  className="text-sm text-gray-700 hover:text-indigo-600 transition"
                >
                  换一换
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
