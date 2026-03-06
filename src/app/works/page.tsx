"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/home/Sidebar";
import {
  ArrowLeft,
  Download,
  Link2,
  Trash2,
  MoreHorizontal,
  FileText,
} from "lucide-react";

interface WorkItem {
  id: string;
  title: string;
  scene: string;
  sceneLabel: string;
  wordCount: number;
  updatedAt: string;
  emoji: string;
}

const mockWorks: WorkItem[] = [
  {
    id: "w1",
    title: "灵脉纪",
    scene: "novel",
    sceneLabel: "小说",
    wordCount: 12340,
    updatedAt: "2026-03-06 14:30",
    emoji: "📖",
  },
  {
    id: "w2",
    title: "都市修仙录",
    scene: "novel",
    sceneLabel: "小说",
    wordCount: 8720,
    updatedAt: "2026-03-05 09:15",
    emoji: "📖",
  },
  {
    id: "w3",
    title: "逆袭甜宠短剧",
    scene: "screenplay",
    sceneLabel: "剧本",
    wordCount: 4560,
    updatedAt: "2026-03-04 16:45",
    emoji: "🎬",
  },
  {
    id: "w4",
    title: "美妆好物安利合集",
    scene: "marketing",
    sceneLabel: "其他",
    wordCount: 2130,
    updatedAt: "2026-03-03 11:20",
    emoji: "🌿",
  },
  {
    id: "w5",
    title: "《思考快与慢》拆书稿",
    scene: "knowledge",
    sceneLabel: "内容解读",
    wordCount: 6890,
    updatedAt: "2026-03-02 20:00",
    emoji: "📚",
  },
  {
    id: "w6",
    title: "悬疑分镜脚本 EP01",
    scene: "screenplay",
    sceneLabel: "脚本",
    wordCount: 3210,
    updatedAt: "2026-03-01 15:30",
    emoji: "🎬",
  },
  {
    id: "w7",
    title: "职场成长观点文",
    scene: "knowledge",
    sceneLabel: "内容解读",
    wordCount: 1850,
    updatedAt: "2026-02-28 22:10",
    emoji: "📚",
  },
  {
    id: "w8",
    title: "数码产品种草文案",
    scene: "marketing",
    sceneLabel: "其他",
    wordCount: 980,
    updatedAt: "2026-02-27 13:45",
    emoji: "🌿",
  },
];

const categories = [
  { id: "all", label: "全部" },
  { id: "novel", label: "小说" },
  { id: "screenplay", label: "剧本" },
  { id: "script", label: "脚本" },
  { id: "knowledge", label: "内容解读" },
  { id: "other", label: "其他" },
];

export default function WorksPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filteredWorks =
    activeCategory === "all"
      ? mockWorks
      : mockWorks.filter((w) => w.sceneLabel === categories.find((c) => c.id === activeCategory)?.label);

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="max-w-[960px] mx-auto px-8 py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.push("/")}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">我的作品</h1>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 text-sm rounded-full transition ${
                  activeCategory === cat.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Works List */}
          {filteredWorks.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">暂无作品</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
              >
                去创作
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWorks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition group"
                >
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                    {work.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {work.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                        {work.sceneLabel}
                      </span>
                      <span className="text-xs text-gray-400">
                        {work.wordCount.toLocaleString()} 字
                      </span>
                      <span className="text-xs text-gray-300">
                        {work.updatedAt}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => router.push(`/workbench?scene=${work.scene}`)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition"
                    >
                      继续写作
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === work.id ? null : work.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuOpen === work.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-10 w-36">
                          <button className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                            <Download className="w-3.5 h-3.5" />
                            导出作品
                          </button>
                          <button className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                            <Link2 className="w-3.5 h-3.5" />
                            复制链接
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2">
                            <Trash2 className="w-3.5 h-3.5" />
                            删除作品
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
