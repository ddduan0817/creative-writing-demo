"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";
import { useEffect, useState, useCallback, useRef } from "react";
import { getSceneMockResponses } from "@/data/mockAIResponses";
import { simulateAIStream } from "@/lib/aiSimulator";
import {
  Wand2,
  ChevronDown,
  RefreshCw,
  MoveHorizontal,
  Palette,
  Sparkles,
  Send,
  List,
  Check,
  Loader2,
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
  } = useEditorStore();

  const currentChapter = chapters.find((c) => c.id === currentChapterId);
  const isSimpleScene = scene === "marketing" || scene === "knowledge";
  const [tocOpen, setTocOpen] = useState(false);
  const [floatingToolbar, setFloatingToolbar] = useState<{
    show: boolean;
    top: number;
    left: number;
  }>({ show: false, top: 0, left: 0 });
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
          top: rect.bottom - wrapRect.top + editorWrapRef.current.scrollTop + 8,
          left: rect.right - wrapRect.left - 280,
        });
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

  const handleAIAction = useCallback(
    (action: string) => {
      if (!editor) return;
      setFloatingToolbar((p) => ({ ...p, show: false }));

      const selectedText =
        editor.state.doc.textBetween(
          editor.state.selection.from,
          editor.state.selection.to,
          " "
        ) || "";

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

  // Check if editor is empty
  const editorIsEmpty = !editor?.getText().trim();

  // Agent flow: show settings/worldbuilding in editor (read-only)
  if ((scene === "novel" || scene === "screenplay" || scene === "marketing" || scene === "knowledge") && creationStage >= 1 && creationStage <= 4) {
    // creationStage 1 = 设定, 2 = 世界观, 3 = 角色, 4 = 大纲, 5 = 正文(退出只读)
    const showWorldbuilding = creationStage === 2;
    const showCharacters = creationStage === 3;
    const showOutline = creationStage >= 4;

    const settingsData = [
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

    return (
      <div className="h-full flex flex-col">
        {editor && <EditorToolbar editor={editor} />}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="max-w-2xl mx-auto space-y-8" contentEditable suppressContentEditableWarning style={{ outline: "none" }}>
            {/* ── 各阶段内容展示 ── */}
            {showOutline ? (
              <>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">故事大纲</h2>
                  <p className="text-xs text-gray-400">可直接编辑修改，也可在对话中修改</p>
                </div>

                {/* 结构信息 */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm rounded-full font-medium">四季章回 · 甜中带虐</span>
                  <span className="text-sm text-gray-400">16章 · 约12万字</span>
                </div>

                {/* 章节列表 */}
                <div className="space-y-4">
                  {[
                    { title: "第一章 盛夏来客", summary: "苏念失忆后独自来到清岚镇，盘下破旧的面馆「一碗春」。第一次见到隔壁中医馆的陆知行，两人因为排水管道问题大吵一架。", keyEvent: "女主到达小镇 · 男女主初遇", season: "夏" },
                    { title: "第二章 面馆开张", summary: "苏念改造面馆，只卖六种面。开张当天只来了三个客人，但做出的面让全镇轰动。王婶成了第一个常客。", keyEvent: "面馆立足 · 王婶登场", season: "夏" },
                    { title: "第三章 隔墙药香", summary: "面馆和中医馆只隔一面墙。苏念发现陆知行会在深夜默默把治跌打的药膏放在她门口。两人的关系从敌对变成了别扭的邻居。", keyEvent: "关系破冰 · 日常拌嘴开始", season: "夏" },
                    { title: "第四章 赶集日", summary: "苏念第一次参加清岚镇赶集，被小镇的烟火气治愈。在集市上意外看到一张旧照片，上面的小女孩像极了自己。", keyEvent: "融入小镇 · 第一条线索出现", season: "夏" },
                    { title: "第五章 秋天的桂花", summary: "院子里的百年桂花树开了，整条街都是香气。苏念用桂花入面，创出新品爆款。陆知行第一次主动来面馆吃面。", keyEvent: "暧昧萌芽 · 秋季开始", season: "秋" },
                    { title: "第六章 古戏台", summary: "王婶筹划中秋文艺汇演，苏念被推举为总导演。排练中发现古戏台后面的废弃化妆间，触发一段模糊的记忆闪回。", keyEvent: "记忆碎片 · 古戏台线索", season: "秋" },
                    { title: "第七章 竹林月色", summary: "苏念失眠夜游，撞见在后山竹林练八段锦的陆知行。两人在月下第一次敞开心扉，聊了很多。", keyEvent: "感情升温 · 互相了解", season: "秋" },
                    { title: "第八章 汇演之夜", summary: "中秋文艺汇演大成功，全镇出动。苏念在舞台上的光芒让陆知行确认了她的身份，但他选择沉默。演出结束后两人在古戏台对视。", keyEvent: "高光时刻 · 陆知行确认身份", season: "秋" },
                    { title: "第九章 冬日来信", summary: "一封从北京寄来的信打破了平静——苏念的前经纪人找到了她。陆知行变得沉默寡言，苏念感觉到异样。", keyEvent: "外界入侵 · 冬季转折", season: "冬" },
                    { title: "第十章 真相碎片", summary: "经纪人来到小镇，试图带苏念回去。在争执中透露了失忆的部分真相：那场'意外'并不简单。陆知行挺身而出。", keyEvent: "真相浮现 · 冲突升级", season: "冬" },
                    { title: "第十一章 信任裂痕", summary: "苏念发现陆知行早就知道她的身份却一直隐瞒。愤怒和被背叛的感觉让她关上了面馆的门。", keyEvent: "信任危机 · 低谷", season: "冬" },
                    { title: "第十二章 小鱼的眼泪", summary: "小鱼偷偷跑去中医馆质问陆知行，陈老用一个故事化解了误会的一部分。苏念在面馆院子里发现了时间胶囊。", keyEvent: "催化剂 · 时间胶囊", season: "冬" },
                    { title: "第十三章 春暖花开", summary: "打开时间胶囊，苏念终于想起了一切——她小时候在清岚镇度过的三年，和一个叫'小行'的男孩的约定。", keyEvent: "记忆恢复 · 真相大白", season: "春" },
                    { title: "第十四章 重逢与抉择", summary: "苏念面临选择：回到娱乐圈复仇，还是留在清岚镇。她选择先面对过去，用自己的方式解决问题。", keyEvent: "核心抉择 · 成长", season: "春" },
                    { title: "第十五章 一碗春再开张", summary: "苏念以真实身份重新开张面馆。外界的关注带来了纷扰，但小镇的人们站在了她身边。", keyEvent: "回归 · 新的开始", season: "春" },
                    { title: "第十六章 初夏的约定", summary: "一年轮回，又是盛夏。面馆门口多了一块新招牌：'一碗春·念念不忘'。陆知行在桂花树下说出了那句迟到的告白。", keyEvent: "告白 · HE", season: "春" },
                  ].map((ch, i) => {
                    const seasonColors: Record<string, string> = {
                      "夏": "bg-orange-50 text-orange-500 border-orange-100",
                      "秋": "bg-amber-50 text-amber-500 border-amber-100",
                      "冬": "bg-sky-50 text-sky-500 border-sky-100",
                      "春": "bg-green-50 text-green-500 border-green-100",
                    };
                    return (
                      <div key={i} className="bg-gray-50/60 rounded-lg p-4">
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className={`px-2 py-0.5 text-[10px] rounded-full border font-medium ${seasonColors[ch.season] || ""}`}>
                            {ch.season}
                          </span>
                          <h4 className="text-sm font-semibold text-gray-800">{ch.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-2">{ch.summary}</p>
                        <p className="text-xs text-indigo-400">{ch.keyEvent}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : showCharacters ? (
              <>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">角色档案</h2>
                  <p className="text-xs text-gray-400">可直接编辑修改，也可在对话中修改</p>
                </div>

                {/* 女主角 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    女主角
                  </h3>
                  <div className="bg-purple-50/50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-base font-bold text-purple-600">苏念</span>
                      <span className="text-xs text-gray-400 ml-2">小名念念</span>
                    </div>
                    {[
                      { label: "身份", value: "前当红影后，现清岚镇「一碗春」面馆老板娘" },
                      { label: "性格", value: "外柔内刚，失忆后展现出天然的亲和力和不服输的韧劲" },
                      { label: "外貌", value: "杏眼桃腮，常扎麻花辫，最爱穿素色棉麻围裙" },
                      { label: "习惯", value: "做面时会无意识哼歌，那首歌是她失忆前拍戏时的插曲" },
                      { label: "秘密", value: "随身带着一枚旧铜钥匙，不知道它能打开什么" },
                    ].map((item) => (
                      <div key={item.label} className="flex gap-3">
                        <span className="text-xs text-purple-400 w-10 shrink-0 pt-0.5">{item.label}</span>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 男主角 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    男主角
                  </h3>
                  <div className="bg-blue-50/50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="text-base font-bold text-blue-600">陆知行</span>
                    </div>
                    {[
                      { label: "身份", value: "济世堂第四代传人，清岚镇唯一的中医" },
                      { label: "性格", value: "沉默寡言但行动力强，面对苏念时语气会不自觉变软" },
                      { label: "外貌", value: "清瘦高挑，常穿白衬衫，手指修长带着淡淡药香" },
                      { label: "习惯", value: "深夜在后山竹林练八段锦，是他唯一的独处时间" },
                      { label: "秘密", value: "认出了苏念的真实身份，但选择沉默守护她的平静生活" },
                    ].map((item) => (
                      <div key={item.label} className="flex gap-3">
                        <span className="text-xs text-blue-400 w-10 shrink-0 pt-0.5">{item.label}</span>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 关键配角 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    关键配角
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "王婶", role: "镇长 / 非官方媒人", desc: "热心到让人招架不住，全镇姻缘她操了一半的心。口头禅：'我看你俩啊…'" },
                      { name: "老张", role: "杂货店老板", desc: "话痨担当，消息灵通，是小镇的情报中心。什么事都瞒不过他的八卦雷达" },
                      { name: "陈老", role: "茶馆掌柜", desc: "看似糊涂的智者，泡茶时偶尔一句话就能点醒所有人" },
                      { name: "小鱼", role: "面馆学徒", desc: "16岁留守少年，把苏念当亲姐姐。是日常线的萌点担当，也是情感催化剂" },
                    ].map((c) => (
                      <div key={c.name} className="bg-gray-50/60 rounded-lg p-3.5">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-amber-600">{c.name}</span>
                          <span className="text-[11px] text-gray-400">{c.role}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 人物关系 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    人物关系
                  </h3>
                  <div className="space-y-2">
                    {"苏念 × 陆知行：欢喜冤家 → 暗生情愫 → 互相守护\n王婶 → 全镇：操心一切，推动主线发展\n小鱼 → 苏念：姐弟情深，治愈线担当\n陈老 → 陆知行：亦师亦友，关键时刻点拨".split("\n").map((line, i) => (
                      <p key={i} className="text-sm text-gray-700 leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>
              </>
            ) : showWorldbuilding ? (
              <>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">世界观</h2>
                  <p className="text-xs text-gray-400">可直接编辑修改，也可在对话中修改</p>
                </div>

                {/* 故事世界 + 时间线 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    故事世界
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-medium text-gray-400 block mb-1">世界概述</span>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        当代中国南方小镇「清岚镇」——一个依山傍水的千年古镇，青石板路、白墙黑瓦，手机信号时有时无。年轻人大多外出谋生，留下的都是老人和几个「不愿离开的怪人」。
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-400 block mb-1">时间线</span>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        故事跨越一年四季，从盛夏到次年初夏。四季变化推动情感发展：夏天相遇→秋天暧昧→冬天误会→春天和解→初夏告白。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 核心场景 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    核心场景
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "清岚镇·主街", desc: "唯一的主街，两侧是各种老字号店铺。早上有赶早市的吆喝声，傍晚有归家的炊烟。街尾是一棵三百年的老榕树，树下有石桌石凳，是全镇的八卦中心。" },
                      { name: "一碗春面馆", desc: "女主盘下的老面馆，前店后院。院子里有棵百年老桂花树，秋天整条街都能闻到香气。面馆只卖六种面，每天限量，卖完就关门。" },
                      { name: "济世堂中医馆", desc: "男主经营的祖传中医馆，就在面馆隔壁。一墙之隔，药香和面香混在一起。男主话少但医术高明，半个镇子的人都找他看病。" },
                      { name: "古戏台", desc: "镇中心的百年老戏台，逢年过节唱戏。后来成了女主组织文艺汇演的舞台，也是两人关系转折的重要场所。戏台背后有一间废弃的化妆间，藏着女主童年的秘密。" },
                      { name: "后山竹林", desc: "镇子背后的大片竹林，有一条隐秘的小路通向山顶的废弃凉亭。这里是男主独处的地方，也是两人第一次敞开心扉的场所。" },
                    ].map((scene) => (
                      <div key={scene.name} className="bg-gray-50/60 rounded-lg p-3.5">
                        <span className="text-sm font-medium text-emerald-600 block mb-1">{scene.name}</span>
                        <p className="text-sm text-gray-600 leading-relaxed">{scene.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 社会生态 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    社会生态
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "镇上人际关系极其紧密，任何新鲜事半小时内全镇皆知",
                      "每周日早上有赶集，是全镇最热闹的时候，也是获取信息的重要渠道",
                      "镇长王婶是个爱管闲事的热心肠，暗中撮合各种姻缘，是推动主线的关键配角",
                      "镇上有个「三巨头」聊天团：王婶、杂货店老张、茶馆陈老，他们的对话是读者了解小镇的窗口",
                    ].map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                        <span className="text-gray-300 shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 隐藏线索 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                    隐藏线索
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "女主小时候在清岚镇生活过三年，镇上有人认出了她但选择沉默守护",
                      "失忆的真相与一场十五年前的车祸有关，肇事者与女主的经纪人有关联",
                      "男主的爷爷曾经是女主母亲的主治医生，两家有一段未了的恩情",
                      "面馆的院子里埋着一个时间胶囊，是女主童年时亲手埋下的",
                    ].map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed flex gap-2">
                        <span className="text-amber-400 shrink-0">🔍</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              /* ── 设定展示 ── */
              <>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">创作设定</h2>
                  <p className="text-xs text-gray-400">可直接编辑修改，也可在对话中修改</p>
                </div>

                {settingsData.map((section) => (
                  <div key={section.group}>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                      {section.group}
                    </h3>
                    {section.type === "text" ? (
                      <div className="space-y-4">
                        {section.items.map((item) => (
                          <div key={item.label}>
                            <span className="text-xs font-medium text-gray-400 block mb-1">{item.label}</span>
                            <p className="text-sm text-gray-700 leading-relaxed">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {section.items.map((item) => (
                          <div key={item.label} className="flex items-start gap-4">
                            <span className="text-sm text-gray-400 w-20 shrink-0">{item.label}</span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.value.split(" · ").map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Writing mode: chapter editor with collapsible TOC
  if ((scene === "novel" || scene === "screenplay" || scene === "marketing" || scene === "knowledge") && creationStage >= 5 && novelChapters.length > 0) {
    const currentCh = novelChapters[currentNovelChapter];
    const isGenerating = currentCh?.status === "generating";

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
                      onClick={() => { setCurrentNovelChapter(i); setTocOpen(false); }}
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

          {/* Editor area */}
          <div className="flex-1 overflow-y-auto px-8 py-6 pl-14">
            <div className="max-w-3xl mx-auto">
              {/* Chapter title */}
              <h2 className="text-lg font-bold text-gray-900 mb-1">{currentCh?.title}</h2>
              <p className="text-xs text-gray-400 mb-6">
                {isGenerating ? "正在生成中..." : currentCh?.status === "done" ? "已生成，可直接编辑" : "等待生成"}
              </p>

              {/* Chapter content */}
              {currentCh?.content ? (
                <div className="prose prose-sm max-w-none">
                  {isGenerating ? (
                    // Read-only streaming view
                    <div className="text-sm text-gray-700 leading-[1.8] whitespace-pre-wrap">
                      {currentCh.content}
                      <span className="inline-block w-0.5 h-4 bg-indigo-500 animate-pulse ml-0.5 align-middle" />
                    </div>
                  ) : (
                    // Editable textarea for done chapters
                    <textarea
                      value={currentCh.content}
                      onChange={(e) => setNovelChapterContent(currentNovelChapter, e.target.value)}
                      className="w-full text-sm text-gray-700 leading-[1.8] resize-none outline-none bg-transparent min-h-[60vh] whitespace-pre-wrap"
                    />
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-300 italic">等待生成...</div>
              )}
            </div>
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

          {/* Custom Floating Toolbar */}
          {floatingToolbar.show && (
            <div
              className="absolute z-20 w-[280px]"
              style={{
                top: floatingToolbar.top,
                left: Math.max(0, Math.min(floatingToolbar.left, 400)),
              }}
            >
              {/* 输入改写要求 */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 mb-2">
                <div className="flex items-start gap-2">
                  <textarea
                    placeholder="输入改写要求"
                    rows={2}
                    className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        showToast("改写功能演示中...");
                      }
                    }}
                  />
                  <button
                    onClick={() => showToast("改写功能演示中...")}
                    className="mt-auto p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 快捷操作列表 */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-1.5">
                <button
                  onClick={() => handleAIAction("polish")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Wand2 className="w-4 h-4 text-gray-400" />
                  润色一下
                </button>
                <button
                  onClick={() => handleAIAction("atmosphere")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Sparkles className="w-4 h-4 text-gray-400" />
                  丰富一下
                </button>
                <button
                  onClick={() => handleAIAction("condense")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <MoveHorizontal className="w-4 h-4 text-gray-400" />
                  写短一下
                </button>
                <button
                  onClick={() => handleAIAction("rewrite")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <RefreshCw className="w-4 h-4 text-gray-400" />
                  继续写点
                </button>
                <button
                  onClick={() => handleAIAction("atmosphere")}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Palette className="w-4 h-4 text-gray-400" />
                  氛围增强
                </button>
              </div>
            </div>
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
