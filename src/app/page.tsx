"use client";

import SceneCards from "@/components/home/SceneCards";
import RecentWorks from "@/components/home/RecentWorks";
import CreationStats from "@/components/home/CreationStats";
import Sidebar from "@/components/home/Sidebar";
import { Plus, User } from "lucide-react";

export default function Home() {
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
          {/* Scene Cards + Creation Stats */}
          <div className="grid grid-cols-[2fr_1fr] gap-5 items-start">
            <SceneCards />
            <CreationStats />
          </div>

          {/* Recent Works */}
          <RecentWorks />
        </main>
      </div>
    </div>
  );
}
