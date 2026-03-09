"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useState } from "react";
import { Sparkles, Loader2, Upload, X } from "lucide-react";
import { simulateAIStream } from "@/lib/aiSimulator";

// 设定字段配置
const settingFields: {
  key: string;
  label: string;
  type: "textarea" | "select";
  placeholder?: string;
  rows?: number;
  options?: string[];
}[] = [
  {
    key: "background",
    label: "故事背景",
    type: "textarea",
    placeholder: "时代背景、地点环境、社会结构...",
    rows: 3,
  },
  {
    key: "keyEvents",
    label: "前情提要",
    type: "textarea",
    placeholder: "影响当下剧情的重要事件/历史...",
    rows: 2,
  },
  {
    key: "perspective",
    label: "叙事视角",
    type: "select",
    options: ["第一人称亲历者", "第一人称旁观者", "第三人称全知", "第三人称有限", "不可靠叙述者"],
  },
  {
    key: "coreConflict",
    label: "核心冲突",
    type: "textarea",
    placeholder: "主角面临的核心矛盾/困境...",
    rows: 2,
  },
  {
    key: "redline",
    label: "创作红线",
    type: "textarea",
    placeholder: "告诉AI不要写什么，避免踩雷。如：不要圣母、不要无脑、不要水字数...",
    rows: 2,
  },
  {
    key: "style",
    label: "语言风格",
    type: "select",
    options: ["轻松幽默", "细腻文艺", "简洁有力", "沉稳大气", "诙谐吐槽", "古典优美"],
  },
];

// Mock AI 生成内容
const mockGenerations: Record<string, string> = {
  background: "故事发生在一个架空的东方大陆，灵气复苏后的现代都市。修行者与普通人共存，但两个世界之间存在着微妙的平衡。城市的霓虹灯下，隐藏着古老的门派势力...",
  keyEvents: "十年前的灵脉暴动导致天机阁一夜覆灭，幸存者寥寥无几。这场变故的真相至今成谜，但它改变了整个大陆的格局...",
  coreConflict: "主角在追查父母失踪真相的过程中，逐渐发现自己的身世与一个被封印的远古存在有关。他必须在守护身边人与揭开真相之间做出选择...",
  redline: "不要圣母白莲花\n不要无脑降智\n不要水字数拖剧情\n反派要有合理动机",
};

export default function SettingsPanel() {
  const { settings, updateSetting, showToast } = useEditorStore();
  const [generating, setGenerating] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const getValue = (key: string) => settings.find((s) => s.key === key)?.value || "";

  const handleGenerate = (key: string) => {
    setGenerating(key);
    const text = mockGenerations[key] || "AI 生成的设定内容...";

    simulateAIStream(text, (current, done) => {
      updateSetting(key, current);
      if (done) {
        setGenerating(null);
        showToast("生成完成");
      }
    });
  };

  const handleUpload = () => {
    const mockFiles = ["世界观参考.pdf", "角色设定.docx", "大纲备忘.txt"];
    const next = mockFiles.find((f) => !uploadedFiles.includes(f));
    if (next) {
      setUploadedFiles((prev) => [...prev, next]);
      showToast(`已上传「${next}」`);
    } else {
      showToast("演示文件已全部上传");
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* 上传参考资料 */}
      <div className="pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">参考资料</span>
        </div>
        <button
          onClick={handleUpload}
          className="w-full border border-dashed border-gray-200 rounded-lg py-2.5 text-xs text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition flex items-center justify-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          点击上传
        </button>
        {uploadedFiles.length > 0 && (
          <div className="mt-2 space-y-1">
            {uploadedFiles.map((file) => (
              <div key={file} className="flex items-center justify-between px-2 py-1.5 bg-gray-50 rounded text-xs text-gray-600">
                <span className="truncate flex-1">{file}</span>
                <button
                  onClick={() => setUploadedFiles((prev) => prev.filter((f) => f !== file))}
                  className="ml-2 text-gray-300 hover:text-red-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 设定字段 */}
      {settingFields.map((field) => {
        const value = getValue(field.key);
        const isGenerating = generating === field.key;

        return (
          <div key={field.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700">{field.label}</span>
              {field.type === "textarea" && (
                <button
                  onClick={() => handleGenerate(field.key)}
                  disabled={isGenerating}
                  className="flex items-center gap-1 px-2 py-0.5 text-xs text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  生成
                </button>
              )}
            </div>

            {field.type === "select" && field.options && (
              <div className="flex flex-wrap gap-2">
                {field.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateSetting(field.key, value === opt ? "" : opt)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition ${
                      value === opt
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700 font-medium"
                        : "border-gray-200 text-gray-500 hover:border-indigo-200 hover:text-indigo-600"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {field.type === "textarea" && (
              <textarea
                value={value}
                onChange={(e) => updateSetting(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full text-xs border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300"
                rows={field.rows}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
