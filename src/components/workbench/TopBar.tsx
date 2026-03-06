"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Download,
  Star,
  Eye,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

export default function TopBar() {
  const router = useRouter();
  const {
    title,
    setTitle,
    saveStatus,
    chapters,
    currentChapterId,
    focusMode,
    toggleFocusMode,
    showToast,
  } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [starred, setStarred] = useState(false);

  const currentChapter = chapters.find((c) => c.id === currentChapterId);
  const totalWords = chapters.reduce((sum, c) => sum + c.wordCount, 0);

  const handleSave = () => {
    showToast("已保存");
  };

  const handleExport = (format: string) => {
    showToast(`正在导出 ${format} 格式...`);
  };

  const handleStar = () => {
    setStarred(!starred);
    showToast(starred ? "已取消收藏" : "已收藏");
  };

  return (
    <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-3 bg-white flex-shrink-0">
      {/* Left: Back + Title */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>退出</span>
      </button>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {isEditing ? (
        <input
          autoFocus
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={() => {
            setTitle(editTitle);
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setTitle(editTitle);
              setIsEditing(false);
            }
            if (e.key === "Escape") {
              setEditTitle(title);
              setIsEditing(false);
            }
          }}
          className="text-sm font-semibold bg-indigo-50 border border-indigo-200 rounded px-2 py-0.5 outline-none"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition"
        >
          {title}
        </button>
      )}

      {/* Center: Save status + Word count */}
      <div className="flex items-center gap-3 text-xs text-gray-400 ml-4">
        <span className="flex items-center gap-1">
          {saveStatus === "saved" && (
            <>
              <Check className="w-3 h-3 text-green-500" />
              已保存到云端
            </>
          )}
          {saveStatus === "saving" && (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              保存中...
            </>
          )}
          {saveStatus === "failed" && (
            <>
              <AlertCircle className="w-3 h-3 text-red-500" />
              保存失败
            </>
          )}
        </span>
        <span>本章 {currentChapter?.wordCount || 0} 字</span>
        <span>总计 {totalWords} 字</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: Actions */}
      <button
        onClick={toggleFocusMode}
        className={`px-2 py-1 text-xs rounded transition ${
          focusMode
            ? "bg-indigo-100 text-indigo-700"
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        <Eye className="w-3.5 h-3.5 inline mr-1" />
        专注模式
      </button>

      <button
        onClick={handleSave}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition"
        title="保存"
      >
        <Save className="w-4 h-4" />
      </button>

      <div className="relative group">
        <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition">
          <Download className="w-4 h-4" />
        </button>
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-20 w-24 hidden group-hover:block">
          {["txt", "doc", "pdf"].map((f) => (
            <button
              key={f}
              onClick={() => handleExport(f)}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleStar}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition"
      >
        <Star
          className={`w-4 h-4 ${starred ? "fill-amber-400 text-amber-400" : ""}`}
        />
      </button>
    </div>
  );
}
