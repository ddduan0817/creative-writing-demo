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

      {/* Chart Placeholder */}
      <div className="flex-1 bg-gray-50 rounded-xl flex items-center justify-center mb-4 min-h-[120px]">
        <span className="text-xs text-gray-300">统计图@pm</span>
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
