"use client";

import { useEditorStore } from "@/stores/editorStore";

const stages = [
  { id: 0, label: "设定" },
  { id: 1, label: "世界观" },
  { id: 2, label: "角色" },
  { id: 3, label: "大纲" },
  { id: 4, label: "正文" },
];

export default function CreationProgress() {
  const creationStage = useEditorStore((s) => s.creationStage);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {stages.map((stage, i) => {
        const isCompleted = creationStage > stage.id;
        const isCurrent = creationStage === stage.id;

        return (
          <div key={stage.id} className="flex flex-col items-center">
            {/* Connecting line (above dot, except first) */}
            {i > 0 && (
              <div className="w-px h-6 relative">
                <div className="absolute inset-0 bg-gray-200" />
                <div
                  className="absolute top-0 left-0 w-full bg-blue-400 transition-all duration-700 ease-out"
                  style={{
                    height: isCompleted || isCurrent ? "100%" : "0%",
                  }}
                />
              </div>
            )}

            {/* Dot + Label below */}
            <div className="flex flex-col items-center">
              <div
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  isCompleted
                    ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]"
                    : isCurrent
                    ? "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.4)] scale-125"
                    : "bg-gray-200"
                }`}
              />
              <span
                className={`text-[9px] mt-1 leading-none transition-colors duration-500 ${
                  isCompleted
                    ? "text-blue-500 font-medium"
                    : isCurrent
                    ? "text-blue-400 font-medium"
                    : "text-gray-300"
                }`}
              >
                {stage.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
