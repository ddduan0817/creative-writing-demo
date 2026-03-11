"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

// 5 cards total, 3 visible at a time, scroll index 0~2
const VISIBLE = 3;
const GAP = 16; // gap-4 = 16px
const MAX_INDEX = scenes.length - VISIBLE; // 2

export default function SceneCards2() {
  const router = useRouter();
  const [scrollIndex, setScrollIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  const updateCardWidth = useCallback(() => {
    if (containerRef.current) {
      const containerW = containerRef.current.offsetWidth;
      setCardWidth((containerW - GAP * (VISIBLE - 1)) / VISIBLE);
    }
  }, []);

  useEffect(() => {
    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, [updateCardWidth]);

  const handleClick = (id: string) => {
    router.push(`/workbench2?scene=${id}`);
  };

  const offset = scrollIndex * (cardWidth + GAP);

  return (
    <div className="relative">
      {/* Scroll container */}
      <div ref={containerRef} className="overflow-hidden">
        <div
          className="flex gap-4"
          style={{
            transform: `translateX(-${offset}px)`,
            transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleClick(scene.id)}
              className="rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-left group flex-shrink-0"
              style={{ width: cardWidth || "calc((100% - 32px) / 3)" }}
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
      </div>

      {/* Left Arrow */}
      {scrollIndex > 0 && (
        <button
          onClick={() => setScrollIndex((i) => Math.max(0, i - 1))}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 z-10"
        >
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
      )}

      {/* Right Arrow */}
      {scrollIndex < MAX_INDEX && (
        <button
          onClick={() => setScrollIndex((i) => Math.min(MAX_INDEX, i + 1))}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 z-10"
        >
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  );
}
