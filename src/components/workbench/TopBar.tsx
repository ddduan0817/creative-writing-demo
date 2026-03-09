"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Download,
  Star,
  Eye,
  Bot,
  Check,
  Loader2,
  AlertCircle,
  History,
  X,
  RotateCcw,
  FileText,
  Sparkles,
  Pencil,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function TopBar() {
  const router = useRouter();
  const {
    title,
    setTitle,
    saveStatus,
    chapters,
    currentChapterId,
    layoutMode,
    setLayoutMode,
    showToast,
    scene,
    historyItems,
    showHistoryPanel,
    setShowHistoryPanel,
    restoreFromHistory,
  } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [starred, setStarred] = useState(false);

  // 同步 store 中的 title 到 editTitle
  useEffect(() => {
    setEditTitle(title);
  }, [title]);

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
            setTitle(editTitle || title);
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setTitle(editTitle || title);
              setIsEditing(false);
            }
            if (e.key === "Escape") {
              setEditTitle(title);
              setIsEditing(false);
            }
          }}
          placeholder="输入作品标题..."
          className="text-sm font-semibold bg-indigo-50 border border-indigo-200 rounded px-2 py-0.5 outline-none min-w-[120px]"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className={`text-sm font-semibold transition ${
            title.startsWith("未命名")
              ? "text-gray-400 hover:text-indigo-600"
              : "text-gray-900 hover:text-indigo-600"
          }`}
        >
          {title.startsWith("未命名") ? `${title}（点击编辑）` : title}
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
        {scene === "general" || scene === "marketing" || scene === "knowledge" ? (
          <span>总字数 {totalWords}</span>
        ) : (
          <>
            <span>本章 {currentChapter?.wordCount || 0} 字</span>
            <span>总计 {totalWords} 字</span>
          </>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: Actions */}
      <button
        onClick={() => setLayoutMode(layoutMode === "ai-assist" ? "normal" : "ai-assist")}
        className={`px-2 py-1 text-xs rounded transition ${
          layoutMode === "ai-assist"
            ? "bg-blue-100 text-blue-700"
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        <Bot className="w-3.5 h-3.5 inline mr-1" />
        AI辅助
      </button>

      <button
        onClick={() => setLayoutMode(layoutMode === "focus" ? "normal" : "focus")}
        className={`px-2 py-1 text-xs rounded transition ${
          layoutMode === "focus"
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

      <button
        onClick={() => setShowHistoryPanel(true)}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition"
        title="历史记录"
      >
        <History className="w-4 h-4" />
      </button>

      {/* History Panel */}
      {showHistoryPanel && (
        <HistoryPanel
          historyItems={historyItems}
          onClose={() => setShowHistoryPanel(false)}
          onRestore={(id) => {
            restoreFromHistory(id);
            showToast("已恢复到历史版本");
            setShowHistoryPanel(false);
          }}
        />
      )}
    </div>
  );
}

// 历史记录面板组件
interface HistoryItem {
  id: string;
  timestamp: Date;
  chapterId: string;
  chapterTitle: string;
  content: string;
  wordCount: number;
  action: "edit" | "ai_rewrite" | "ai_polish" | "ai_condense" | "ai_atmosphere" | "manual_save";
}

function HistoryPanel({
  historyItems,
  onClose,
  onRestore,
}: {
  historyItems: HistoryItem[];
  onClose: () => void;
  onRestore: (id: string) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItem = historyItems.find((h) => h.id === selectedId);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  };

  const getActionLabel = (action: HistoryItem["action"]) => {
    const labels: Record<HistoryItem["action"], { text: string; icon: typeof FileText; color: string }> = {
      edit: { text: "编辑", icon: Pencil, color: "text-gray-500" },
      ai_rewrite: { text: "AI改写", icon: Sparkles, color: "text-purple-500" },
      ai_polish: { text: "AI润色", icon: Sparkles, color: "text-blue-500" },
      ai_condense: { text: "AI缩写", icon: Sparkles, color: "text-green-500" },
      ai_atmosphere: { text: "AI氛围增强", icon: Sparkles, color: "text-orange-500" },
      manual_save: { text: "手动保存", icon: Save, color: "text-indigo-500" },
    };
    return labels[action];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl shadow-2xl border w-[700px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-800">历史记录</span>
            <span className="text-xs text-gray-400">共 {historyItems.length} 条</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* History List */}
          <div className="w-64 border-r border-gray-100 overflow-y-auto flex-shrink-0">
            {historyItems.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                暂无历史记录
              </div>
            ) : (
              <div className="py-1">
                {historyItems.map((item) => {
                  const actionInfo = getActionLabel(item.action);
                  const ActionIcon = actionInfo.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      className={`w-full text-left px-3 py-2.5 border-b border-gray-50 hover:bg-gray-50 transition ${
                        selectedId === item.id ? "bg-indigo-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">
                          {formatTime(item.timestamp)}
                        </span>
                        <span className={`text-[10px] flex items-center gap-0.5 ${actionInfo.color}`}>
                          <ActionIcon className="w-3 h-3" />
                          {actionInfo.text}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-700 truncate">
                        {item.chapterTitle}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.wordCount} 字
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedItem ? (
              <>
                <div className="p-4 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {selectedItem.chapterTitle}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {selectedItem.timestamp.toLocaleString("zh-CN")} · {selectedItem.wordCount} 字
                      </p>
                    </div>
                    <button
                      onClick={() => onRestore(selectedItem.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      恢复此版本
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div
                    className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedItem.content }}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>选择一条历史记录查看详情</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
