"use client";

import { useEditorStore } from "@/stores/editorStore";
import { mockAIResponses } from "@/data/mockAIResponses";
import { type Character } from "@/data/mockCharacters";
import { Plus, Sparkles, Loader2, User } from "lucide-react";
import { useState } from "react";

export default function CharactersPanel() {
  const { characters, addCharacter, showToast } = useEditorStore();
  const [generating, setGenerating] = useState(false);

  const mainChars = characters.filter((c) => c.role === "main");
  const secondaryChars = characters.filter((c) => c.role === "secondary");

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const gen = mockAIResponses.generateCharacter;
      addCharacter({ ...gen, id: `c${Date.now()}` });
      setGenerating(false);
      showToast("角色生成完成");
    }, 2000);
  };

  const handleAddManual = () => {
    addCharacter({
      id: `c${Date.now()}`,
      name: "新角色",
      role: "secondary",
      identity: "",
      motivation: "",
      personality: [],
      background: "",
      arc: "",
    });
    showToast("已添加空白角色");
  };

  return (
    <div className="p-4 space-y-4">
      {/* Main characters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">主要角色</span>
          <div className="flex gap-1">
            <button
              onClick={handleAddManual}
              className="p-1 text-gray-400 hover:text-indigo-600 rounded"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="p-1 text-gray-400 hover:text-indigo-600 rounded disabled:opacity-50"
            >
              {generating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
        {mainChars.map((char) => (
          <CharCard key={char.id} char={char} />
        ))}
      </div>

      {/* Secondary characters */}
      <div>
        <span className="text-sm font-medium text-gray-700 block mb-2">
          次要角色
        </span>
        {secondaryChars.map((char) => (
          <CharCard key={char.id} char={char} />
        ))}
        {secondaryChars.length === 0 && (
          <p className="text-xs text-gray-300 italic">暂无次要角色</p>
        )}
      </div>
    </div>
  );
}

function CharCard({ char }: { char: Character }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="mb-2 p-3 rounded-lg border border-gray-100 hover:border-indigo-200 transition cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-indigo-600" />
        </div>
        <div>
          <span className="text-sm font-medium text-gray-900">
            {char.name}
          </span>
          <span className="text-xs text-gray-400 ml-2">{char.identity}</span>
        </div>
      </div>
      {expanded && (
        <div className="mt-2 space-y-1.5 text-xs text-gray-500">
          <p>
            <span className="text-gray-700 font-medium">动机：</span>
            {char.motivation}
          </p>
          <p>
            <span className="text-gray-700 font-medium">性格：</span>
            {char.personality.join(" / ")}
          </p>
          <p>
            <span className="text-gray-700 font-medium">背景：</span>
            {char.background}
          </p>
          <p>
            <span className="text-gray-700 font-medium">人物弧光：</span>
            {char.arc}
          </p>
        </div>
      )}
    </div>
  );
}
