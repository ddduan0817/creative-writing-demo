"use client";

import { useEditorStore } from "@/stores/editorStore";
import { mockAIResponses } from "@/data/mockAIResponses";
import { type Character } from "@/data/mockCharacters";
import { Plus, Sparkles, Loader2, User, ChevronDown, X, Edit2 } from "lucide-react";
import { useState } from "react";

// 性格标签选项
const personalityOptions = [
  "傲娇", "腹黑", "忠犬", "病娇", "逗比", "高冷", "温柔", "暴躁",
  "隐忍", "聪慧", "天真", "腹黑", "果决", "细腻", "刚正", "固执",
  "重情义", "外冷内热", "亦正亦邪", "孤僻", "热情", "狡猾"
];

export default function CharactersPanel() {
  const { characters, addCharacter, showToast } = useEditorStore();
  const [generating, setGenerating] = useState(false);
  const [editingCharId, setEditingCharId] = useState<string | null>(null);

  const mainChars = characters.filter((c) => c.role === "main");
  const secondaryChars = characters.filter((c) => c.role === "secondary");

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const gen = mockAIResponses.generateCharacter;
      const newChar = { ...gen, id: `c${Date.now()}` };
      addCharacter(newChar);
      setGenerating(false);
      setEditingCharId(newChar.id);
      showToast("角色生成完成");
    }, 2000);
  };

  const handleAddManual = () => {
    const newChar: Character = {
      id: `c${Date.now()}`,
      name: "新角色",
      role: "secondary",
      identity: "",
      motivation: "",
      personality: [],
      background: "",
      arc: "",
    };
    addCharacter(newChar);
    setEditingCharId(newChar.id);
    showToast("已添加空白角色");
  };

  return (
    <div className="p-4 space-y-4">
      {/* 快捷操作 */}
      <div className="flex gap-2">
        <button
          onClick={handleAddManual}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          手动添加
        </button>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          AI 生成
        </button>
      </div>

      {/* Main characters */}
      <div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
          主要角色
        </span>
        {mainChars.length === 0 ? (
          <p className="text-xs text-gray-300 italic">暂无主要角色</p>
        ) : (
          mainChars.map((char) => (
            <CharCard
              key={char.id}
              char={char}
              isEditing={editingCharId === char.id}
              onEdit={() => setEditingCharId(editingCharId === char.id ? null : char.id)}
            />
          ))
        )}
      </div>

      {/* Secondary characters */}
      <div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
          次要角色
        </span>
        {secondaryChars.length === 0 ? (
          <p className="text-xs text-gray-300 italic">暂无次要角色</p>
        ) : (
          secondaryChars.map((char) => (
            <CharCard
              key={char.id}
              char={char}
              isEditing={editingCharId === char.id}
              onEdit={() => setEditingCharId(editingCharId === char.id ? null : char.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CharCard({
  char,
  isEditing,
  onEdit,
}: {
  char: Character;
  isEditing: boolean;
  onEdit: () => void;
}) {
  const { characters, showToast } = useEditorStore();
  const [localChar, setLocalChar] = useState(char);

  const updateCharacter = (updates: Partial<Character>) => {
    setLocalChar((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    // 更新 store 中的角色
    useEditorStore.setState({
      characters: characters.map((c) => (c.id === char.id ? localChar : c)),
    });
    showToast("角色已保存");
    onEdit();
  };

  const handleDelete = () => {
    useEditorStore.setState({
      characters: characters.filter((c) => c.id !== char.id),
    });
    showToast("角色已删除");
  };

  const togglePersonality = (tag: string) => {
    const current = localChar.personality;
    if (current.includes(tag)) {
      updateCharacter({ personality: current.filter((t) => t !== tag) });
    } else if (current.length < 5) {
      updateCharacter({ personality: [...current, tag] });
    }
  };

  if (isEditing) {
    return (
      <div className="mb-3 p-3 rounded-lg border border-indigo-200 bg-indigo-50/30">
        {/* 基础信息 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">姓名</label>
            <input
              type="text"
              value={localChar.name}
              onChange={(e) => updateCharacter({ name: e.target.value })}
              className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-300"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">角色类型</label>
            <select
              value={localChar.role}
              onChange={(e) => updateCharacter({ role: e.target.value as "main" | "secondary" })}
              className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-300 bg-white"
            >
              <option value="main">主要角色</option>
              <option value="secondary">次要角色</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">身份</label>
          <input
            type="text"
            value={localChar.identity}
            onChange={(e) => updateCharacter({ identity: e.target.value })}
            placeholder="角色的社会身份/职业..."
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-300 placeholder:text-gray-300"
          />
        </div>

        {/* 性格标签 */}
        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1.5 block">
            性格标签 <span className="text-gray-300">({localChar.personality.length}/5)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {personalityOptions.map((tag) => (
              <button
                key={tag}
                onClick={() => togglePersonality(tag)}
                className={`px-2 py-0.5 text-xs rounded-full border transition ${
                  localChar.personality.includes(tag)
                    ? "border-indigo-300 bg-indigo-100 text-indigo-700"
                    : "border-gray-200 text-gray-500 hover:border-indigo-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">动机</label>
          <textarea
            value={localChar.motivation}
            onChange={(e) => updateCharacter({ motivation: e.target.value })}
            placeholder="角色的核心目标/驱动力..."
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 resize-none focus:outline-none focus:border-indigo-300 placeholder:text-gray-300"
            rows={2}
          />
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">背景故事</label>
          <textarea
            value={localChar.background}
            onChange={(e) => updateCharacter({ background: e.target.value })}
            placeholder="童年经历/重要事件/高光时刻..."
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 resize-none focus:outline-none focus:border-indigo-300 placeholder:text-gray-300"
            rows={3}
          />
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-500 mb-1 block">人物弧光</label>
          <input
            type="text"
            value={localChar.arc}
            onChange={(e) => updateCharacter({ arc: e.target.value })}
            placeholder="开场性格 → 结局改变（如：从逃避者到承担者）"
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-300 placeholder:text-gray-300"
          />
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-between pt-2 border-t border-gray-100">
          <button
            onClick={handleDelete}
            className="text-xs text-red-500 hover:text-red-600 transition"
          >
            删除角色
          </button>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded transition"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mb-2 p-3 rounded-lg border border-gray-100 hover:border-indigo-200 transition cursor-pointer group"
      onClick={onEdit}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{char.name}</span>
            {char.identity && (
              <span className="text-xs text-gray-400 truncate">{char.identity}</span>
            )}
          </div>
          {char.personality.length > 0 && (
            <div className="flex gap-1 mt-1">
              {char.personality.slice(0, 3).map((p) => (
                <span key={p} className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-500 rounded">
                  {p}
                </span>
              ))}
              {char.personality.length > 3 && (
                <span className="text-[10px] text-gray-400">+{char.personality.length - 3}</span>
              )}
            </div>
          )}
        </div>
        <Edit2 className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 transition" />
      </div>
    </div>
  );
}
