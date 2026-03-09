"use client";

import { useEditorStore } from "@/stores/editorStore";
import { mockAIResponses } from "@/data/mockAIResponses";
import { type Character } from "@/data/mockCharacters";
import { Plus, Sparkles, Loader2, User, Edit2 } from "lucide-react";
import { useState } from "react";
import { simulateAIStream } from "@/lib/aiSimulator";

// 性格标签选项
const personalityOptions = [
  "傲娇", "腹黑", "忠犬", "病娇", "逗比", "高冷", "温柔", "暴躁",
  "隐忍", "聪慧", "天真", "果决", "细腻", "刚正", "固执",
  "重情义", "外冷内热", "亦正亦邪", "孤僻", "热情", "狡猾"
];

// Mock AI 生成内容
const mockFieldGenerations: Record<string, (name: string) => string> = {
  identity: (name) => `${name}是一位神秘的游方术士，表面上以占卜为生，实际上是某个古老组织的成员`,
  motivation: (name) => `${name}渴望找回失去的记忆，揭开自己身世的秘密，同时保护身边重要的人`,
  background: (name) => `${name}自幼被养父收养，在偏僻的山村长大。十年前的一场变故让他失去了所有记忆，只留下一枚古老的玉佩。此后他四处漂泊，直到在某座城市遇到了改变命运的契机...`,
  arc: () => `从逃避过去的流浪者 → 直面命运的承担者`,
};

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
  const [generatingField, setGeneratingField] = useState<string | null>(null);

  const updateCharacter = (updates: Partial<Character>) => {
    setLocalChar((prev) => ({ ...prev, ...updates }));
  };

  const handleGenerateField = (field: keyof Character) => {
    if (field === "name" || field === "id" || field === "role" || field === "personality") return;

    setGeneratingField(field);
    const generator = mockFieldGenerations[field];
    const text = generator ? generator(localChar.name) : "AI 生成的内容...";

    simulateAIStream(text, (current, done) => {
      updateCharacter({ [field]: current });
      if (done) {
        setGeneratingField(null);
      }
    });
  };

  const handleSave = () => {
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

  // 带AI生成按钮的输入框
  const FieldWithAI = ({
    label,
    field,
    placeholder,
    multiline = false,
  }: {
    label: string;
    field: keyof Character;
    placeholder: string;
    multiline?: boolean;
  }) => {
    const value = localChar[field] as string;
    const isGenerating = generatingField === field;

    return (
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-500">{label}</label>
          <button
            onClick={() => handleGenerateField(field)}
            disabled={isGenerating}
            className="flex items-center gap-1 px-1.5 py-0.5 text-xs text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3" />
            )}
          </button>
        </div>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => updateCharacter({ [field]: e.target.value })}
            placeholder={placeholder}
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 resize-none focus:outline-none focus:border-indigo-300 placeholder:text-gray-300"
            rows={3}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => updateCharacter({ [field]: e.target.value })}
            placeholder={placeholder}
            className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-300 placeholder:text-gray-300"
          />
        )}
      </div>
    );
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

        <FieldWithAI label="身份" field="identity" placeholder="角色的社会身份/职业..." />

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

        <FieldWithAI label="动机" field="motivation" placeholder="角色的核心目标/驱动力..." />
        <FieldWithAI label="背景故事" field="background" placeholder="成长经历/重要事件..." multiline />
        <FieldWithAI label="人物弧光" field="arc" placeholder="开场状态 → 结局改变" />

        {/* 操作按钮 */}
        <div className="flex justify-between pt-2 border-t border-gray-200">
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
