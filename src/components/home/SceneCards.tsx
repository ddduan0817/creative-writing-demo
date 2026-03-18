"use client";

import { useRouter } from "next/navigation";

const scenes = [
  {
    id: "novel",
    name: "小说创作",
    subtitle: "长篇连载·分章生成",
    description: "构建世界，雕琢人物与情节",
    bg: "bg-purple-50",
    illustration: "📖",
  },
  {
    id: "screenplay",
    name: "剧本脚本",
    subtitle: "影视短剧·画面指令",
    description: "把抽象情绪变成具体的画面",
    bg: "bg-blue-50",
    illustration: "🎬",
  },
  {
    id: "general",
    name: "通用写作",
    subtitle: "自由创作·不限场景",
    description: "任何写作需求，从这里开始",
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
    <div className="grid grid-cols-3 gap-4">
      {scenes.map((scene) => (
        <button
          key={scene.id}
          onClick={() => handleClick(scene.id)}
          className="rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left group"
        >
          {/* Illustration area */}
          <div
            className={`h-[110px] ${scene.bg} flex items-center justify-center`}
          >
            <span className="text-5xl opacity-70 group-hover:scale-110 transition-transform duration-300">
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
  );
}
