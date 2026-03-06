"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const scenes = [
  {
    id: "novel",
    name: "小说创作",
    subtitle: "长篇连载 · 分章生成",
    description: "构建世界，雕琢人物与情节",
    gradient: "from-violet-100 to-purple-50",
    illustration: "📖",
  },
  {
    id: "screenplay",
    name: "剧本/分镜",
    subtitle: "影视短剧 · 画面指令",
    description: "把抽象情绪变成具体的画面",
    gradient: "from-blue-100 to-cyan-50",
    illustration: "🎬",
  },
  {
    id: "marketing",
    name: "种草文案",
    subtitle: "带货种草 · 高转化",
    description: "写出让人心动的种草内容",
    gradient: "from-amber-100 to-orange-50",
    illustration: "🌿",
  },
  {
    id: "knowledge",
    name: "知识专栏",
    subtitle: "拆书解读 · 观点输出",
    description: "把知识变成大众爱看的内容",
    gradient: "from-emerald-100 to-teal-50",
    illustration: "📚",
  },
  {
    id: "general",
    name: "通用写作",
    subtitle: "自由创作 · 不限场景",
    description: "任何写作需求，从这里开始",
    gradient: "from-rose-100 to-pink-50",
    illustration: "✏️",
  },
];

export default function SceneCards() {
  // Two states: 0 = first 3 cards, 1 = last 3 cards
  const [page, setPage] = useState(0);
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/workbench?scene=${id}`);
  };

  // State A: index 0,1,2  State B: index 2,3,4
  const visibleScenes = page === 0 ? scenes.slice(0, 3) : scenes.slice(2, 5);

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-4">
        {visibleScenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => handleClick(scene.id)}
            className="rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left group"
          >
            {/* Illustration area */}
            <div
              className={`h-[110px] bg-gradient-to-br ${scene.gradient} flex items-center justify-center relative overflow-hidden`}
            >
              <span className="opacity-70 group-hover:scale-110 transition-transform duration-300 text-5xl">
                {scene.illustration}
              </span>
            </div>
            {/* Text area */}
            <div className="px-4 py-3">
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                {scene.name}
              </h3>
              {/* Default: subtitle, Hover: description */}
              <p className="text-xs text-gray-400 leading-relaxed h-[18px] overflow-hidden">
                <span className="block transition-transform duration-300 group-hover:-translate-y-[18px]">
                  <span className="block h-[18px]">{scene.subtitle}</span>
                  <span className="block h-[18px]">{scene.description}</span>
                </span>
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Left Arrow - only in State B */}
      {page === 1 && (
        <button
          onClick={() => setPage(0)}
          className="absolute -left-3 top-[55px] -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 z-10"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
      )}

      {/* Right Arrow - only in State A */}
      {page === 0 && (
        <button
          onClick={() => setPage(1)}
          className="absolute -right-3 top-[55px] -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 z-10"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  );
}
