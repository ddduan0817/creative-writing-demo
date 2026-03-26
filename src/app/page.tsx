"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SceneCards from "@/components/home/SceneCards";
import SceneCards2 from "@/components/home/SceneCards2";
import RecentWorks from "@/components/home/RecentWorks";
import RecentWorks2 from "@/components/home/RecentWorks2";
import CreationStats from "@/components/home/CreationStats";
import CreationStats2 from "@/components/home/CreationStats2";
import CaseRecommend from "@/components/home/CaseRecommend";
import Sidebar from "@/components/home/Sidebar";
import { Monitor, Bell, Mic, Send, Plus } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const isBackup2 = searchParams.get("v") === "backup";

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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="absolute right-0 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              功能上新
            </div>
          </div>
        </div>

        <main className="max-w-[960px] mx-auto px-8 pb-8 space-y-6">
          {isBackup2 ? (
            <>
              <section>
                <SceneCards2 />
              </section>
              <div className="grid grid-cols-2 gap-5">
                <CreationStats2 />
                <RecentWorks2 />
              </div>
              <section>
                <CaseRecommend />
              </section>
            </>
          ) : (
            <>
              {/* Hero Title */}
              <div className="text-center pt-8 pb-2">
                <h1 className="text-3xl font-bold text-gray-900">高效解决写作问题</h1>
              </div>

              {/* Input Box */}
              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4">
                <textarea
                  placeholder="选择模版后填写写作要求；支持基于上传文档写作"
                  className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent min-h-[60px]"
                  rows={2}
                />
                <div className="flex items-center justify-between mt-2">
                  <button className="flex items-center gap-1.5 px-4 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-full border border-gray-200 hover:bg-gray-100 transition">
                    <Plus className="w-4 h-4" />
                    文档
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scene Cards - compact */}
              <SceneCards />

              {/* Stats + Recent Works side by side */}
              <div className="grid grid-cols-[1fr_2fr] gap-5">
                <CreationStats />
                <RecentWorks />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
