"use client";

import SceneCards from "@/components/home/SceneCards";
import RecentWorks from "@/components/home/RecentWorks";
import CreationStats from "@/components/home/CreationStats";
import CaseRecommend from "@/components/home/CaseRecommend";
import Sidebar from "@/components/home/Sidebar";
import { Monitor, Bell } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Top Bar with right-side actions */}
        <div className="flex justify-end items-center px-8 py-4 gap-3">
          <div className="relative group">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Monitor className="w-5 h-5" />
            </button>
            <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              下载多端应用
            </div>
          </div>
          <div className="relative group">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Bell className="w-5 h-5" />
              {/* 红点 */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              功能上新
            </div>
          </div>
        </div>

        <main className="max-w-[960px] mx-auto px-8 pb-8 space-y-6">
          {/* Scene Cards */}
          <section>
            <SceneCards />
          </section>

          {/* Stats + Recent Works side by side */}
          <div className="grid grid-cols-2 gap-5">
            <CreationStats />
            <RecentWorks />
          </div>

          {/* Case Recommend */}
          <section>
            <CaseRecommend />
          </section>
        </main>
      </div>
    </div>
  );
}
