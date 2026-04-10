"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  BookOpen,
  Loader2,
  History,
  X,
  FileText,
  Pencil,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function TopBar() {
  const router = useRouter();
  const {
    title,
    setTitle,
    saveStatus,
    showToast,
    historyItems,
    showHistoryPanel,
    setShowHistoryPanel,
    restoreFromHistory,
    creationStage,
    workMode,
  } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [showMaterials, setShowMaterials] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  // 同步 store 中的 title 到 editTitle
  useEffect(() => {
    setEditTitle(title);
  }, [title]);

  // 监听 saveStatus 变化，记录保存时间
  useEffect(() => {
    if (saveStatus === "saved") {
      setLastSaved(new Date());
    }
  }, [saveStatus]);

  const formatSaveTime = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month}月${day}日${hours}:${minutes}`;
  };

  const handleExport = (format: string) => {
    showToast(`正在导出 ${format} 格式...`);
  };

  return (
    <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2 bg-white flex-shrink-0">
      {/* Left: Back */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
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
          {title}
        </button>
      )}

      {/* Save status */}
      <div className="flex items-center text-xs text-gray-400 ml-2">
        <span className="flex items-center gap-1">
          {saveStatus === "saving" ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              保存中
            </>
          ) : (
            <>
              <Pencil className="w-3 h-3" />
              修改于{formatSaveTime(lastSaved)}
            </>
          )}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: 导出 / 收藏 / 历史记录 */}
      <div className="relative group">
        <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
          <Download className="w-3.5 h-3.5" />
          导出
        </button>
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-20 w-24 hidden group-hover:block">
          {["doc", "pdf"].map((f) => (
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

      {workMode !== "workflow" && (
        <button
          onClick={() => setShowMaterials(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <BookOpen className="w-3.5 h-3.5" />
          查看资料
        </button>
      )}

      <button
        onClick={() => setShowHistoryPanel(true)}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
      >
        <History className="w-3.5 h-3.5" />
        历史记录
      </button>

      <button
        onClick={() => router.push("/")}
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition ml-1"
      >
        <X className="w-4 h-4" />
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

      {/* Materials Panel */}
      {showMaterials && (
        <MaterialsPanel
          creationStage={creationStage}
          onClose={() => setShowMaterials(false)}
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
  const [selectedId, setSelectedId] = useState<string | null>(
    historyItems.length > 0 ? historyItems[0].id : null
  );
  const [showChanges, setShowChanges] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const selectedItem = historyItems.find((h) => h.id === selectedId);
  const isLatest = selectedId === (historyItems.length > 0 ? historyItems[0].id : null);

  // Group items by date label: 今天 / 月份
  const groupItems = () => {
    const today = new Date();
    const groups: { label: string; items: HistoryItem[] }[] = [];
    const groupMap = new Map<string, HistoryItem[]>();

    for (const item of historyItems) {
      const d = item.timestamp;
      const isToday =
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate();
      const label = isToday ? "今天" : `${d.getMonth() + 1}月`;
      if (!groupMap.has(label)) groupMap.set(label, []);
      groupMap.get(label)!.push(item);
    }

    groupMap.forEach((items, label) => {
      groups.push({ label, items });
    });
    return groups;
  };

  const groups = groupItems();
  const INITIAL_SHOW = 6;
  const allFlat = historyItems;
  const visibleIds = showAll
    ? new Set(allFlat.map((i) => i.id))
    : new Set(allFlat.slice(0, INITIAL_SHOW).map((i) => i.id));

  const formatTimestamp = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${min}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Top bar: 还原此版本 */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-center flex-shrink-0 relative">
        <button
          onClick={onClose}
          className="absolute left-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          返回文档
        </button>
        <button
          disabled={isLatest}
          onClick={() => selectedId && onRestore(selectedId)}
          className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${
            isLatest
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-800"
          }`}
        >
          还原此版本
        </button>
      </div>

      {/* Main body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Document preview */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto py-8 px-12">
            {selectedItem ? (
              <div
                className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedItem.content }}
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p>暂无历史记录</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: 历史版本记录 sidebar */}
        <div className="w-64 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800">历史版本记录</span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            {groups.map((group) => {
              const visibleItems = group.items.filter((i) => visibleIds.has(i.id));
              if (visibleItems.length === 0) return null;
              return (
                <div key={group.label} className="mb-3">
                  <div className="text-xs text-gray-400 mb-2 mt-1">{group.label}</div>
                  <div className="space-y-1">
                    {visibleItems.map((item, idx) => {
                      const isSelected = selectedId === item.id;
                      const isFirst = group.label === "今天" && idx === 0 && historyItems[0]?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                            isSelected
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span>{formatTimestamp(item.timestamp)}</span>
                          {isFirst && (
                            <span className="text-[10px] text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded">
                              最近更新
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {!showAll && allFlat.length > INITIAL_SHOW && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-2 transition flex items-center justify-center gap-1"
              >
                展开更多
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            )}
          </div>

          {/* Bottom: 显示更改 toggle */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
            <span className="text-sm text-gray-600">显示更改</span>
            <button
              onClick={() => setShowChanges(!showChanges)}
              className={`w-10 h-5.5 rounded-full transition-colors relative ${
                showChanges ? "bg-blue-500" : "bg-gray-300"
              }`}
              style={{ width: 40, height: 22 }}
            >
              <span
                className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
                  showChanges ? "translate-x-5" : "translate-x-0.5"
                }`}
                style={{ width: 18, height: 18 }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 查看资料弹窗 ───────────────────────────────────────────────
const materialTabs = [
  { key: "settings", label: "创作设定", stage: 1 },
  { key: "elements", label: "写作要素", stage: 1 },
  { key: "writing", label: "写作方式", stage: 1 },
  { key: "characters", label: "角色设定", stage: 3 },
  { key: "outline", label: "大纲", stage: 4 },
] as const;

function MaterialsPanel({
  creationStage,
  onClose,
}: {
  creationStage: number;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<string>("settings");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl shadow-2xl border w-[640px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-800">创作资料</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-4 gap-1 flex-shrink-0">
          {materialTabs.map((tab) => {
            const available = creationStage >= tab.stage;
            return (
              <button
                key={tab.key}
                onClick={() => available && setActiveTab(tab.key)}
                className={`px-3 py-2.5 text-sm transition relative ${
                  activeTab === tab.key
                    ? "text-indigo-600 font-medium"
                    : available
                    ? "text-gray-600 hover:text-gray-800"
                    : "text-gray-300 cursor-default"
                }`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <MaterialContent tab={activeTab} creationStage={creationStage} />
        </div>
      </div>
    </div>
  );
}

function MaterialContent({ tab, creationStage }: { tab: string; creationStage: number }) {
  const requiredStage = materialTabs.find((t) => t.key === tab)?.stage ?? 99;
  if (creationStage < requiredStage) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
        <div className="text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>尚未生成</p>
        </div>
      </div>
    );
  }

  if (tab === "settings") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">故事概念</h3>
          <div className="space-y-3">
            {[
              { label: "核心设定", value: "一位当红影后在事业巅峰突然失忆，被迫隐居南方小镇。没有聚光灯的日子里，她发现这里藏着她遗忘的童年和一段未完的缘分。" },
              { label: "故事基调", value: "甜宠日常，慢节奏温暖治愈。主角在小镇开了一家面馆，与隔壁沉默寡言的馆主从互相看不顺眼到每天给对方留饭，小镇居民看在眼里急在心里。" },
              { label: "故事走向", value: "明线甜恋暗线揭秘。当主角终于想起一切，要在复仇和眼前的幸福之间做选择。最终选择放下执念，用新的方式重新定义成功。" },
              { label: "核心冲突", value: "失忆真相 × 新旧生活的抉择 × 过去的伤害与当下的温暖" },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-xs font-medium text-gray-400 block mb-1">{item.label}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "writing") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">写作方式</h3>
          <div className="space-y-2.5">
            {[
              { label: "叙事视角", value: "第三人称" },
              { label: "叙事结构", value: "线性叙事（穿插记忆闪回）" },
              { label: "文风", value: "文艺抒情" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <span className="text-sm text-gray-400 w-16 shrink-0">{item.label}</span>
                <span className="text-sm text-gray-700">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "elements") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">写作要素</h3>
          <div className="space-y-2.5">
            {[
              { label: "受众", value: "女频" },
              { label: "题材", value: "言情 · 都市" },
              { label: "时空", value: "现代" },
              { label: "剧情元素", value: "失忆 · 娱乐圈 · 治愈 · 美食" },
              { label: "风格调性", value: "甜宠 · 治愈 · 慢热" },
              { label: "结局", value: "HE" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <span className="text-sm text-gray-400 w-16 shrink-0">{item.label}</span>
                <div className="flex flex-wrap gap-1.5">
                  {item.value.split(" · ").map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-sm rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "characters") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">女主角</h3>
          <div className="bg-purple-50/50 rounded-lg p-4 space-y-2.5">
            <span className="text-base font-bold text-purple-600">苏念</span>
            {[
              { label: "身份", value: "前当红影后，现清岚镇「一碗春」面馆老板娘" },
              { label: "性格", value: "外柔内刚，失忆后展现出天然的亲和力和不服输的韧劲" },
              { label: "外貌", value: "杏眼桃腮，常扎麻花辫，最爱穿素色棉麻围裙" },
              { label: "秘密", value: "随身带着一枚旧铜钥匙，不知道它能打开什么" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3">
                <span className="text-xs text-purple-400 w-10 shrink-0 pt-0.5">{item.label}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">男主角</h3>
          <div className="bg-blue-50/50 rounded-lg p-4 space-y-2.5">
            <span className="text-base font-bold text-blue-600">陆知行</span>
            {[
              { label: "身份", value: "济世堂第四代传人，清岚镇唯一的中医" },
              { label: "性格", value: "沉默寡言但行动力强，面对苏念时语气会不自觉变软" },
              { label: "外貌", value: "清瘦高挑，常穿白衬衫，手指修长带着淡淡药香" },
              { label: "秘密", value: "认出了苏念的真实身份，但选择沉默守护她的平静生活" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3">
                <span className="text-xs text-blue-400 w-10 shrink-0 pt-0.5">{item.label}</span>
                <p className="text-sm text-gray-700 leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">关键配角</h3>
          <div className="space-y-2.5">
            {[
              { name: "王婶", role: "镇长 / 非官方媒人", desc: "热心到让人招架不住，全镇姻缘她操了一半的心" },
              { name: "老张", role: "杂货店老板", desc: "话痨担当，消息灵通，是小镇的情报中心" },
              { name: "陈老", role: "茶馆掌柜", desc: "看似糊涂的智者，泡茶时偶尔一句话就能点醒所有人" },
              { name: "小鱼", role: "面馆学徒", desc: "16岁留守少年，把苏念当亲姐姐。日常萌点担当" },
            ].map((c) => (
              <div key={c.name} className="bg-gray-50/60 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-amber-600">{c.name}</span>
                  <span className="text-[11px] text-gray-400">{c.role}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "outline") {
    const chapters = [
      { title: "第一章 盛夏来客", summary: "苏念失忆后独自来到清岚镇，盘下破旧的面馆「一碗春」。", season: "夏" },
      { title: "第二章 面馆开张", summary: "苏念改造面馆，只卖六种面。开张当天只来了三个客人，但做出的面让全镇轰动。", season: "夏" },
      { title: "第三章 隔墙药香", summary: "面馆和中医馆只隔一面墙。苏念发现陆知行会在深夜默默把药膏放在她门口。", season: "夏" },
      { title: "第四章 赶集日", summary: "苏念第一次参加清岚镇赶集，在集市上意外看到一张旧照片，上面的小女孩像极了自己。", season: "夏" },
      { title: "第五章 秋天的桂花", summary: "院子里的百年桂花树开了。苏念用桂花入面，创出新品爆款。陆知行第一次主动来面馆吃面。", season: "秋" },
      { title: "第六章 古戏台", summary: "王婶筹划中秋文艺汇演，苏念被推举为总导演。排练中触发一段模糊的记忆闪回。", season: "秋" },
      { title: "第七章 竹林月色", summary: "苏念失眠夜游，撞见在后山竹林练八段锦的陆知行。两人在月下第一次敞开心扉。", season: "秋" },
      { title: "第八章 汇演之夜", summary: "中秋文艺汇演大成功。苏念在舞台上的光芒让陆知行确认了她的身份。", season: "秋" },
      { title: "第九章 冬日来信", summary: "一封从北京寄来的信打破了平静——苏念的前经纪人找到了她。", season: "冬" },
      { title: "第十章 真相碎片", summary: "经纪人来到小镇，试图带苏念回去。在争执中透露了失忆的部分真相。", season: "冬" },
      { title: "第十一章 信任裂痕", summary: "苏念发现陆知行早就知道她的身份却一直隐瞒。她关上了面馆的门。", season: "冬" },
      { title: "第十二章 小鱼的眼泪", summary: "小鱼偷偷跑去中医馆质问陆知行。苏念在面馆院子里发现了时间胶囊。", season: "冬" },
      { title: "第十三章 春暖花开", summary: "打开时间胶囊，苏念终于想起了一切——和一个叫'小行'的男孩的约定。", season: "春" },
      { title: "第十四章 重逢与抉择", summary: "苏念面临选择：回到娱乐圈复仇，还是留在清岚镇。", season: "春" },
      { title: "第十五章 一碗春再开张", summary: "苏念以真实身份重新开张面馆。小镇的人们站在了她身边。", season: "春" },
      { title: "第十六章 初夏的约定", summary: "又是盛夏。陆知行在桂花树下说出了那句迟到的告白。", season: "春" },
    ];
    const seasonColors: Record<string, string> = {
      "夏": "bg-orange-50 text-orange-500 border-orange-100",
      "秋": "bg-amber-50 text-amber-500 border-amber-100",
      "冬": "bg-sky-50 text-sky-500 border-sky-100",
      "春": "bg-green-50 text-green-500 border-green-100",
    };
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm rounded-full font-medium">四季章回 · 甜中带虐</span>
          <span className="text-sm text-gray-400">16章 · 约12万字</span>
        </div>
        {chapters.map((ch, i) => (
          <div key={i} className="bg-gray-50/60 rounded-lg p-3.5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className={`px-2 py-0.5 text-[10px] rounded-full border font-medium ${seasonColors[ch.season] || ""}`}>{ch.season}</span>
              <h4 className="text-sm font-semibold text-gray-800">{ch.title}</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{ch.summary}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
