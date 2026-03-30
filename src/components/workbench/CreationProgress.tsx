"use client";

import { useEditorStore } from "@/stores/editorStore";

const stagesByScene: Record<string, { id: number; label: string }[]> = {
  novel: [
    { id: 0, label: "设定" },
    { id: 1, label: "世界观" },
    { id: 2, label: "角色" },
    { id: 3, label: "大纲" },
    { id: 4, label: "正文" },
  ],
  screenplay: [
    { id: 0, label: "设定" },
    { id: 1, label: "世界观" },
    { id: 2, label: "角色" },
    { id: 3, label: "大纲" },
    { id: 4, label: "正文" },
  ],
  marketing: [
    { id: 0, label: "产品" },
    { id: 1, label: "策略" },
    { id: 2, label: "故事线" },
    { id: 3, label: "分幕" },
    { id: 4, label: "精修" },
  ],
  knowledge: [
    { id: 0, label: "导入" },
    { id: 1, label: "设定" },
    { id: 2, label: "角色" },
    { id: 3, label: "结构" },
    { id: 4, label: "报告" },
  ],
};

export default function CreationProgress() {
  const creationStage = useEditorStore((s) => s.creationStage);
  const stageProgress = useEditorStore((s) => s.stageProgress);
  const scene = useEditorStore((s) => s.scene);

  const stages = stagesByScene[scene] || stagesByScene.novel;

  return (
    <div className="h-full flex flex-col items-center py-8">
      {stages.map((stage, i) => {
        const isCompleted = creationStage > stage.id;
        const isCurrent = creationStage === stage.id;

        const isLineCompleted = creationStage >= stage.id;
        const isLineFilling = creationStage === stage.id - 1;
        const lineHeight = isLineCompleted ? 100 : isLineFilling ? stageProgress * 100 : 0;

        return (
          <div key={stage.id} className={`flex flex-col items-center ${i > 0 ? "flex-1" : ""}`}>
            {/* Connecting line */}
            {i > 0 && (
              <div className="w-px flex-1 relative">
                <div className="absolute inset-0 bg-gray-200" />
                <div
                  className="absolute top-0 left-0 w-full bg-blue-400 transition-all duration-700 ease-out"
                  style={{ height: `${lineHeight}%` }}
                />
              </div>
            )}

            {/* Dot + Label below */}
            <div className="flex flex-col items-center flex-shrink-0">
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
                className={`text-[9px] mt-1.5 leading-none transition-colors duration-500 ${
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
