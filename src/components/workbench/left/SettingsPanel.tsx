"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useState } from "react";
import { Sparkles, Loader2, Upload, X, ChevronDown } from "lucide-react";
import { simulateAIStream } from "@/lib/aiSimulator";
import { mockAIResponses } from "@/data/mockAIResponses";

// 设定字段配置
const settingFields: {
  key: string;
  label: string;
  type: "select" | "text" | "textarea";
  options?: string[];
  placeholder?: string;
}[] = [
  {
    key: "worldType",
    label: "世界类型",
    type: "select",
    options: ["玄幻", "仙侠", "科幻", "都市", "历史", "架空", "现实", "末日"],
  },
  {
    key: "powerSystem",
    label: "力量体系",
    type: "textarea",
    placeholder: "修炼等级/魔法规则/科技限制/超能力设定...",
  },
  {
    key: "socialStructure",
    label: "社会结构",
    type: "textarea",
    placeholder: "政权组织/种族分布/阶级矛盾/门派势力...",
  },
  {
    key: "keyHistory",
    label: "关键历史",
    type: "textarea",
    placeholder: "影响当下的重大事件/禁忌/传说...",
  },
  {
    key: "perspective",
    label: "叙事视角",
    type: "select",
    options: ["第一人称", "第三人称限制", "第三人称全知", "多视角轮转"],
  },
  {
    key: "coreConflict",
    label: "核心冲突",
    type: "textarea",
    placeholder: "主角面临的核心矛盾/困境...",
  },
  {
    key: "redline",
    label: "创作红线",
    type: "textarea",
    placeholder: "不能触碰的设定/需要遵守的规则...",
  },
  {
    key: "style",
    label: "语言风格",
    type: "select",
    options: ["古风典雅", "现代白话", "幽默诙谐", "严肃冷峻", "文艺抒情", "通俗易懂"],
  },
];

export default function SettingsPanel() {
  const { settings, updateSetting, showToast } = useEditorStore();
  const [generating, setGenerating] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [openSelect, setOpenSelect] = useState<string | null>(null);

  const getValue = (key: string) => settings.find((s) => s.key === key)?.value || "";

  const handleGenerate = (key: string) => {
    setGenerating(key);
    const genSettings = mockAIResponses.generateSetting;
    const text = genSettings[key as keyof typeof genSettings] || "AI 生成的设定内容...";

    simulateAIStream(text as string, (current, done) => {
      updateSetting(key, current);
      if (done) {
        setGenerating(null);
        showToast("设定生成完成");
      }
    });
  };

  const handleUpload = () => {
    const mockFiles = ["角色设定草稿.docx", "世界观参考.pdf", "大纲备忘.txt", "灵感图片.png"];
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
      <div className="pb-2 border-b border-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">上传参考资料</span>
        </div>
        <button
          onClick={handleUpload}
          className="w-full border border-dashed border-gray-200 rounded-lg py-3 text-xs text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/30 transition flex items-center justify-center gap-1.5"
        >
          <Upload className="w-3.5 h-3.5" />
          点击上传或拖拽文件
        </button>
        <p className="text-[10px] text-gray-300 mt-1.5">支持 .txt, .docx, .pdf</p>
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

        return (
          <div key={field.key} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700">{field.label}</span>
              {field.type === "textarea" && (
                <button
                  onClick={() => handleGenerate(field.key)}
                  disabled={generating === field.key}
                  className="p-1 text-gray-400 hover:text-indigo-600 rounded disabled:opacity-50 opacity-0 group-hover:opacity-100 transition"
                  title="AI 生成"
                >
                  {generating === field.key ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {field.type === "select" && field.options && (
              <div className="relative">
                <button
                  onClick={() => setOpenSelect(openSelect === field.key ? null : field.key)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs border border-gray-200 rounded-lg hover:border-indigo-200 transition bg-white"
                >
                  <span className={value ? "text-gray-700" : "text-gray-400"}>
                    {value || "请选择..."}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition ${openSelect === field.key ? "rotate-180" : ""}`} />
                </button>
                {openSelect === field.key && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
                    {field.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          updateSetting(field.key, opt);
                          setOpenSelect(null);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-indigo-50 transition ${
                          value === opt ? "text-indigo-600 bg-indigo-50/50 font-medium" : "text-gray-600"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {field.type === "textarea" && (
              <textarea
                value={value}
                onChange={(e) => updateSetting(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full text-xs border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300"
                rows={2}
              />
            )}

            {field.type === "text" && (
              <input
                type="text"
                value={value}
                onChange={(e) => updateSetting(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
