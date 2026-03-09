"use client";

import { type Editor } from "@tiptap/react";
import { getSceneMockResponses } from "@/data/mockAIResponses";
import { simulateAIStream } from "@/lib/aiSimulator";
import { useEditorStore } from "@/stores/editorStore";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState } from "react";

export default function EditorToolbar({ editor }: { editor: Editor }) {
  const { showToast, scene } = useEditorStore();
  const mockData = getSceneMockResponses(scene);
  const [continuing, setContinuing] = useState(false);

  // Check if editor has meaningful content
  const hasContent = editor.getText().trim().length > 0;

  const handleContinue = () => {
    setContinuing(true);
    editor.commands.focus("end");

    simulateAIStream(mockData.continuation, (current, done) => {
      // Clear and re-insert to show streaming
      const paragraphs = current
        .split("\n\n")
        .filter(Boolean)
        .map((p) => `<p>${p}</p>`)
        .join("");

      const marker = "<!-- ai-continue -->";
      const html = editor.getHTML();
      const clean = html.replace(
        new RegExp(`${marker}[\\s\\S]*$`),
        ""
      );
      editor.commands.setContent(
        clean +
          marker +
          '<div class="border-l-2 border-indigo-300 pl-3 mt-4">' +
          paragraphs +
          (done ? "" : '<span class="ai-cursor"></span>') +
          "</div>"
      );

      if (done) {
        setContinuing(false);
        showToast(hasContent ? "续写完成" : "生成完成");
      }
    });
  };

  const btnClass =
    "p-1.5 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition";
  const activeClass = "bg-gray-100";

  return (
    <div className="flex items-center gap-0.5 px-4 py-2 border-b border-gray-100 flex-shrink-0 flex-wrap">
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={btnClass}
        title="撤销"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={btnClass}
        title="重做"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <button
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={`${btnClass} ${
          editor.isActive("heading", { level: 2 }) ? activeClass : ""
        }`}
        title="标题"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btnClass} ${
          editor.isActive("bold") ? activeClass : ""
        }`}
        title="加粗"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btnClass} ${
          editor.isActive("italic") ? activeClass : ""
        }`}
        title="斜体"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${btnClass} ${
          editor.isActive("underline") ? activeClass : ""
        }`}
        title="下划线"
      >
        <Underline className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${btnClass} ${
          editor.isActive("strike") ? activeClass : ""
        }`}
        title="删除线"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btnClass} ${
          editor.isActive("bulletList") ? activeClass : ""
        }`}
        title="无序列表"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${btnClass} ${
          editor.isActive("orderedList") ? activeClass : ""
        }`}
        title="有序列表"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${btnClass} ${
          editor.isActive("blockquote") ? activeClass : ""
        }`}
        title="引用"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="flex-1" />

      {/* AI Quick Actions */}
      <button
        onClick={handleContinue}
        disabled={continuing}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50"
        title={hasContent ? "基于已有内容继续生成" : "根据设定和大纲一键生成正文"}
      >
        {continuing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5" />
        )}
        {hasContent ? "正文续写" : "AI 写作"}
      </button>
    </div>
  );
}
