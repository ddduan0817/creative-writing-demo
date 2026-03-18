"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, AlertTriangle } from "lucide-react";
import { useCallback, useState, useEffect, useRef } from "react";
import { mockWorks } from "@/data/mockWorks";

export default function RecentWorks2() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const showToastMsg = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  // Click outside to close menu
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setShowExport(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  // Sort by updatedAt descending, take the first one
  const recent = [...mockWorks].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )[0];

  if (!recent) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center justify-center">
        <div className="text-3xl mb-2">📝</div>
        <p className="text-sm font-medium text-gray-600">还没有作品</p>
        <p className="text-xs text-gray-400 mt-1">开始你的第一次创作吧</p>
        <button
          onClick={() => router.push("/")}
          className="mt-3 px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          + 新建作品
        </button>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">近期作品</h2>
        <button
          onClick={() => router.push("/works")}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5"
        >
          查看更多 <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Work Card */}
      <div className="flex gap-4 flex-1">
        {/* Illustration */}
        <div className="w-[80px] h-[80px] rounded-xl bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center text-2xl flex-shrink-0">
          {recent.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900">
            {recent.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {recent.sceneLabel}
          </p>
          <p className="text-xs text-gray-300 mt-0.5">
            {recent.wordCount.toLocaleString()} 字 | {recent.updatedAt}
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-50">
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => { setShowMenu(!showMenu); setShowExport(false); }}
            className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            更多
          </button>
          {showMenu && (
            <div className="absolute right-0 bottom-full mb-1 bg-white rounded-lg shadow-lg border py-1 z-10 w-32">
              {/* 导出 */}
              <div className="relative">
                <button
                  onClick={() => setShowExport(!showExport)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 flex items-center justify-between"
                >
                  导出作品
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </button>
                {showExport && (
                  <div className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-lg border py-1 z-10 w-24">
                    {["TXT", "DOC", "PDF"].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => { showToastMsg(`正在导出 ${fmt}...`); setShowMenu(false); }}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* 复制链接 */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://creative-writing.demo/share/${recent.id}`);
                  showToastMsg("链接已复制");
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50"
              >
                复制链接
              </button>
              {/* 删除 */}
              <button
                onClick={() => { setShowDeleteConfirm(true); setShowMenu(false); }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50"
              >
                删除作品
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => router.push(`/workbench?scene=${recent.scene}`)}
          className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition"
        >
          继续写作
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-[380px] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-gray-900">确认删除</h3>
            </div>
            <p className="text-sm text-gray-600">
              删除「{recent.title}」？
              <br />
              <span className="text-gray-400">
                删除后无法恢复，作品内容将永久丢失。
              </span>
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                onClick={() => { setShowDeleteConfirm(false); showToastMsg("作品已删除"); }}
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
