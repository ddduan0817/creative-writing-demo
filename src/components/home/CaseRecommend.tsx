"use client";

export default function CaseRecommend() {
  const cases = [
    {
      title: "「重生后我成了修仙界团宠」开篇技巧解析",
      tag: "小说创作",
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "3分钟短剧：如何在前3秒抓住观众",
      tag: "剧本生成",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "小红书爆款种草文案的5个公式",
      tag: "种草文案",
      color: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div>
      {/* Section divider matching prototype */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm font-semibold text-gray-800">案例推荐</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {cases.map((item, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition cursor-pointer group"
          >
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-medium mb-3 ${item.color}`}
            >
              {item.tag}
            </span>
            <p className="text-sm text-gray-600 group-hover:text-gray-900 transition line-clamp-2 leading-relaxed">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
