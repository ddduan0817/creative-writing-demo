"use client";

import { useState, useRef, useEffect } from "react";
import { type Editor } from "@tiptap/react";
import {
  Wand2,
  ChevronDown,
  RefreshCw,
  MoveHorizontal,
  Palette,
  Sparkles,
  Send,
  Copy,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
} from "lucide-react";

interface FloatingSelectionToolbarProps {
  top: number;
  left: number;
  editor?: Editor | null;
  showAIMenu: boolean;
  setShowAIMenu: (v: boolean | ((prev: boolean) => boolean)) => void;
  onAIAction: (action: string) => void;
  onCopy: () => void;
  showToast: (msg: string) => void;
}

export default function FloatingSelectionToolbar({
  top,
  left,
  editor,
  showAIMenu,
  setShowAIMenu,
  onAIAction,
  onCopy,
  showToast,
}: FloatingSelectionToolbarProps) {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headingRef.current && !headingRef.current.contains(e.target as Node)) {
        setShowHeadingMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="absolute z-20"
      style={{
        top,
        left: Math.max(0, Math.min(left, 500)),
      }}
    >
      {/* Compact bar: AI调整 | 复制 | 分隔线 | T↓ B I U S */}
      <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 h-9 px-1 gap-0.5">
        <button
          onClick={() => setShowAIMenu((v: boolean) => !v)}
          className="flex items-center gap-1 px-2.5 py-1 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-md transition"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span className="text-[13px]">AI 调整</span>
        </button>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="text-[13px]">复制</span>
        </button>

        <div className="w-px h-4 bg-gray-200 mx-0.5" />

        {/* T dropdown */}
        <div className="relative" ref={headingRef}>
          <button
            onClick={() => {
              if (editor) setShowHeadingMenu((v) => !v);
              else showToast("格式功能演示中...");
            }}
            className={`flex items-center gap-0 p-1.5 rounded-md transition ${
              editor?.isActive("heading") ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <Type className="w-4 h-4" />
            <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
          </button>
          {showHeadingMenu && editor && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 w-32 z-30">
              {[
                { label: "正文", action: () => editor.chain().focus().setParagraph().run() },
                { label: "H₁ 一级标题", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
                { label: "H₂ 二级标题", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
                { label: "H₃ 三级标题", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => { opt.action(); setShowHeadingMenu(false); }}
                  className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => editor ? editor.chain().focus().toggleBold().run() : showToast("格式功能演示中...")}
          className={`p-1.5 rounded-md transition ${editor?.isActive("bold") ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor ? editor.chain().focus().toggleItalic().run() : showToast("格式功能演示中...")}
          className={`p-1.5 rounded-md transition ${editor?.isActive("italic") ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor ? editor.chain().focus().toggleUnderline().run() : showToast("格式功能演示中...")}
          className={`p-1.5 rounded-md transition ${editor?.isActive("underline") ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
        >
          <Underline className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor ? editor.chain().focus().toggleStrike().run() : showToast("格式功能演示中...")}
          className={`p-1.5 rounded-md transition ${editor?.isActive("strike") ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"}`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>
      </div>

      {/* AI 调整下拉面板 */}
      {showAIMenu && (
        <div className="mt-1.5 w-[280px]">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 mb-1.5">
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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-1.5">
            {[
              { action: "polish", icon: Wand2, label: "润色一下" },
              { action: "atmosphere", icon: Sparkles, label: "丰富一下" },
              { action: "condense", icon: MoveHorizontal, label: "写短一下" },
              { action: "rewrite", icon: RefreshCw, label: "继续写点" },
              { action: "atmosphere2", icon: Palette, label: "氛围增强" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => { setShowAIMenu(false); onAIAction(item.action === "atmosphere2" ? "atmosphere" : item.action); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <item.icon className="w-4 h-4 text-gray-400" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
