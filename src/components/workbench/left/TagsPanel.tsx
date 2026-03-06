"use client";

import { useEditorStore } from "@/stores/editorStore";

const tagGroups = {
  题材: ["玄幻", "仙侠", "科幻", "都市", "历史", "悬疑", "言情", "架空"],
  情节: ["重生", "穿越", "系统", "升级", "宫斗", "复仇", "夺嫡", "探险"],
  情绪: ["爽", "虐", "燃", "甜", "痒", "惊", "暖", "冷"],
};

export default function TagsPanel() {
  const { selectedTags, toggleTag } = useEditorStore();

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        作品标签
      </h3>
      {Object.entries(tagGroups).map(([group, tags]) => (
        <div key={group}>
          <p className="text-sm font-medium text-gray-700 mb-2">{group}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`chip ${
                  selectedTags.includes(tag)
                    ? "chip-selected"
                    : "chip-default"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
