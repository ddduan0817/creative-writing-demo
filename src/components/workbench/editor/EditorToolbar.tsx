"use client";

import { type Editor } from "@tiptap/react";
import { useState, useRef, useEffect } from "react";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  ChevronDown,
  Type,
} from "lucide-react";

function ToolbarButton({
  onClick,
  disabled,
  active,
  tooltip,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  tooltip: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition ${
          active ? "bg-gray-100" : ""
        }`}
      >
        {children}
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2.5 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-[100]">
        {tooltip}
      </div>
    </div>
  );
}

export default function EditorToolbar({ editor }: { editor: Editor }) {
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

  const headingOptions = [
    { label: "正文", action: () => editor.chain().focus().setParagraph().run() },
    { label: "H₁ 一级标题", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "H₂ 二级标题", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "H₃ 三级标题", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  ];

  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2 border-b border-gray-100 flex-shrink-0">
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        tooltip="撤销(⌘+Z)"
      >
        <Undo2 className="w-[18px] h-[18px]" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        tooltip="重做(⌘+⇧+Z)"
      >
        <Redo2 className="w-[18px] h-[18px]" />
      </ToolbarButton>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Font size / heading dropdown */}
      <div className="relative" ref={headingRef}>
        <div className="relative group">
          <button
            onClick={() => setShowHeadingMenu(!showHeadingMenu)}
            className={`flex items-center gap-0.5 p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition ${
              editor.isActive("heading") ? "bg-gray-100" : ""
            }`}
          >
            <Type className="w-[18px] h-[18px]" />
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          {!showHeadingMenu && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2.5 py-1 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-[100]">
              切换字号
            </div>
          )}
        </div>
        {showHeadingMenu && (
          <div className="absolute left-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-36 z-30">
            {headingOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  opt.action();
                  setShowHeadingMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        tooltip="加粗(⌘+B)"
      >
        <Bold className="w-[18px] h-[18px]" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        tooltip="斜体(⌘+I)"
      >
        <Italic className="w-[18px] h-[18px]" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        tooltip="下划线(⌘+U)"
      >
        <Underline className="w-[18px] h-[18px]" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        tooltip="删除线(⌘+⇧+S)"
      >
        <Strikethrough className="w-[18px] h-[18px]" />
      </ToolbarButton>
    </div>
  );
}
