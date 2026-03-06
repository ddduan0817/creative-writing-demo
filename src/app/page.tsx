"use client";

import SceneCards from "@/components/home/SceneCards";
import RecentWorks from "@/components/home/RecentWorks";
import CreationStats from "@/components/home/CreationStats";
import CaseRecommend from "@/components/home/CaseRecommend";
import Sidebar from "@/components/home/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="max-w-[960px] mx-auto px-8 py-8 space-y-6">
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
