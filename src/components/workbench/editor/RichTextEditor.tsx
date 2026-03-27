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
  } = useEditorStore();

  const currentChapter = chapters.find((c) => c.id === currentChapterId);
  const isSimpleScene = scene === "marketing" || scene === "knowledge";
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

  // Novel agent flow: show settings/worldbuilding in editor (read-only)
  if (scene === "novel" && creationStage >= 1 && creationStage < 5) {
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
          <div className="max-w-2xl mx-auto space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">创作设定</h2>
              <p className="text-xs text-gray-400">基于灵感方向自动生成，可在对话中修改</p>
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

            {creationStage >= 2 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
                  世界观
                </h3>
                <p className="text-sm text-gray-500">待生成...</p>
              </div>
            )}
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

      {/* Floating Bottom Action Bar */}
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
