"use client";

import { mockWorks } from "@/data/mockWorks";

export default function CreationStats() {
  const totalWords = mockWorks.reduce((sum, w) => sum + w.wordCount, 0);
  const totalWordsWan = (totalWords / 10000).toFixed(1);
  const worksCount = mockWorks.length;

  const getComparison = () => {
    if (totalWords >= 50000) return "相当于完成了一部中篇小说";
    if (totalWords >= 30000) return "相当于完成了鲁迅的《阿Q正传》";
    if (totalWords >= 10000) return "相当于完成了鲁迅的《阿Q正传》";
    return "继续加油，向第一个万字迈进！";
  };

  // Mock weekly data
  const weeklyData = [
    { label: "一", words: 1200, isToday: false },
    { label: "二", words: 850, isToday: false },
    { label: "三", words: 2100, isToday: false },
    { label: "四", words: 0, isToday: false },
    { label: "五", words: 1680, isToday: false },
    { label: "六", words: 3200, isToday: false },
    { label: "日", words: 960, isToday: true },
  ];
  const maxWords = Math.max(...weeklyData.map((d) => d.words));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col h-full">
      <h2 className="text-sm font-semibold text-gray-800 mb-3">创作情况</h2>

      {/* Main Stat */}
      <div className="mb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {totalWordsWan}
          </span>
          <span className="text-lg font-bold text-gray-900">万字</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">{getComparison()}</p>
      </div>

      {/* Weekly Word Count Chart */}
      <div className="flex-1 mb-4 min-h-[120px] flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">近7天字数</span>
          <span className="text-xs text-gray-300">共 {weeklyData.reduce((s, d) => s + d.words, 0).toLocaleString()} 字</span>
        </div>
        <div className="flex-1 flex items-end gap-1.5">
          {weeklyData.map((day) => {
            const heightPercent = maxWords > 0 ? (day.words / maxWords) * 100 : 0;
            return (
              <div key={day.label} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full flex justify-center">
                  <div className="absolute -top-5 px-1 py-0.5 bg-gray-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {day.words.toLocaleString()}字
                  </div>
                </div>
                <div className="w-full rounded-t-sm bg-gray-100 relative" style={{ height: "80px" }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t-sm transition-all duration-500 ${
                      day.isToday
                        ? "bg-gradient-to-t from-blue-500 to-blue-400"
                        : "bg-gradient-to-t from-emerald-400 to-teal-300"
                    }`}
                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                  />
                </div>
                <span className={`text-[10px] ${day.isToday ? "text-blue-500 font-medium" : "text-gray-300"}`}>
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="flex items-center justify-between text-center">
        <div>
          <div className="text-xs text-gray-400">导出次数</div>
          <div className="text-sm font-semibold text-gray-700 mt-0.5">
            0<span className="text-xs font-normal text-gray-400">次</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">连续创作天数</div>
          <div className="text-sm font-semibold text-gray-700 mt-0.5">
            37<span className="text-xs font-normal text-gray-400">天</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400">作品数</div>
          <div className="text-sm font-semibold text-gray-700 mt-0.5">
            {worksCount}
            <span className="text-xs font-normal text-gray-400">篇</span>
          </div>
        </div>
      </div>
    </div>
  );
}
