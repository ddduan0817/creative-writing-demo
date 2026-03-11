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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// 标签数据
const tagGroups = [
  {
    id: "genre",
    label: "题材",
    max: 1,
    tags: ["言情", "悬疑", "惊悚", "科幻", "武侠", "仙侠", "历史", "玄幻", "奇幻", "都市", "军事", "电竞", "体育", "现实", "游戏", "末日"],
  },
  {
    id: "elements",
    label: "元素",
    max: 3,
    tags: ["权谋", "婚姻", "家庭", "校园", "职场", "娱乐圈", "重生", "穿越", "犯罪", "丧尸", "探险", "宫斗宅斗", "克苏鲁", "系统", "规则怪谈", "团宠", "囤物资", "先婚后爱", "追妻火葬场", "破镜重圆"],
  },
  {
    id: "style",
    label: "风格调性",
    max: 3,
    tags: ["甜宠", "虐恋", "暗恋", "沙雕", "爽文", "复仇", "逆袭", "励志", "烧脑", "热血", "求生", "打脸", "治愈", "反套路", "搞笑", "反转", "暗黑", "轻松", "慢热"],
  },
  {
    id: "ending",
    label: "结局",
    max: 1,
    tags: ["HE", "BE", "开放式"],
  },
  {
    id: "timespace",
    label: "时空",
    max: 1,
    tags: ["古代", "现代", "近现代", "未来", "架空", "末世"],
  },
];

export default function LeftPanel() {
  const { showToast } = useEditorStore();

  // 上传的文件
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // 故事梗概
  const [synopsis, setSynopsis] = useState("");

  // 选中的标签
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({
    genre: [],
    elements: [],
    style: [],
    ending: [],
    timespace: [],
  });

  // 角色列表
  const [characters, setCharacters] = useState<{ name: string; desc: string }[]>([]);

  // 浮层状态
  const [showStylePopup, setShowStylePopup] = useState(false);
  const [showCharacterPopup, setShowCharacterPopup] = useState(false);
  const [newCharacter, setNewCharacter] = useState({ name: "", desc: "" });

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
  };

  // 切换标签选中
  const toggleTag = (groupId: string, tag: string, max: number) => {
    setSelectedTags((prev) => {
      const current = prev[groupId] || [];
      if (current.includes(tag)) {
        return { ...prev, [groupId]: current.filter((t) => t !== tag) };
      }
      if (current.length >= max) {
        // 单选时替换，多选时提示
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
    setNewCharacter({ name: "", desc: "" });
    setShowCharacterPopup(false);
    showToast("角色添加成功");
  };

  // 删除角色
  const removeCharacter = (index: number) => {
    setCharacters((prev) => prev.filter((_, i) => i !== index));
  };

  // 获取已选标签数量
  const getSelectedCount = () => {
    return Object.values(selectedTags).flat().length;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden w-72 bg-white">
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

            {/* 已上传文件 */}
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
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="【故事线】请输入故事的主要情节走向...&#10;&#10;【核心冲突】故事的主要矛盾和冲突...&#10;&#10;【情感设定】角色之间的情感关系..."
              className="w-full h-[200px] text-sm border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-300 leading-relaxed"
            />
          </div>

          {/* +风格 按钮 */}
          <div className="relative">
            <button
              onClick={() => setShowStylePopup(!showStylePopup)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition text-sm",
                getSelectedCount() > 0
                  ? "border-indigo-200 bg-indigo-50/50 text-indigo-700"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              )}
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <span>风格</span>
                {getSelectedCount() > 0 && (
                  <span className="text-xs text-indigo-500">
                    已选 {getSelectedCount()} 项
                  </span>
                )}
              </div>
              <ChevronRight
                className={cn(
                  "w-4 h-4 transition-transform",
                  showStylePopup && "rotate-90"
                )}
              />
            </button>

            {/* 已选标签预览 */}
            {getSelectedCount() > 0 && !showStylePopup && (
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

            {/* 风格浮层 */}
            {showStylePopup && (
              <div className="absolute left-full top-0 ml-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-[400px] overflow-y-auto">
                <div className="p-3 space-y-3">
                  {tagGroups.map((group) => (
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
                                : "border-gray-200 text-gray-500 hover:border-gray-300"
                            )}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* +角色 按钮 */}
          <div className="relative">
            <button
              onClick={() => setShowCharacterPopup(!showCharacterPopup)}
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
                  showCharacterPopup && "rotate-90"
                )}
              />
            </button>

            {/* 已添加角色预览 */}
            {characters.length > 0 && !showCharacterPopup && (
              <div className="mt-2 space-y-1.5">
                {characters.map((char, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-2.5 py-1.5 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 flex-shrink-0">
                        {char.name[0]}
                      </div>
                      <span className="text-xs text-gray-700 truncate">
                        {char.name}
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

            {/* 角色浮层 */}
            {showCharacterPopup && (
              <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                <div className="p-3 space-y-3">
                  <div className="text-xs font-medium text-gray-600">添加角色</div>
                  <input
                    type="text"
                    value={newCharacter.name}
                    onChange={(e) =>
                      setNewCharacter((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="角色名称"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-300"
                  />
                  <textarea
                    value={newCharacter.desc}
                    onChange={(e) =>
                      setNewCharacter((p) => ({ ...p, desc: e.target.value }))
                    }
                    placeholder="角色简介（选填）"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-indigo-300"
                    rows={2}
                  />
                  <button
                    onClick={addCharacter}
                    className="w-full py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
                  >
                    添加
                  </button>

                  {/* 已有角色列表 */}
                  {characters.length > 0 && (
                    <div className="border-t border-gray-100 pt-3 space-y-1.5">
                      <div className="text-xs text-gray-400">已添加角色</div>
                      {characters.map((char, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded-lg"
                        >
                          <span className="text-xs text-gray-600">{char.name}</span>
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={() => showToast("正在生成大纲...")}
          className="w-full py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          先生成大纲
        </button>
        <button
          onClick={() => showToast("正在生成文章...")}
          className="w-full py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          直接生成文章
        </button>
      </div>
    </div>
  );
}
