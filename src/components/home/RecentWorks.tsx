"use client";

import { useRouter } from "next/navigation";
import { MoreVertical, AlertTriangle } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { mockWorks } from "@/data/mockWorks";

export default function RecentWorks() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const showToastMsg = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  // Click outside to close menu
  useEffect(() => {
    if (!activeMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [activeMenu]);

  // Sort by updatedAt descending, show top 3
  const sorted = [...mockWorks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 4);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "更新于刚刚";
    if (hours < 24) return `更新于${hours}小时前`;
    return `更新于${dateStr.slice(5, 16)}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-800">近期作品</h2>
        <button
          onClick={() => router.push("/works")}
          className="text-xs text-gray-400 hover:text-gray-600 transition"
        >
          查看更多 &gt;
        </button>
      </div>

      <div className="flex-1">
        {sorted.map((work) => (
          <div
            key={work.id}
            onClick={() => router.push(`/workbench?scene=${work.scene}`)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-gray-50/80 transition group"
          >
            <span className="text-lg flex-shrink-0">{work.emoji}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm text-gray-800 truncate">{work.title}</h3>
              <p className="text-xs text-gray-300 mt-0.5">
                {work.wordCount.toLocaleString()}字 &nbsp;&nbsp;{" "}
                {formatDate(work.updatedAt)}
              </p>
            </div>
            <div className="relative" ref={activeMenu === work.id ? menuRef : undefined}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === work.id ? null : work.id);
                }}
                className="p-1 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {activeMenu === work.id && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-10 w-28">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(
                        `https://creative-writing.demo/share/${work.id}`
                      );
                      showToastMsg("链接已复制");
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50"
                  >
                    复制链接
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showToastMsg("正在导出...");
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50"
                  >
                    导出作品
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(work.id);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-[380px] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-gray-900">确认删除</h3>
            </div>
            <p className="text-sm text-gray-600">
              确认删除该作品？
              <br />
              <span className="text-gray-400">
                删除后无法恢复，作品内容将永久丢失。
              </span>
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(null);
                  showToastMsg("作品已删除");
                }}
                className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
