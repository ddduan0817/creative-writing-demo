"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const scenes = [
  {
    id: "novel",
    name: "小说创作",
    description: "精准把控人设与剧情节奏，轻松打造高质量故事",
    gradient: "from-violet-100 to-purple-50",
    illustration: "🏔️✨",
  },
  {
    id: "screenplay",
    name: "剧本/分镜",
    description: "短剧漫剧一键高效创作，支持小说到剧本一键转换",
    gradient: "from-blue-100 to-cyan-50",
    illustration: "🎥🎭",
  },
  {
    id: "marketing",
    name: "种草文案",
    description: "带货种草高转化文案，一键生成多平台内容",
    gradient: "from-amber-100 to-orange-50",
    illustration: "🛍️✨",
  },
  {
    id: "knowledge",
    name: "知识专栏",
    description: "拆书解读观点输出，深度内容高效产出",
    gradient: "from-emerald-100 to-teal-50",
    illustration: "📝💡",
  },
  {
    id: "general",
    name: "通用写作",
    description: "覆盖各类文案与文稿需求，高效完成日常创作任务",
    gradient: "from-rose-100 to-pink-50",
    illustration: "✍️📄",
  },
];

export default function SceneCards() {
  const [offset, setOffset] = useState(0);
  const router = useRouter();
  const step = 216; // cardWidth(200) + gap(16)
  const maxOffset = step; // only one step needed for 5 cards, 4 visible

  const handleClick = (id: string) => {
    router.push(`/workbench?scene=${id}`);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${offset}px)` }}
        >
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleClick(scene.id)}
              className="flex-shrink-0 w-[200px] rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left group"
            >
              {/* Illustration area */}
              <div
                className={`h-[100px] bg-gradient-to-br ${scene.gradient} flex items-center justify-center text-3xl relative overflow-hidden`}
              >
                <span className="opacity-70 group-hover:scale-110 transition-transform duration-300 text-4xl">
                  {scene.illustration}
                </span>
              </div>
              {/* Text area */}
              <div className="px-4 py-3">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {scene.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {scene.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      {offset > 0 && (
        <button
          onClick={() => setOffset(Math.max(0, offset - step))}
          className="absolute -left-3 top-[50px] -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 z-10"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
      )}

      {/* Right Arrow */}
      {offset < maxOffset && (
        <button
          onClick={() => setOffset(Math.min(maxOffset, offset + step))}
          className="absolute -right-3 top-[50px] -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 z-10"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  );
}
