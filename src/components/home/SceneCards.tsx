"use client";

import { useRouter } from "next/navigation";

const scenes = [
  {
    id: "ecommerce",
    name: "电商种草",
    bg: "bg-pink-50",
    illustration: "🛍️",
  },
  {
    id: "reading",
    name: "知识专栏",
    bg: "bg-emerald-50",
    illustration: "📚",
  },
  {
    id: "novel",
    name: "小说创作",
    bg: "bg-purple-50",
    illustration: "📖",
  },
  {
    id: "screenplay",
    name: "剧本脚本",
    bg: "bg-blue-50",
    illustration: "🎬",
  },
  {
    id: "general",
    name: "通用写作",
    bg: "bg-orange-50",
    illustration: "✏️",
  },
];

export default function SceneCards() {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/workbench?scene=${id}`);
  };

  return (
    <div className="grid grid-cols-5 gap-3">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          onClick={() => handleClick(scene.id)}
          className="rounded-xl overflow-hidden bg-white border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center group"
        >
          <div
            className={`h-[52px] ${scene.bg} flex items-center justify-center`}
          >
            <span className="text-2xl opacity-70 group-hover:scale-110 transition-transform duration-300">
              {scene.illustration}
            </span>
          </div>
          <div className="px-2 py-2">
            <h3 className="text-xs font-medium text-gray-700">
              {scene.name}
            </h3>
          </div>
        </button>
      ))}
    </div>
  );
}
