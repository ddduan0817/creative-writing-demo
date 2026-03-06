"use client";

import { useState } from "react";
import { Plus, Sparkles, Loader2, Upload, X } from "lucide-react";
import { simulateAIStream } from "@/lib/aiSimulator";
import { useEditorStore } from "@/stores/editorStore";

interface SettingItem {
  key: string;
  label: string;
  value: string;
}

const marketingSettings: SettingItem[] = [
  { key: "product", label: "产品信息", value: "" },
  { key: "audience", label: "目标人群", value: "" },
  { key: "selling_point", label: "核心卖点", value: "" },
  { key: "tone", label: "内容调性", value: "" },
  { key: "pain_point", label: "痛点场景", value: "" },
  { key: "trust", label: "信任背书", value: "" },
  { key: "reference", label: "参考链接", value: "" },
];

const knowledgeSettings: SettingItem[] = [
  { key: "book", label: "书籍/素材信息", value: "" },
  { key: "core_view", label: "核心观点", value: "" },
  { key: "dimensions", label: "拆解维度", value: "" },
  { key: "quotes", label: "金句摘录", value: "" },
  { key: "insight", label: "应用启示", value: "" },
  { key: "style", label: "表达风格", value: "" },
  { key: "reference", label: "参考资料", value: "" },
];

const mockGenerateTexts: Record<string, string> = {
  product: "某品牌气垫粉底液，主打轻薄持妆、养肤概念，价格区间199-259元，适合油皮和混油皮日常使用。",
  audience: "18-35岁女性，关注护肤美妆，追求性价比与品质兼得的消费观。",
  selling_point: "24小时不脱妆、含玻尿酸养肤成分、SPF50+防晒值。",
  tone: "轻松种草风、闺蜜安利式、真实测评口吻。",
  pain_point: "夏天出油脱妆尴尬、午后补妆频繁、敏感肌不敢用厚重粉底。",
  trust: "全网销量突破500万支、多位美妆博主推荐、国家药监局备案。",
  book: "《思考，快与慢》丹尼尔·卡尼曼著，行为经济学经典之作。",
  core_view: "人类的决策受两套思维系统支配：系统1（快速直觉）和系统2（慢速理性），大多数错误源于系统1的偏见。",
  dimensions: "1. 双系统理论框架  2. 常见认知偏差案例  3. 在投资/消费中的应用  4. 如何刻意训练理性思维",
  quotes: "「我们对自己的信念有过度的自信，这种过度自信主要建立在我们忽略了自己不知道的东西。」",
  insight: "在做重大决策时有意识地启动系统2，用清单和决策框架抵抗直觉偏差。",
  style: "通俗易懂、案例丰富、深入浅出的知识解读风格。",
};

export default function SimpleSettingsPanel({ scene }: { scene: string }) {
  const { showToast } = useEditorStore();
  const [settings, setSettings] = useState<SettingItem[]>(
    scene === "marketing" ? marketingSettings : knowledgeSettings
  );
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [generating, setGenerating] = useState<string | null>(null);

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleUpload = () => {
    const mockFiles = scene === "marketing"
      ? ["竞品文案参考.docx", "产品手册.pdf", "用户评价截图.png", "品牌调性指南.txt"]
      : ["原书摘录.docx", "读书笔记.pdf", "思维导图.png", "素材收集.txt"];
    const next = mockFiles.find((f) => !uploadedFiles.includes(f));
    if (next) {
      setUploadedFiles((prev) => [...prev, next]);
      showToast(`已上传「${next}」`);
    } else {
      showToast("演示文件已全部上传");
    }
  };

  const handleAdd = (key: string) => {
    setEditingKey(key);
    setEditValue(settings.find((s) => s.key === key)?.value || "");
  };

  const handleSave = (key: string) => {
    setSettings((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value: editValue } : item))
    );
    setEditingKey(null);
    showToast("已保存");
  };

  const handleGenerate = (key: string) => {
    setGenerating(key);
    const text = mockGenerateTexts[key] || "AI 生成的设定内容...";

    simulateAIStream(text, (current, done) => {
      setSettings((prev) =>
        prev.map((item) => (item.key === key ? { ...item, value: current } : item))
      );
      if (done) {
        setGenerating(null);
        showToast("设定生成完成");
      }
    });
  };

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {scene === "marketing" ? "种草设定" : "内容设定"}
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
