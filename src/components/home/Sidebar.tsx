"use client";

import {
  MessageSquarePlus,
  PenLine,
  BookOpen,
  MoreHorizontal,
  HardDrive,
  FolderKanban,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: MessageSquarePlus, label: "新对话", active: false },
  { icon: PenLine, label: "创意写作", active: true },
  { icon: BookOpen, label: "阅读分析", active: false },
  { icon: MoreHorizontal, label: "更多", active: false },
];

const bottomItems = [
  { icon: HardDrive, label: "云盘" },
  { icon: FolderKanban, label: "项目" },
  { icon: MessageCircle, label: "对话" },
];

export default function Sidebar() {
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
        {navItems.slice(1).map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition",
              item.active
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            {item.label === "更多" && (
              <ChevronDown className="w-3 h-3 ml-auto" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-gray-50 pt-3">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 transition"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
