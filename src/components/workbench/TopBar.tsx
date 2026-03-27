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
  RotateCcw,
  FileText,
  Sparkles,
  Pencil,
  Save,
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
        onClick={() => setShowMaterials(true)}
        className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
      >
        <BookOpen className="w-3.5 h-3.5" />
        查看资料
      </button>

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

// ─── 查看资料弹窗 ───────────────────────────────────────────────
const materialTabs = [
  { key: "settings", label: "设定", stage: 1 },
  { key: "worldbuilding", label: "世界观", stage: 2 },
  { key: "characters", label: "角色", stage: 3 },
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

  if (tab === "worldbuilding") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">故事世界</h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-gray-400 block mb-1">世界概述</span>
              <p className="text-sm text-gray-700 leading-relaxed">当代中国南方小镇「清岚镇」——一个依山傍水的千年古镇，青石板路、白墙黑瓦，手机信号时有时无。年轻人大多外出谋生，留下的都是老人和几个「不愿离开的怪人」。</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block mb-1">时间线</span>
              <p className="text-sm text-gray-700 leading-relaxed">故事跨越一年四季，从盛夏到次年初夏。四季变化推动情感发展：夏天相遇→秋天暧昧→冬天误会→春天和解→初夏告白。</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">核心场景</h3>
          <div className="space-y-2.5">
            {[
              { name: "清岚镇·主街", desc: "唯一的主街，两侧是各种老字号店铺。早上有赶早市的吆喝声，傍晚有归家的炊烟。" },
              { name: "一碗春面馆", desc: "女主盘下的老面馆，前店后院。院子里有棵百年老桂花树，秋天整条街都能闻到香气。" },
              { name: "济世堂中医馆", desc: "男主经营的祖传中医馆，就在面馆隔壁。一墙之隔，药香和面香混在一起。" },
              { name: "古戏台", desc: "镇中心的百年老戏台，逢年过节唱戏。后来成了两人关系转折的重要场所。" },
              { name: "后山竹林", desc: "镇子背后的大片竹林，是男主独处的地方，也是两人第一次敞开心扉的场所。" },
            ].map((s) => (
              <div key={s.name} className="bg-gray-50/60 rounded-lg p-3">
                <span className="text-sm font-medium text-emerald-600 block mb-1">{s.name}</span>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
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
