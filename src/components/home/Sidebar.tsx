"use client";

import { Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  MessageSquarePlus,
  PenLine,
  BookOpen,
  MoreHorizontal,
  HardDrive,
  FolderKanban,
  MessageCircle,
  ChevronDown,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

function SidebarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const v = searchParams.get("v");
  const isBackup1 = v === "backup1";
  const isBackup2 = v === "backup";

  return (
    <div className="w-[200px] h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 sticky top-0">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">文</span>
        </div>
        <span className="text-sm font-semibold text-gray-800">文心一言</span>
      </div>

      {/* New Chat Button */}
      <div className="px-3 mb-2">
        <button className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition border border-gray-100">
          <MessageSquarePlus className="w-4 h-4" />
          新对话
        </button>
      </div>

      {/* Nav Items */}
      <nav className="px-3 space-y-0.5 flex-1">
        <button
          onClick={() => router.push("/")}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition",
            pathname === "/" && !isBackup1 && !isBackup2
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <PenLine className="w-4 h-4" />
          创意写作
        </button>
        <button
          onClick={() => router.push("/?v=backup1")}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition",
            pathname === "/" && isBackup1
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <Copy className="w-4 h-4" />
          创意写作备份1
        </button>
        <button
          onClick={() => router.push("/?v=backup")}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition",
            pathname === "/" && isBackup2
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <Copy className="w-4 h-4" />
          创意写作备份2
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition">
          <BookOpen className="w-4 h-4" />
          阅读分析
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition">
          <MoreHorizontal className="w-4 h-4" />
          更多
          <ChevronDown className="w-3 h-3 ml-auto" />
        </button>
      </nav>

      {/* Bottom Items */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-gray-50 pt-3">
        <button
          onClick={() => router.push("/works")}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition",
            pathname === "/works"
              ? "bg-blue-50 text-blue-600 font-medium"
              : "text-gray-500 hover:bg-gray-50"
          )}
        >
          <HardDrive className="w-4 h-4" />
          云盘
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 transition">
          <FolderKanban className="w-4 h-4" />
          项目
        </button>
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 transition">
          <MessageCircle className="w-4 h-4" />
          对话
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <Suspense>
      <SidebarContent />
    </Suspense>
  );
}
