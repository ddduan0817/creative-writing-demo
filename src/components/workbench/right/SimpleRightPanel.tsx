"use client";

import SimpleInspirationCards from "./SimpleInspirationCards";
import AIChat from "./AIChat";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function SimpleRightPanel() {
  const [inspirationCollapsed, setInspirationCollapsed] = useState(false);

  return (
    <div className="h-full flex flex-col overflow-hidden w-80">
      {/* Inspiration Cards - simplified version */}
      <div className="border-b border-gray-50">
        <button
          onClick={() => setInspirationCollapsed(!inspirationCollapsed)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50"
        >
          <span className="text-sm font-semibold text-gray-700">灵感卡片</span>
          {inspirationCollapsed ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </button>
        {!inspirationCollapsed && <SimpleInspirationCards />}
      </div>

      {/* AI Chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AIChat />
      </div>
    </div>
  );
}
