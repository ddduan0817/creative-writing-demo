"use client";

import InspirationCards from "./InspirationCards";
import AIChat from "./AIChat";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function RightPanel() {
  const [inspirationCollapsed, setInspirationCollapsed] = useState(false);

  return (
    <div className="h-full flex flex-col overflow-hidden w-80">
      {/* Inspiration Cards */}
      <div className="border-b border-gray-50 flex flex-col min-h-0 shrink-0" style={{ maxHeight: inspirationCollapsed ? 'auto' : '60%' }}>
        <button
          onClick={() => setInspirationCollapsed(!inspirationCollapsed)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 shrink-0"
        >
          <span className="text-sm font-semibold text-gray-700">灵感卡片</span>
          {inspirationCollapsed ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {!inspirationCollapsed && (
          <div className="overflow-y-auto min-h-0">
            <InspirationCards />
          </div>
        )}
      </div>

      {/* AI Chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AIChat />
      </div>
    </div>
  );
}
