"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { mockWorks } from "@/data/mockWorks";

export default function RecentWorks() {
  const router = useRouter();

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
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
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
        <button
          onClick={() => router.push("/works")}
          className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          全部作品
        </button>
        <button
          onClick={() => router.push(`/workbench?scene=${recent.scene}`)}
          className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-medium rounded-lg hover:bg-emerald-600 transition"
        >
          继续写作
        </button>
      </div>
    </div>
  );
}
