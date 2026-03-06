"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function RecentWorks() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-800">近期作品</h2>
        <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-0.5">
          查看更多 <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Work Card */}
      <div className="flex gap-4 flex-1">
        {/* Illustration */}
        <div className="w-[80px] h-[80px] rounded-xl bg-gradient-to-br from-violet-100 to-purple-50 flex items-center justify-center text-2xl flex-shrink-0">
          🏔️
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-900">
            开启创意写作
          </h3>
          <p className="text-xs text-gray-400 mt-1">最近更新：第一章</p>
          <p className="text-xs text-gray-300 mt-0.5">
            总章节：1章 | 总字数：1234字 | 更新时间：2026-02-27 12:12:52
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-50">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            更多
          </button>
          {showMenu && (
            <div className="absolute right-0 bottom-full mb-1 bg-white rounded-lg shadow-lg border py-1 z-10 w-28">
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50">
                导出作品
              </button>
              <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50">
                复制链接
              </button>
              <button className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">
                删除作品
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => router.push("/workbench?scene=novel")}
          className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition"
        >
          开始写作
        </button>
      </div>
    </div>
  );
}
