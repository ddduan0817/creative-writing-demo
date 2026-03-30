"use client";

import { useRouter } from "next/navigation";

const scenes = [
  {
    id: "ecommerce",
    name: "电商营销文本创作",
    desc: "直播文本 · 产品带货 · 短视频文案",
    bg: "bg-pink-50",
    iconBg: "bg-pink-100",
    illustration: "🛍️",
  },
  {
    id: "reading",
    name: "知识专栏",
    desc: "拆书 · 内容解读 · 知识播客",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    illustration: "📚",
  },
  {
    id: "novel",
    name: "小说网文",
    desc: "长篇小说 · 短篇故事 · 网络文学",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    illustration: "📖",
  },
  {
    id: "general",
    name: "通用写作",
    desc: "文章撰写 · 文案润色 · 素材整理",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    illustration: "✏️",
  },
  {
    id: "screenplay",
    name: "剧本脚本",
    desc: "短剧剧本 · 漫改脚本 · 分镜设计",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    illustration: "🎬",
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
          className="rounded-xl overflow-hidden bg-white border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left group p-4"
        >
          <div
            className={`w-10 h-10 ${scene.iconBg} rounded-lg flex items-center justify-center mb-3`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform duration-300">
              {scene.illustration}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 mb-1">
            {scene.name}
          </h3>
          <p className="text-[11px] leading-relaxed text-gray-400">
            {scene.desc}
          </p>
        </button>
      ))}
    </div>
  );
}
