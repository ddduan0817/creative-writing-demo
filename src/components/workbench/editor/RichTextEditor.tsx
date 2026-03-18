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
  Copy,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Type,
  ChevronDown,
  RefreshCw,
  MoveHorizontal,
  Palette,
  Sparkles,
  Lightbulb,
  FileCheck,
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
  } = useEditorStore();

  const currentChapter = chapters.find((c) => c.id === currentChapterId);
  const isSimpleScene = scene === "marketing" || scene === "knowledge";
  const [showAIMenu, setShowAIMenu] = useState(false);
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
          top: rect.top - wrapRect.top - 44,
          left: rect.left - wrapRect.left + rect.width / 2 - 120,
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
      setShowAIMenu(false);
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
    <div className="h-full flex flex-col overflow-hidden relative">
      <EditorToolbar editor={editor} />

      <div className="flex-1 overflow-y-auto" ref={editorWrapRef}>
        <div className="max-w-4xl mx-auto px-4 relative">
          {scene !== "general" && !isSimpleScene && currentChapter && (
            <h2 className="text-lg font-bold text-gray-800 px-8 pt-6">
              {currentChapter.title}
            </h2>
          )}

          {/* Custom Floating Toolbar */}
          {floatingToolbar.show && (
            <div
              className="absolute z-20 bg-white rounded-lg shadow-xl border border-gray-200 flex items-center gap-0.5 p-1"
              style={{
                top: floatingToolbar.top,
                left: Math.max(0, floatingToolbar.left),
              }}
            >
              {/* AI调整 first */}
              <div className="relative">
                <button
                  onClick={() => setShowAIMenu(!showAIMenu)}
                  className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-indigo-50 text-indigo-600 text-xs font-medium"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  AI 调整
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showAIMenu && (
                  <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border py-1 z-30 w-32">
                    <button
                      onClick={() => handleAIAction("rewrite")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                    >
                      改写
                    </button>
                    <button
                      onClick={() => handleAIAction("polish")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                    >
                      润色
                    </button>
                    <button
                      onClick={() => handleAIAction("condense")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                    >
                      缩写
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={() => handleAIAction(isSimpleScene ? "grassify" : "atmosphere")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-indigo-50 text-indigo-600 font-medium"
                    >
                      {isSimpleScene ? "🌿 种草感增强" : "✨ 氛围增强"}
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  const text = editor.state.doc.textBetween(
                    editor.state.selection.from,
                    editor.state.selection.to,
                    " "
                  );
                  navigator.clipboard.writeText(text);
                  showToast("已复制");
                }}
                className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-xs text-gray-600"
              >
                <Copy className="w-3.5 h-3.5" />
                复制
              </button>

              <div className="w-px h-4 bg-gray-200 mx-1" />

              {/* Format buttons after */}
              <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("heading", { level: 2 }) ? "bg-gray-100" : ""
                }`}
              >
                <Type className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("bold") ? "bg-gray-100" : ""
                }`}
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("italic") ? "bg-gray-100" : ""
                }`}
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("underline") ? "bg-gray-100" : ""
                }`}
              >
                <UnderlineIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-1.5 rounded hover:bg-gray-100 ${
                  editor.isActive("strike") ? "bg-gray-100" : ""
                }`}
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="flex items-center gap-1 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1.5">
          <div className="relative group/style">
            <button
              onClick={() => showToast("调整风格功能演示中...")}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <Palette className="w-3.5 h-3.5" />
              调整风格
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <div className="relative group/length">
            <button
              onClick={() => showToast("调整长度功能演示中...")}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
              调整长度
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={() => showToast("全文润色中...")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            全文润色
          </button>
          <button
            onClick={() => showToast("重新生成中...")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            重新生成
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button
            onClick={() => showToast("卡文锦囊功能演示中...")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            卡文锦囊
          </button>
          <button
            onClick={() => showToast("校对功能演示中...")}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 rounded-full hover:bg-gray-100 transition"
          >
            <FileCheck className="w-3.5 h-3.5" />
            校对
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
  );
}
