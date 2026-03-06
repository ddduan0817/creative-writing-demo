"use client";

import { Download, Calendar, FileText } from "lucide-react";

export default function CreationStats() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">创作情况</h2>

      {/* Main Stat */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">1</span>
          <span className="text-lg font-bold text-gray-900">万字</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          相当于完成了鲁迅的短篇小说《祝福》
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
            style={{ width: "35%" }}
          />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Download className="w-3.5 h-3.5 text-gray-400" />
          <span>导出次数</span>
          <span className="font-semibold text-gray-700 ml-1">0次</span>
        </div>
        <div className="w-px h-3 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>连续创作</span>
          <span className="font-semibold text-gray-700 ml-1">37天</span>
        </div>
        <div className="w-px h-3 bg-gray-200" />
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          <span>作品数</span>
          <span className="font-semibold text-gray-700 ml-1">2篇</span>
        </div>
      </div>
    </div>
  );
}
