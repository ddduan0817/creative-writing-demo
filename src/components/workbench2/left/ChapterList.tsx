"use client";

import { useEditorStore } from "@/stores/editorStore";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ChapterList({ sceneType = "novel" }: { sceneType?: "novel" | "screenplay" }) {
  const isScreenplay = sceneType === "screenplay";
  const {
    chapters,
    currentChapterId,
    setCurrentChapter,
    deleteChapter,
    renameChapter,
    showToast,
  } = useEditorStore();
  const [menuId, setMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleDelete = (id: string) => {
    if (chapters.length <= 1) {
      showToast(isScreenplay ? "至少保留一个场次" : "至少保留一个章节");
      return;
    }
    deleteChapter(id);
    setMenuId(null);
    showToast(isScreenplay ? "已删除场次" : "已删除章节");
  };

  const handleRenameStart = (id: string, title: string) => {
    setRenamingId(id);
    setRenameValue(title);
    setMenuId(null);
  };

  const handleRenameConfirm = (id: string) => {
    renameChapter(id, renameValue);
    setRenamingId(null);
  };

  return (
    <div className="px-2 pb-2">
      {chapters.map((ch) => (
        <div
          key={ch.id}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition group",
            currentChapterId === ch.id
              ? "bg-indigo-50 text-indigo-700"
              : "text-gray-600 hover:bg-gray-50"
          )}
          onClick={() => setCurrentChapter(ch.id)}
        >
          {renamingId === ch.id ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => handleRenameConfirm(ch.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameConfirm(ch.id);
                if (e.key === "Escape") setRenamingId(null);
              }}
              className="flex-1 text-sm bg-white border border-indigo-200 rounded px-1 py-0.5 outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span className="flex-1 truncate">{ch.title}</span>
              <span className="text-xs text-gray-400">{ch.wordCount}字</span>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuId(menuId === ch.id ? null : ch.id);
                  }}
                  className="p-0.5 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
                {menuId === ch.id && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-20 w-28">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameStart(ch.id, ch.title);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50"
                    >
                      编辑名称
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(ch.id);
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
                    >
                      删除
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
