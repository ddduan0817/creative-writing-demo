"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SceneCards from "@/components/home/SceneCards";
import SceneCards2 from "@/components/home/SceneCards2";
import RecentWorks from "@/components/home/RecentWorks";
import RecentWorks2 from "@/components/home/RecentWorks2";
import CreationStats from "@/components/home/CreationStats";
import CreationStats2 from "@/components/home/CreationStats2";
import CaseRecommend from "@/components/home/CaseRecommend";
import Sidebar from "@/components/home/Sidebar";
import { Monitor, Bell, Mic, Send, Plus, FileUp, ImageIcon, AudioLines, Video, Star, Clock } from "lucide-react";

function HomeContent() {
  const searchParams = useSearchParams();
  const isBackup1 = searchParams.get("v") === "backup1";
  const isBackup2 = searchParams.get("v") === "backup";
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const attachRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          ) : isBackup1 ? (
            <>
              {/* 备份1：保持旧布局不动 */}
              <SceneCards />
              <div className="grid grid-cols-[1fr_2fr] gap-5">
                <CreationStats />
                <RecentWorks />
              </div>
            </>
          ) : (
            <>
              {/* Hero Title */}
              <div className="text-center pt-16 pb-4">
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
                  <div className="relative" ref={attachRef}>
                    <button
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    {showAttachMenu && (
                      <div className="absolute left-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-28 z-20">
                        {[
                          { icon: FileUp, label: "文档", color: "text-blue-500" },
                          { icon: ImageIcon, label: "图片", color: "text-green-500" },
                          { icon: AudioLines, label: "音频", color: "text-purple-500" },
                          { icon: Video, label: "视频", color: "text-red-500" },
                        ].map((item) => (
                          <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                            <item.icon className={`w-4 h-4 ${item.color}`} />
                            {item.label}
                          </button>
                        ))}
                        <div className="border-t border-gray-100 my-1" />
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <span className="w-4 h-4 text-blue-500 text-sm leading-4">☁️</span>
                          网盘
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <Star className="w-4 h-4 text-gray-500" />
                          收藏
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <Clock className="w-4 h-4 text-gray-500" />
                          最近
                        </button>
                      </div>
                    )}
                  </div>
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
