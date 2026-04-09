"use client";

import { useEditorStore } from "@/stores/editorStore";
import {
  Upload,
  X,
  FileText,
  Plus,
  ChevronRight,
  Sparkles,
  Loader2,
  Maximize2,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// 内容要素标签数据
const contentTagGroups = [
  {
    id: "audience",
    label: "受众",
    max: 1,
    tags: ["男频", "女频", "全年龄"],
  },
  {
    id: "genre",
    label: "题材",
    max: 3,
    tags: ["言情", "悬疑", "惊悚", "科幻", "武侠", "仙侠", "历史", "玄幻", "奇幻", "都市", "军事", "电竞", "体育", "现实", "游戏", "末日", "灵异", "刑侦", "ABO", "无限流", "养成"],
  },
  {
    id: "timespace",
    label: "时空",
    max: 1,
    tags: ["古代", "现代", "近现代", "未来", "架空", "末世"],
  },
  {
    id: "elements",
    label: "剧情元素",
    max: 3,
    tags: ["权谋", "婚姻", "家庭", "校园", "职场", "娱乐圈", "重生", "穿越", "犯罪", "丧尸", "探险", "宫斗宅斗", "克苏鲁", "系统", "规则怪谈", "团宠", "囤物资", "直播", "种田", "金手指", "失忆", "异能"],
  },
  {
    id: "relationship",
    label: "人物关系",
    max: 2,
    tags: ["青梅竹马", "欢喜冤家", "师徒", "主仆", "双强", "强弱", "家人", "宿敌", "恋人", "姐狗", "搭档"],
  },
  {
    id: "style",
    label: "风格调性",
    max: 3,
    tags: ["甜宠", "虐恋", "暗恋", "沙雕", "爽文", "复仇", "逆袭", "励志", "烧脑", "热血", "求生", "打脸", "治愈", "反套路", "搞笑", "反转", "暗黑", "轻松", "慢热", "病娇", "纯爱"],
  },
  {
    id: "ending",
    label: "结局",
    max: 1,
    tags: ["HE", "BE", "开放式"],
  },
];

// 集数范围选项
const episodeRangeOptions = ["20-40", "40-60", "60-80", "80-100", "100-120"] as const;

// 单集时长选项
const durationOptions = ["30s", "60s", "90s", "120s", "150s", "180s"] as const;

// 单集镜头数选项（脚本专用）
const shotCountOptions = ["6-8", "8-12", "12-16"] as const;

export default function ScreenplayLeftPanel() {
  const { showToast, setLeftPanelExpanded } = useEditorStore();

  // 上传的文件
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // 故事梗概
  const [synopsis, setSynopsis] = useState("");

  // 是否已生成设定
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 选中的内容要素标签
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({
    audience: [],
    genre: [],
    timespace: [],
    elements: [],
    relationship: [],
    style: [],
    ending: [],
  });

  // 集数选择
  const [episodeRange, setEpisodeRange] = useState<string | null>(null);
  const [customEpisodes, setCustomEpisodes] = useState("");

  // 单集时长选择
  const [episodeDuration, setEpisodeDuration] = useState<string | null>(null);

  // 角色列表
  const [characters, setCharacters] = useState<{ name: string; desc: string; role: "主角" | "配角" }[]>([]);

  // 场景选择
  const [sceneType, setSceneType] = useState<"short_drama" | "comic_drama">("short_drama");

  // 类型选择
  const [scriptType, setScriptType] = useState<"script" | "storyboard">("script");

  // 横竖屏选择（漫剧专用）
  const [screenOrientation, setScreenOrientation] = useState<"horizontal" | "vertical" | null>(null);

  // 单集镜头数（脚本专用）
  const [shotCount, setShotCount] = useState<string | null>(null);

  // 展开的面板
  const [expandedSection, setExpandedSection] = useState<"content" | "writing" | null>(null);
  const [newCharacter, setNewCharacter] = useState({ name: "", desc: "", role: "主角" as "主角" | "配角" });
  const [showAddCharacter, setShowAddCharacter] = useState(false);

  const setSettingsFullscreen = useEditorStore((s) => s.setSettingsFullscreen);

  // 切换展开面板
  const toggleSection = (section: "content" | "writing") => {
    if (expandedSection === section) {
      setExpandedSection(null);
      setLeftPanelExpanded(false);
    } else {
      setExpandedSection(section);
      setLeftPanelExpanded(true);
    }
  };

  // 关闭展开面板
  const closeExpansion = () => {
    setExpandedSection(null);
    setLeftPanelExpanded(false);
  };

  // 模拟上传
  const handleUpload = () => {
    const mockFiles = ["悬疑短剧剧本梗概.docx", "雨夜追凶参考剧本.pdf"];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setUploadedFiles((prev) => [...prev, randomFile]);
    showToast("文件上传成功");
  };

  // 删除文件
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setIsGenerated(false);
  };

  // 切换标签选中
  const toggleTag = (groupId: string, tag: string, max: number) => {
    setSelectedTags((prev) => {
      const current = prev[groupId] || [];
      if (current.includes(tag)) {
        return { ...prev, [groupId]: current.filter((t) => t !== tag) };
      }
      if (current.length >= max) {
        if (max === 1) {
          return { ...prev, [groupId]: [tag] };
        }
        showToast(`最多选择 ${max} 个`);
        return prev;
      }
      return { ...prev, [groupId]: [...current, tag] };
    });
  };

  // 添加角色
  const addCharacter = () => {
    if (!newCharacter.name.trim()) {
      showToast("请输入角色名称");
      return;
    }
    setCharacters((prev) => [...prev, { ...newCharacter }]);
    setNewCharacter({ name: "", desc: "", role: "主角" });
    showToast("角色添加成功");
  };

  // 删除角色
  const removeCharacter = (index: number) => {
    setCharacters((prev) => prev.filter((_, i) => i !== index));
  };

  // 获取已选内容要素标签数量
  const getSelectedCount = () => {
    return Object.values(selectedTags).flat().length;
  };

  // 获取已选剧集规格数量
  const getWritingSelectedCount = () => {
    return (episodeRange ? 1 : 0) + (episodeDuration ? 1 : 0) + (screenOrientation ? 1 : 0) + (shotCount ? 1 : 0);
  };

  // 检查是否有内容（上传文件或输入梗概）
  const hasContent = uploadedFiles.length > 0 || synopsis.trim().length > 0;

  // 生成设定
  const handleGenerate = () => {
    if (!hasContent) {
      showToast("请上传参考材料或输入故事梗概");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      showToast("设定生成成功");
      if (uploadedFiles.length > 0 && !synopsis.trim()) {
        setSynopsis(`【故事线】刑侦记者林晓在一次线人接头中获得神秘文件，却意外发现未婚夫陈深的名字出现在嫌疑人名单上。她必须在真相与感情之间做出抉择...

【核心冲突】1. 林晓的调查越深入，离真相越近，离陈深越远
2. 陈深在组织任务与保护林晓之间反复挣扎
3. 陈队长掌握关键证据，却因上层压力无法公开

【核心卖点】悬疑反转+甜虐情感双线并行，每集结尾设置强钩子；身边最信任的人竟是最大谜团，"越爱越不敢查"的极致拉扯感...`);
      }
    }, 1500);
  };

  // 点击生成大纲或文章
  const handleCreateOutline = () => {
    if (!isGenerated) {
      showToast("请先点击「生成设定」按钮");
      return;
    }
    showToast("正在生成大纲...");
  };

  return (
    <div className="h-full flex">
      {/* 左列 - 设定 */}
      <div className="w-72 flex-shrink-0 h-full flex flex-col bg-white">
        {/* 可滚动内容区 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* 标题 */}
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">设定</span>
            </div>

            {/* 上传参考材料 */}
            <div>
              <button
                onClick={handleUpload}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition"
              >
                <Upload className="w-4 h-4" />
                <span>+ 上传参考材料</span>
              </button>
              <p className="text-[10px] text-gray-400 mt-1.5">可选，上传后 AI 将参考您的资料生成设定</p>

              {uploadedFiles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg text-xs text-gray-600 max-w-full"
                    >
                      <FileText className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate max-w-[140px]">{file}</span>
                      <button
                        onClick={() => removeFile(i)}
                        className="p-0.5 hover:bg-gray-200 rounded transition flex-shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 故事梗概 */}
            <div>
              <div className="relative">
                <textarea
                  value={synopsis}
                  onChange={(e) => {
                    setSynopsis(e.target.value);
                    setIsGenerated(false);
                  }}
                  placeholder={`【故事线】请输入故事的主要情节走向...

【核心冲突】故事的主要矛盾和冲突...

【核心卖点】一句话提炼最抓人的卖点...`}
                  className={cn(
                    "w-full h-[180px] text-sm border rounded-lg p-3 pb-10 resize-none focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-300 leading-relaxed",
                    isGenerated ? "border-green-300 bg-green-50/30" : "border-gray-200"
                  )}
                />
                {/* 底部图标：魔法棒 + 全屏 */}
                <div className="absolute bottom-3 right-3 flex items-center gap-0.5 bg-white rounded-md shadow-sm border border-gray-100">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="p-1 text-gray-300 hover:text-indigo-500 hover:bg-indigo-50 rounded transition disabled:opacity-50"
                    title="AI 生成设定"
                  >
                    {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setSettingsFullscreen(true, synopsis)}
                    className="p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded transition"
                    title="全屏编辑"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* 场景选择 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-600">场景</span>
                <span className="text-[10px] text-red-400">*必选</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: "short_drama" as const, label: "短剧" },
                  { id: "comic_drama" as const, label: "漫剧" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSceneType(item.id)}
                    className={cn(
                      "flex-1 py-2 px-2 rounded-lg border transition text-center",
                      sceneType === item.id
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 类型选择 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-600">类型</span>
                <span className="text-[10px] text-red-400">*必选</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: "script" as const, label: "剧本" },
                  { id: "storyboard" as const, label: "脚本" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setScriptType(item.id)}
                    className={cn(
                      "flex-1 py-2 px-2 rounded-lg border transition text-center",
                      scriptType === item.id
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 剧集规格 */}
            <div>
              <button
                onClick={() => toggleSection("writing")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition text-sm",
                  getWritingSelectedCount() > 0
                    ? "border-indigo-200 bg-indigo-50/50 text-indigo-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>剧集规格</span>
                  {getWritingSelectedCount() > 0 && (
                    <span className="text-xs text-indigo-500">
                      已选 {getWritingSelectedCount()} 项
                    </span>
                  )}
                </div>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform",
                    expandedSection === "writing" && "rotate-90"
                  )}
                />
              </button>

              {/* 已选剧集规格预览 */}
              {getWritingSelectedCount() > 0 && expandedSection !== "writing" && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {episodeRange && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                      {episodeRange === "custom" ? `${customEpisodes}集` : `${episodeRange}集`}
                    </span>
                  )}
                  {episodeDuration && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                      单集{episodeDuration}
                    </span>
                  )}
                  {screenOrientation && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                      {screenOrientation === "horizontal" ? "横屏" : "竖屏"}
                    </span>
                  )}
                  {shotCount && (
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                      {shotCount}镜/集
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 内容要素 */}
            <div>
              <button
                onClick={() => toggleSection("content")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition text-sm",
                  getSelectedCount() > 0
                    ? "border-indigo-200 bg-indigo-50/50 text-indigo-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>内容要素</span>
                  {getSelectedCount() > 0 && (
                    <span className="text-xs text-indigo-500">
                      已选 {getSelectedCount()} 项
                    </span>
                  )}
                </div>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform",
                    expandedSection === "content" && "rotate-90"
                  )}
                />
              </button>

              {/* 已选标签预览 */}
              {getSelectedCount() > 0 && expandedSection !== "content" && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.entries(selectedTags).flatMap(([, tags]) =>
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 角色 */}
            <div className="space-y-2">
              <button
                onClick={() => setShowAddCharacter((v) => !v)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-gray-200 text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>角色</span>
              </button>

              {/* 内联添加表单 */}
              {showAddCharacter && (
                <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50/50">
                  <div className="flex gap-2">
                    {(["主角", "配角"] as const).map((role) => (
                      <button
                        key={role}
                        onClick={() => setNewCharacter((p) => ({ ...p, role }))}
                        className={cn(
                          "flex-1 py-1 text-xs rounded-md border transition",
                          newCharacter.role === role
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter((p) => ({ ...p, name: e.target.value }))}
                    placeholder="角色名称"
                    className="w-full text-xs border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-indigo-300 bg-white"
                  />
                  <textarea
                    value={newCharacter.desc}
                    onChange={(e) => setNewCharacter((p) => ({ ...p, desc: e.target.value }))}
                    placeholder="角色简介（选填）"
                    className="w-full text-xs border border-gray-200 rounded-md px-2.5 py-1.5 resize-none focus:outline-none focus:border-indigo-300 bg-white"
                    rows={2}
                  />
                  <button
                    onClick={() => {
                      addCharacter();
                      setShowAddCharacter(false);
                    }}
                    className="w-full py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                  >
                    添加角色
                  </button>
                </div>
              )}

              {/* 已添加角色卡片 */}
              {characters.map((char, i) => (
                <div
                  key={i}
                  className="group relative border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition cursor-pointer"
                  onClick={() => {
                    const charText = `【${char.role}】${char.name}\n${char.desc || ""}`;
                    setSettingsFullscreen(true, charText);
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-800 truncate">{char.name}</span>
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0",
                      char.role === "主角" ? "bg-indigo-50 text-indigo-500" : "bg-gray-100 text-gray-400"
                    )}>
                      {char.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{char.desc || "暂无描述"}</p>
                  {/* hover 显示操作按钮 */}
                  <div className="absolute bottom-2 right-2 hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); removeCharacter(i); }}
                      className="p-1 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded transition"
                      title="删除角色"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const charText = `【${char.role}】${char.name}\n${char.desc || ""}`;
                        setSettingsFullscreen(true, charText);
                      }}
                      className="p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded transition"
                      title="全屏编辑"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleCreateOutline}
            disabled={!isGenerated}
            className={cn(
              "w-full py-2.5 text-sm font-medium rounded-lg transition flex items-center justify-center gap-2",
              isGenerated
                ? "text-white bg-indigo-600 hover:bg-indigo-700"
                : "text-gray-400 bg-gray-100 cursor-not-allowed"
            )}
          >
            <Sparkles className="w-4 h-4" />
            生成集纲
          </button>
        </div>
      </div>

      {/* 右列 - 展开面板 */}
      {expandedSection && (
        <div className="w-[480px] flex-shrink-0 h-full border-l border-gray-100 overflow-y-auto bg-gray-50/30">
          <div className="p-4 space-y-4">
            {/* 面板标题 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {expandedSection === "content" ? "内容要素" : "剧集规格"}
              </span>
              <button
                onClick={closeExpansion}
                className="p-1 hover:bg-gray-200 rounded transition"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* 内容要素标签 */}
            {expandedSection === "content" && (
              <div className="space-y-3">
                {contentTagGroups.map((group) => (
                  <div key={group.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">
                        {group.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {selectedTags[group.id]?.length || 0}/{group.max}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(group.id, tag, group.max)}
                          className={cn(
                            "px-2 py-1 text-xs rounded-full border transition",
                            selectedTags[group.id]?.includes(tag)
                              ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 剧集规格 - 集数 & 单集时长 */}
            {expandedSection === "writing" && (
              <div className="space-y-4">
                {/* 集数 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">集数</span>
                    <span className="text-xs text-gray-400">单选</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {episodeRangeOptions.map((range) => (
                      <button
                        key={range}
                        onClick={() => setEpisodeRange(range)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-full border transition",
                          episodeRange === range
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                        )}
                      >
                        {range}集
                      </button>
                    ))}
                    <button
                      onClick={() => setEpisodeRange("custom")}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-full border transition",
                        episodeRange === "custom"
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                      )}
                    >
                      自定义
                    </button>
                  </div>
                  {episodeRange === "custom" && (
                    <input
                      type="text"
                      value={customEpisodes}
                      onChange={(e) => setCustomEpisodes(e.target.value.replace(/\D/g, ""))}
                      placeholder="输入集数"
                      className="mt-2 w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-300 bg-white"
                    />
                  )}
                </div>

                {/* 单集时长 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">单集时长</span>
                    <span className="text-xs text-gray-400">单选</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {durationOptions.map((dur) => (
                      <button
                        key={dur}
                        onClick={() => setEpisodeDuration(dur)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-full border transition",
                          episodeDuration === dur
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                        )}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 横竖屏 - 仅漫剧显示 */}
                {sceneType === "comic_drama" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">画面方向</span>
                      <span className="text-xs text-gray-400">单选</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {([
                        { id: "horizontal" as const, label: "横屏" },
                        { id: "vertical" as const, label: "竖屏" },
                      ]).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setScreenOrientation(item.id)}
                          className={cn(
                            "px-3 py-1.5 text-xs rounded-full border transition",
                            screenOrientation === item.id
                              ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 单集镜头数 - 仅脚本显示 */}
                {scriptType === "storyboard" && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">单集镜头数</span>
                      <span className="text-xs text-gray-400">单选</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {shotCountOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setShotCount(shotCount === opt ? null : opt)}
                          className={cn(
                            "px-3 py-1.5 text-xs rounded-full border transition",
                            shotCount === opt
                              ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
