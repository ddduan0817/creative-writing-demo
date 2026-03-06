"use client";

import { useEditorStore } from "@/stores/editorStore";

const marketingTagGroups: Record<string, string[]> = {
  平台: ["小红书", "抖音", "微博", "公众号", "B站", "快手"],
  风格: ["种草安利", "测评对比", "故事型", "干货型", "情绪型", "搞笑型"],
  品类: ["美妆", "服饰", "数码", "美食", "家居", "母婴", "健身"],
};

const knowledgeTagGroups: Record<string, string[]> = {
  内容类型: ["拆书稿", "视频解说", "观点输出", "课程大纲", "深度分析"],
  领域: ["商业", "心理学", "科技", "历史", "文学", "教育", "哲学"],
  风格: ["通俗易懂", "学术严谨", "幽默风趣", "深度思考", "故事化"],
};

export default function SimpleTagsPanel({ scene }: { scene: string }) {
  const { selectedTags, toggleTag } = useEditorStore();
  const tagGroups = scene === "marketing" ? marketingTagGroups : knowledgeTagGroups;

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {scene === "marketing" ? "内容标签" : "专栏标签"}
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
