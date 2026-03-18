"use client";

import { useRouter } from "next/navigation";

const scenes = [
  {
    id: "novel",
    name: "小说创作",
    subtitle: "长篇连载·分章生成",
    bg: "bg-purple-50",
    illustration: "📖",
  },
  {
    id: "screenplay",
    name: "剧本分镜",
    subtitle: "影视短剧·画面指令",
    bg: "bg-blue-50",
    illustration: "🎬",
  },
  {
    id: "general",
    name: "通用写作",
    subtitle: "自由创作·不限场景",
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
    <div className="grid grid-cols-2 gap-4">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          onClick={() => handleClick(scene.id)}
          className="rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left"
        >
          {/* Illustration area */}
          <div
            className={`h-[88px] ${scene.bg} flex items-center justify-center`}
          >
            <span className="text-4xl">{scene.illustration}</span>
          </div>
          {/* Text area */}
          <div className="px-4 py-3">
            <h3 className="text-sm font-bold text-gray-900">{scene.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{scene.subtitle}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
