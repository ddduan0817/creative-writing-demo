"use client";

import { useState } from "react";
import SceneCards from "@/components/home/SceneCards";
import SceneCards2 from "@/components/home/SceneCards2";
import RecentWorks from "@/components/home/RecentWorks";
import CreationStats from "@/components/home/CreationStats";
import CaseRecommend from "@/components/home/CaseRecommend";
import Sidebar from "@/components/home/Sidebar";
import { Plus, User } from "lucide-react";

export default function Home() {
  const [activeVersion, setActiveVersion] = useState<1 | 2>(1);

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex justify-end items-center px-8 py-4 gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-medium rounded-full hover:bg-orange-100 transition">
            🎉 每日任务
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <User className="w-5 h-5" />
          </button>
        </div>

        <main className="max-w-[960px] mx-auto px-8 pb-8 space-y-6">
          {/* Version Tabs */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setActiveVersion(1)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                activeVersion === 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              创意写作 1 (改版中)
            </button>
            <button
              onClick={() => setActiveVersion(2)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                activeVersion === 2
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              创意写作 2 (备份)
            </button>
          </div>

          {activeVersion === 1 ? (
            <>
              {/* Scene Cards + Creation Stats */}
              <div className="grid grid-cols-[2fr_1fr] gap-5 items-start">
                <SceneCards />
                <CreationStats />
              </div>
              {/* Recent Works */}
              <RecentWorks />
            </>
          ) : (
            <>
              <section>
                <SceneCards2 />
              </section>
              <div className="grid grid-cols-2 gap-5">
                <CreationStats />
                <RecentWorks />
              </div>
              <section>
                <CaseRecommend />
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
