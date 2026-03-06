"use client";

import { useEditorStore } from "@/stores/editorStore";
import { useState } from "react";
import { Plus, Sparkles, Loader2, Upload, X } from "lucide-react";
import { simulateAIStream } from "@/lib/aiSimulator";
import { mockAIResponses } from "@/data/mockAIResponses";

export default function SettingsPanel() {
  const { settings, updateSetting, showToast } = useEditorStore();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [generating, setGenerating] = useState<string | null>(null);

  const handleAdd = (key: string) => {
    setEditingKey(key);
    setEditValue(settings.find((s) => s.key === key)?.value || "");
  };

  const handleSave = (key: string) => {
    updateSetting(key, editValue);
    setEditingKey(null);
    showToast("已保存");
  };

  const handleGenerate = (key: string) => {
    setGenerating(key);
    const genSettings = mockAIResponses.generateSetting;
    const text =
      genSettings[key as keyof typeof genSettings] || "AI 生成的设定内容...";

    simulateAIStream(text as string, (current, done) => {
      updateSetting(key, current);
      if (done) {
        setGenerating(null);
        showToast("设定生成完成");
      }
    });
  };

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

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
    <div className="p-4 space-y-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        作品设定
      </h3>

      {/* 上传参考资料 */}
      <div className="pb-1">
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
        <p className="text-[10px] text-gray-300 mt-1.5 leading-relaxed">可选，上传后 AI 将参考您的资料生成内容</p>
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

      {settings.map((item) => (
        <div key={item.key} className="group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              {item.label}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => handleAdd(item.key)}
                className="p-1 text-gray-400 hover:text-indigo-600 rounded"
                title="添加设定"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleGenerate(item.key)}
                disabled={generating === item.key}
                className="p-1 text-gray-400 hover:text-indigo-600 rounded disabled:opacity-50"
                title="生成设定"
              >
                {generating === item.key ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {editingKey === item.key ? (
            <div className="space-y-2">
              <textarea
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full text-sm border border-indigo-200 rounded-lg p-2 bg-indigo-50/50 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-300"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(item.key)}
                  className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  保存
                </button>
                <button
                  onClick={() => setEditingKey(null)}
                  className="px-3 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded"
                >
                  取消
                </button>
              </div>
            </div>
          ) : item.value ? (
            <p
              className="text-xs text-gray-500 leading-relaxed cursor-pointer hover:text-gray-700"
              onClick={() => handleAdd(item.key)}
            >
              {item.value}
            </p>
          ) : (
            <p
              className="text-xs text-gray-300 italic cursor-pointer hover:text-gray-400"
              onClick={() => handleAdd(item.key)}
            >
              点击添加或 AI 生成...
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
