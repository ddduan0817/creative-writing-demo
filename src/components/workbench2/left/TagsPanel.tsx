"use client";

import { useEditorStore } from "@/stores/editorStore";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

// 标签数据
const tagData = {
  genre: {
    label: "题材",
    limit: 1,
    type: "single" as const,
    tags: ["言情", "悬疑", "惊悚", "科幻", "武侠", "仙侠", "历史", "玄幻", "奇幻", "都市", "军事", "电竞", "体育", "现实", "游戏", "末日"],
  },
  elements: {
    label: "元素",
    limit: 3,
    type: "multi" as const,
    tags: ["权谋", "婚姻", "家庭", "校园", "职场", "娱乐圈", "重生", "穿越", "犯罪", "丧尸", "探险", "宫斗宅斗", "克苏鲁", "系统", "规则怪谈", "团宠", "囤物资", "先婚后爱", "追妻火葬场", "破镜重圆", "争霸", "超能力", "玄学风水", "种田", "直播", "萌宝", "美食", "鉴宝", "聊天群", "无限流", "快穿", "扮猪吃虎", "马甲文", "金手指", "年代文"],
  },
  style: {
    label: "风格调性",
    limit: 3,
    type: "multi" as const,
    tags: ["甜宠", "虐恋", "暗恋", "沙雕", "爽文", "复仇", "逆袭", "励志", "烧脑", "热血", "求生", "打脸", "治愈", "反套路", "搞笑", "反转", "暗黑", "轻松", "慢热", "1v1", "无CP", "双洁", "先虐后甜"],
  },
  ending: {
    label: "结局",
    limit: 1,
    type: "single" as const,
    tags: ["HE", "BE", "开放式"],
  },
  timespace: {
    label: "时空",
    limit: 1,
    type: "single" as const,
    tags: ["古代", "现代", "近现代", "未来", "架空", "末世"],
  },
};

export default function TagsPanel() {
  const {
    selectedTags,
    setTagGenre,
    toggleTagElement,
    toggleTagStyle,
    setTagEnding,
    setTagTimespace,
    randomizeTags,
    showToast,
  } = useEditorStore();

  const [generating, setGenerating] = useState(false);

  const handleRandomize = () => {
    setGenerating(true);
    setTimeout(() => {
      randomizeTags();
      setGenerating(false);
      showToast("已随机生成标签组合");
    }, 500);
  };

  const getSelectedCount = (key: keyof typeof tagData): number => {
    const val = selectedTags[key];
    if (Array.isArray(val)) return val.length;
    return val ? 1 : 0;
  };

  const isSelected = (key: keyof typeof tagData, tag: string): boolean => {
    const val = selectedTags[key];
    if (Array.isArray(val)) return val.includes(tag);
    return val === tag;
  };

  const handleClick = (key: keyof typeof tagData, tag: string) => {
    const config = tagData[key];
    if (config.type === "single") {
      // 单选：点击已选中的取消，否则选中
      const current = selectedTags[key] as string | null;
      const newVal = current === tag ? null : tag;
      if (key === "genre") setTagGenre(newVal);
      else if (key === "ending") setTagEnding(newVal);
      else if (key === "timespace") setTagTimespace(newVal);
    } else {
      // 多选
      if (key === "elements") toggleTagElement(tag);
      else if (key === "style") toggleTagStyle(tag);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* 一键生成 */}
      <button
        onClick={handleRandomize}
        disabled={generating}
        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition disabled:opacity-50"
      >
        {generating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
        一键生成标签
      </button>

      {/* 各分类标签 */}
      {(Object.keys(tagData) as (keyof typeof tagData)[]).map((key) => {
        const config = tagData[key];
        const count = getSelectedCount(key);

        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {config.label}
              </span>
              <span className="text-xs text-gray-400">
                {count}/{config.limit}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.tags.map((tag) => {
                const selected = isSelected(key, tag);
                const disabled = !selected && config.type === "multi" && count >= config.limit;

                return (
                  <button
                    key={tag}
                    onClick={() => !disabled && handleClick(key, tag)}
                    disabled={disabled}
                    className={`px-2.5 py-1 text-xs rounded-full border transition ${
                      selected
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700 font-medium"
                        : disabled
                        ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 text-gray-500 hover:border-indigo-200 hover:text-indigo-600"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
