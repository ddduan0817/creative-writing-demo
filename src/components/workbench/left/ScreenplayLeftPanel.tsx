"use client";

import { useEditorStore } from "@/stores/editorStore";
import {
  Upload,
  X,
  FileText,
  Plus,
  ChevronRight,
  Sparkles,
  Users,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// 写作要素标签数据
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

// 写作方式标签数据
const writingTagGroups = [
  {
    id: "perspective",
    label: "叙事视角",
    max: 1,
    tags: ["第一人称", "第二人称", "第三人称"],
  },
  {
    id: "structure",
    label: "叙事结构",
    max: 1,
    tags: ["线性叙事", "倒叙", "插叙", "多线并行"],
  },
  {
    id: "writingStyle",
    label: "文风",
    max: 1,
    tags: ["文艺抒情", "幽默诙谐", "华丽辞藻", "简洁凝练", "口语化", "古风"],
  },
];

export default function ScreenplayLeftPanel() {
  const { showToast, setLeftPanelExpanded } = useEditorStore();

  // 上传的文件
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // 故事梗概
  const [synopsis, setSynopsis] = useState("");

  // 是否已生成设定
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 选中的写作要素标签
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({
    audience: [],
    genre: [],
    timespace: [],
    elements: [],
    relationship: [],
    style: [],
    ending: [],
  });

  // 选中的写作方式标签
  const [selectedWritingTags, setSelectedWritingTags] = useState<Record<string, string[]>>({
    perspective: [],
    structure: [],
    writingStyle: [],
  });

  // 角色列表
  const [characters, setCharacters] = useState<{ name: string; desc: string; role: "主角" | "配角" }[]>([]);

  // 篇幅选择
  const [length, setLength] = useState<"short" | "medium" | "long">("short");

  // 展开的面板
  const [expandedSection, setExpandedSection] = useState<"content" | "writing" | "character" | null>(null);
  const [newCharacter, setNewCharacter] = useState({ name: "", desc: "", role: "主角" as "主角" | "配角" });

  // 切换展开面板
  const toggleSection = (section: "content" | "writing" | "character") => {
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
    const mockFiles = ["小说初稿大明星穿到80年代...", "穿到80年代参考资料.docx"];
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

  // 切换写作方式标签
  const toggleWritingTag = (groupId: string, tag: string, max: number) => {
    setSelectedWritingTags((prev) => {
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

  // 获取已选写作要素标签数量
  const getSelectedCount = () => {
    return Object.values(selectedTags).flat().length;
  };

  // 获取已选写作方式标签数量
  const getWritingSelectedCount = () => {
    return Object.values(selectedWritingTags).flat().length;
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
        setSynopsis(`【故事线】顶流影后苏瑾意外穿越到1985年的小镇，成为供销社售货员的女儿。她需要在这个没有互联网、没有智能手机的年代重新开始...

【核心冲突】1. 现代娱乐理念VS80年代文艺体制的碰撞
2. 身份隐藏与真相揭露的悬念
3. 新旧观念的冲突与融合

【情感设定】与镇上文艺青年的纯真爱情，从相互看不顺眼到惺惺相惜...`);
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

  const handleCreateArticle = () => {
    if (!isGenerated) {
      showToast("请先点击「生成设定」按钮");
      return;
    }
    showToast("正在生成文章...");
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
              <textarea
                value={synopsis}
                onChange={(e) => {
                  setSynopsis(e.target.value);
                  setIsGenerated(false);
                }}
                placeholder={`【故事线】请输入故事的主要情节走向...

【核心冲突】故事的主要矛盾和冲突...

【情感设定】角色之间的情感关系...`}
                className={cn(
                  "w-full h-[180px] text-sm border rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-300 leading-relaxed",
                  isGenerated ? "border-green-300 bg-green-50/30" : "border-gray-200"
                )}
              />

              {/* 生成设定按钮 */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={cn(
                  "w-full mt-2 py-2 text-sm rounded-lg transition flex items-center justify-center gap-2",
                  isGenerated
                    ? "bg-green-50 text-green-600 border border-green-200"
                    : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    生成中...
                  </>
                ) : isGenerated ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    已生成设定（点击重新生成）
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    生成设定
                  </>
                )}
              </button>
            </div>

            {/* 篇幅选择 */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-gray-600">篇幅</span>
                <span className="text-[10px] text-red-400">*必选</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: "short" as const, label: "短篇", desc: "<5000字" },
                  { id: "medium" as const, label: "中篇", desc: "5000-2万字" },
                  { id: "long" as const, label: "长篇", desc: "≥2万字" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLength(item.id)}
                    className={cn(
                      "flex-1 py-2 px-2 rounded-lg border transition text-center",
                      length === item.id
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 写作方式 */}
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
                  <span>写作方式</span>
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

              {/* 已选写作方式预览 */}
              {getWritingSelectedCount() > 0 && expandedSection !== "writing" && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.entries(selectedWritingTags).flatMap(([, tags]) =>
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

            {/* 写作要素 */}
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
                  <span>写作要素</span>
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
            <div>
              <button
                onClick={() => toggleSection("character")}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition text-sm",
                  characters.length > 0
                    ? "border-indigo-200 bg-indigo-50/50 text-indigo-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>角色</span>
                  {characters.length > 0 && (
                    <span className="text-xs text-indigo-500">
                      {characters.length} 个角色
                    </span>
                  )}
                </div>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform",
                    expandedSection === "character" && "rotate-90"
                  )}
                />
              </button>

              {/* 已添加角色预览 */}
              {characters.length > 0 && expandedSection !== "character" && (
                <div className="mt-2 space-y-1.5">
                  {characters.map((char, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0",
                          char.role === "主角" ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-500"
                        )}>
                          {char.name[0]}
                        </div>
                        <span className="text-xs text-gray-700 truncate">
                          {char.name}
                        </span>
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0",
                          char.role === "主角" ? "bg-indigo-50 text-indigo-500" : "bg-gray-100 text-gray-400"
                        )}>
                          {char.role}
                        </span>
                      </div>
                      <button
                        onClick={() => removeCharacter(i)}
                        className="p-1 hover:bg-gray-200 rounded transition"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="p-4 border-t border-gray-100">
          {length === "short" ? (
            <button
              onClick={handleCreateArticle}
              disabled={!isGenerated}
              className={cn(
                "w-full py-2.5 text-sm font-medium rounded-lg transition flex items-center justify-center gap-2",
                isGenerated
                  ? "text-white bg-indigo-600 hover:bg-indigo-700"
                  : "text-gray-400 bg-gray-100 cursor-not-allowed"
              )}
            >
              <Sparkles className="w-4 h-4" />
              直接生成文章
            </button>
          ) : (
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
              <FileText className="w-4 h-4" />
              先生成大纲
            </button>
          )}
        </div>
      </div>

      {/* 右列 - 展开面板 */}
      {expandedSection && (
        <div className="w-[480px] flex-shrink-0 h-full border-l border-gray-100 overflow-y-auto bg-gray-50/30">
          <div className="p-4 space-y-4">
            {/* 面板标题 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {expandedSection === "content" ? "写作要素" : expandedSection === "writing" ? "写作方式" : "角色"}
              </span>
              <button
                onClick={closeExpansion}
                className="p-1 hover:bg-gray-200 rounded transition"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* 写作要素标签 */}
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

            {/* 写作方式标签 */}
            {expandedSection === "writing" && (
              <div className="space-y-3">
                {writingTagGroups.map((group) => (
                  <div key={group.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">
                        {group.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {selectedWritingTags[group.id]?.length || 0}/{group.max}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleWritingTag(group.id, tag, group.max)}
                          className={cn(
                            "px-2 py-1 text-xs rounded-full border transition",
                            selectedWritingTags[group.id]?.includes(tag)
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

            {/* 角色管理 */}
            {expandedSection === "character" && (
              <div className="space-y-3">
                <div className="text-xs font-medium text-gray-600">添加角色</div>
                <div className="flex gap-2">
                  {(["主角", "配角"] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => setNewCharacter((p) => ({ ...p, role }))}
                      className={cn(
                        "flex-1 py-1.5 text-xs rounded-lg border transition",
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
                  onChange={(e) =>
                    setNewCharacter((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="角色名称"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-300 bg-white"
                />
                <textarea
                  value={newCharacter.desc}
                  onChange={(e) =>
                    setNewCharacter((p) => ({ ...p, desc: e.target.value }))
                  }
                  placeholder="角色简介（选填）"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-indigo-300 bg-white"
                  rows={2}
                />
                <button
                  onClick={addCharacter}
                  className="w-full py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                >
                  添加角色
                </button>

                {/* 已有角色列表 */}
                {characters.length > 0 && (
                  <div className="border-t border-gray-200 pt-3 space-y-1.5">
                    <div className="text-xs text-gray-400">已添加角色</div>
                    {characters.map((char, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-2 py-1.5 bg-white rounded-lg"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full",
                            char.role === "主角" ? "bg-indigo-50 text-indigo-500" : "bg-gray-100 text-gray-400"
                          )}>
                            {char.role}
                          </span>
                          <span className="text-xs text-gray-600">{char.name}</span>
                        </div>
                        <button
                          onClick={() => removeCharacter(i)}
                          className="p-0.5 hover:bg-gray-200 rounded"
                        >
                          <X className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    ))}
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
