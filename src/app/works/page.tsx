"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/home/Sidebar";
import { mockWorks, type WorkItem } from "@/data/mockWorks";
import {
  ArrowLeft,
  Copy,
  Download,
  Link2,
  Trash2,
  MoreHorizontal,
  Search,
  AlertTriangle,
  Plus,
  ChevronDown,
  ChevronRight,
  CloudUpload,
  ExternalLink,
  Pencil,
} from "lucide-react";

const categories = [
  { id: "all", label: "全部" },
  { id: "novel", label: "小说" },
  { id: "screenplay", label: "剧本/分镜" },
  { id: "marketing", label: "种草文案" },
  { id: "knowledge", label: "知识专栏" },
  { id: "general", label: "通用" },
];

type SortKey = "updated" | "name" | "words" | "created";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "updated", label: "最近编辑" },
  { key: "name", label: "名称" },
  { key: "words", label: "字数" },
  { key: "created", label: "创建时间" },
];

export default function WorksPage() {
  const router = useRouter();
  const [works, setWorks] = useState(mockWorks);
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [exportSubOpen, setExportSubOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<WorkItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("updated");
  const [sortDropOpen, setSortDropOpen] = useState(false);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sortRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  // Click outside to close menus
  useEffect(() => {
    if (!menuOpen && !sortDropOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuOpen) {
        const ref = menuRefs.current[menuOpen];
        if (ref && !ref.contains(target)) {
          setMenuOpen(null);
          setExportSubOpen(false);
        }
      }
      if (sortDropOpen && sortRef.current && !sortRef.current.contains(target)) {
        setSortDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen, sortDropOpen]);

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

  const handleMenuOpen = (workId: string) => {
    setMenuOpen(menuOpen === workId ? null : workId);
    setExportSubOpen(false);
  };

  // 计算每个分类的数量
  const getCategoryCount = (catId: string) => {
    if (catId === "all") return works.length;
    return works.filter(
      (w) => w.sceneLabel === categories.find((c) => c.id === catId)?.label
    ).length;
  };

  // 排序
  const sortWorks = (list: WorkItem[]) => {
    const sorted = [...list];
    switch (sortBy) {
      case "updated":
        return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      case "name":
        return sorted.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
      case "words":
        return sorted.sort((a, b) => b.wordCount - a.wordCount);
      case "created":
        // Demo 里没有 createdAt，用 id 倒序模拟
        return sorted.sort((a, b) => b.id.localeCompare(a.id));
      default:
        return sorted;
    }
  };

  const filteredWorks = sortWorks(
    works
      .filter((w) => {
        if (activeCategory !== "all") {
          return w.sceneLabel === categories.find((c) => c.id === activeCategory)?.label;
        }
        return true;
      })
      .filter((w) => {
        if (!searchQuery.trim()) return true;
        return w.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
      })
  );

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
            <button
              onClick={() => router.push("/")}
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              新建作品
            </button>
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

          {/* Category Tabs + Sort */}
          <div className="flex items-center gap-2 mb-6">
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
            <div className="flex-1" />
            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortDropOpen(!sortDropOpen)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                {sortOptions.find((o) => o.key === sortBy)?.label}
                <ChevronDown className="w-3 h-3" />
              </button>
              {sortDropOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-10 w-28">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setSortBy(opt.key); setSortDropOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 ${
                        sortBy === opt.key ? "text-blue-600 font-medium" : "text-gray-600"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Works List */}
          {filteredWorks.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-sm font-medium text-gray-600">还没有作品</p>
              <p className="text-xs text-gray-400 mt-1">开始你的第一次创作吧</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                新建作品
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredWorks.map((work) => (
                <div
                  key={work.id}
                  onClick={() => router.push(`/workbench?scene=${work.scene}`)}
                  className={`bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-all duration-200 group cursor-pointer ${
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
                  <div
                    className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => router.push(`/workbench?scene=${work.scene}`)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      编辑
                    </button>
                    <div className="relative" ref={(el) => { menuRefs.current[work.id] = el; }}>
                      <button
                        onClick={() => handleMenuOpen(work.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {menuOpen === work.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-10 w-44">
                          <button
                            onClick={() => { navigator.clipboard.writeText(`${work.title}的全文内容（demo模拟）`); showToast("已复制"); setMenuOpen(null); }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            复制全文
                          </button>
                          {/* 导出 with sub-options */}
                          <div className="relative">
                            <button
                              onClick={() => setExportSubOpen(!exportSubOpen)}
                              className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center justify-between"
                            >
                              <span className="flex items-center gap-2">
                                <Download className="w-3.5 h-3.5" />
                                导出
                              </span>
                              <ChevronRight className="w-3 h-3 text-gray-400" />
                            </button>
                            {exportSubOpen && (
                              <div className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-lg border py-1 z-10 w-24">
                                <button
                                  onClick={() => { showToast("正在导出 DOCX..."); setMenuOpen(null); }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
                                >
                                  DOCX
                                </button>
                                <button
                                  onClick={() => { showToast("正在导出 PDF..."); setMenuOpen(null); }}
                                  className="w-full text-left px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
                                >
                                  PDF
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => { showToast("已保存至百度网盘"); setMenuOpen(null); }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <CloudUpload className="w-3.5 h-3.5" />
                            保存至百度网盘
                          </button>
                          <button
                            onClick={() => { showToast("网盘链接已生成"); setMenuOpen(null); }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            生成百度网盘链接
                          </button>
                          <button
                            onClick={() => { navigator.clipboard.writeText(`https://creative-writing.demo/share/${work.id}`); showToast("链接已复制"); setMenuOpen(null); }}
                            className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            复制链接
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => handleDelete(work)}
                            className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            删除
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
