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
        <div className="flex justify-end items-center px-8 py-4 gap-4">
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition">
            <Monitor className="w-4 h-4" />
            <span>下载多端应用</span>
          </button>
          <button className="relative flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition">
            <Bell className="w-4 h-4" />
            <span>功能上新</span>
            {/* 红点 */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
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
