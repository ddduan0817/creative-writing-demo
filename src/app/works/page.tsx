"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/home/Sidebar";
import {
  ArrowLeft,
  Download,
  Link2,
  Trash2,
  MoreHorizontal,
  FileText,
  Search,
  AlertTriangle,
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
  const [works, setWorks] = useState(mockWorks);
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<WorkItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleDelete = useCallback((work: WorkItem) => {
    setDeleteTarget(work);
    setMenuOpen(null);
  }, []);

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    setDeletingId(id);
    setTimeout(() => {
      setWorks((prev) => prev.filter((w) => w.id !== id));
      setDeletingId(null);
      showToast("作品已删除");
    }, 200);
  }, [deleteTarget, showToast]);

  // 计算每个分类的数量
  const getCategoryCount = (catId: string) => {
    if (catId === "all") return works.length;
    return works.filter(
      (w) => w.sceneLabel === categories.find((c) => c.id === catId)?.label
    ).length;
  };

  const filteredWorks = works
    .filter((w) => {
      if (activeCategory !== "all") {
        return w.sceneLabel === categories.find((c) => c.id === activeCategory)?.label;
      }
      return true;
    })
    .filter((w) => {
      if (!searchQuery.trim()) return true;
      return w.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
    });

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
            <div className="flex-1" />
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索作品..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg w-[220px] focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-100 transition placeholder:text-gray-300"
              />
            </div>
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
                {cat.label}({getCategoryCount(cat.id)})
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
                  className={`bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-all duration-200 group ${
                    deletingId === work.id ? "opacity-0 scale-95" : ""
                  }`}
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
                          <button
                            onClick={() => handleDelete(work)}
                            className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
                          >
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-[380px] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-gray-900">确认删除</h3>
            </div>
            <p className="text-sm text-gray-600">
              删除「{deleteTarget.title}」？
              <br />
              <span className="text-gray-400">
                删除后无法恢复，作品内容将永久丢失。
              </span>
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
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
