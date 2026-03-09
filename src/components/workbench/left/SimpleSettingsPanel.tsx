"use client";

import { useState } from "react";
import { Sparkles, Loader2, Upload, X, Check } from "lucide-react";
import { simulateAIStream } from "@/lib/aiSimulator";
import { useEditorStore } from "@/stores/editorStore";
import { cn } from "@/lib/utils";

type FieldType = "select" | "multiSelect" | "text" | "textarea";

interface SettingField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
}

// ==================== 种草文案 - 按内容形式 ====================
const settingsByMarketingType: Record<string, SettingField[]> = {
  graphic_seed: [
    { key: "product", label: "产品信息", type: "textarea", placeholder: "产品名称/核心卖点/价格" },
    { key: "audience", label: "目标人群", type: "select", options: ["宝妈", "学生", "职场人", "银发族"] },
    { key: "pain_point", label: "痛点场景", type: "textarea", placeholder: "用户困扰/尴尬时刻" },
    { key: "trust", label: "信任背书", type: "select", options: ["销量XX万", "达人同款", "权威认证", "自定义"] },
    { key: "cta", label: "促单理由", type: "select", options: ["限时折扣", "限量赠品", "首发价", "自定义"] },
  ],
  live_script: [
    { key: "duration", label: "直播时长", type: "text", placeholder: "小时" },
    { key: "products", label: "货品组合", type: "textarea", placeholder: "引流款+利润款+炮灰款" },
    { key: "timeline", label: "时间轴", type: "textarea", placeholder: "每个时间段的动作" },
    { key: "interact", label: "互动话术", type: "textarea", placeholder: "欢迎词/留人词/问答库" },
    { key: "urgency", label: "逼单话术", type: "textarea", placeholder: "倒数/库存紧张/加赠" },
  ],
  voice_script: [
    { key: "video_duration", label: "视频时长", type: "select", options: ["15秒", "30秒", "60秒"] },
    { key: "hook", label: "开头钩子", type: "select", options: ["反常识", "设问", "利益点", "情绪宣泄"] },
    { key: "style", label: "表达风格", type: "select", options: ["理性", "感性", "咆哮", "温情", "搞笑"] },
    { key: "core_info", label: "核心信息", type: "textarea", placeholder: "要传递的关键词" },
    { key: "ending", label: "结尾引导", type: "select", options: ["求点赞", "求关注", "引导评论"] },
  ],
  video_script: [
    { key: "structure", label: "脚本结构", type: "select", options: ["剧情类", "科普类", "Vlog类"] },
    { key: "visual", label: "画面列", type: "textarea", placeholder: "每一幕的画面内容" },
    { key: "audio", label: "声音列", type: "textarea", placeholder: "同期声/配音/BGM" },
    { key: "subtitle", label: "字幕列", type: "textarea", placeholder: "重点标粗/特效字" },
    { key: "duration", label: "时长列", type: "textarea", placeholder: "每个镜头秒数" },
  ],
};

// ==================== 知识专栏 - 按内容类型 ====================
const settingsByKnowledgeType: Record<string, SettingField[]> = {
  book_review: [
    { key: "book", label: "书籍信息", type: "textarea", placeholder: "书名/作者/类别" },
    { key: "core_view", label: "核心观点", type: "textarea", placeholder: "一句话总结" },
    { key: "dimensions", label: "拆解维度", type: "textarea", placeholder: "3-5个分析角度" },
    { key: "quotes", label: "金句摘录", type: "textarea", placeholder: "原文精彩句子" },
    { key: "insight", label: "应用启示", type: "textarea", placeholder: "对读者的实际帮助" },
  ],
  video_explain: [
    { key: "video_type", label: "视频类型", type: "select", options: ["影视解说", "科普解说", "纪录片", "产品解说", "教程解说"] },
    { key: "duration", label: "视频时长", type: "text", placeholder: "分钟" },
    { key: "style", label: "解说风格", type: "select", options: ["幽默", "严肃", "煽情", "客观"] },
    { key: "match_visual", label: "画面对应", type: "textarea", placeholder: "某段时间对应的解说词" },
    { key: "silence", label: "留白处理", type: "textarea", placeholder: "哪里不说话让画面呈现" },
  ],
  opinion: [
    { key: "core_view", label: "核心观点", type: "textarea", placeholder: "想表达的一句话" },
    { key: "angle", label: "切入角度", type: "select", options: ["反常识", "热点关联", "经典新解"] },
    { key: "evidence", label: "论据类型", type: "select", options: ["数据", "案例", "名人名言", "个人经历"] },
    { key: "logic", label: "逻辑结构", type: "select", options: ["是什么-为什么-怎么办", "并列式", "递进式"] },
    { key: "tone", label: "情绪基调", type: "select", options: ["愤怒", "感动", "振奋", "平静"] },
  ],
  course_outline: [
    { key: "topic", label: "课程主题", type: "text", placeholder: "课程名称" },
    { key: "target_user", label: "目标用户", type: "textarea", placeholder: "谁需要学" },
    { key: "chapters", label: "章节设置", type: "textarea", placeholder: "每章标题+核心知识点" },
    { key: "format", label: "交付形式", type: "select", options: ["音频", "视频", "图文", "直播"] },
    { key: "homework", label: "作业设计", type: "textarea", placeholder: "每节的互动任务" },
  ],
};

// ==================== AI 生成 Mock 文本 ====================
const mockGenerateTexts: Record<string, string> = {
  // 图文种草
  product: "某品牌气垫粉底液，主打轻薄持妆、养肤概念，价格区间199-259元，适合油皮和混油皮日常使用。",
  pain_point: "夏天出油脱妆尴尬、午后补妆频繁、敏感肌不敢用厚重粉底。",
  // 直播脚本
  duration: "3",
  products: "引流款：9.9元面膜试用装 → 利润款：气垫粉底液199元 → 炮灰款：对比竞品A（不推荐购买，仅做对比）。",
  timeline: "19:00-19:15 暖场互动 → 19:15-19:45 引流款秒杀 → 19:45-20:30 主推款详细讲解 → 20:30-21:00 用户连麦 → 21:00-21:30 返场秒杀 → 21:30-22:00 福袋抽奖。",
  interact: "欢迎词：宝宝们来了就先点个关注，今晚福利超级大！ | 留人词：等一下！接下来这个产品你们绝对不能错过！ | 问答库：有人问xx色号适合黄皮吗？太适合了！我现在就给你们试！",
  urgency: "倒计时：3、2、1上链接！ | 库存紧张：只剩最后87单了，抢完不补！ | 加赠：现在下单的前50名额外送一支唇釉小样！",
  // 口播文案
  core_info: "关键词：轻薄、持妆12小时、敏感肌友好、回购率超高。",
  // 短视频脚本
  visual: "画面1：闺蜜素颜出镜，光线自然 | 画面2：分屏对比化妆过程 | 画面3：街头采访路人 | 画面4：产品特写+购买信息。",
  audio: "同期声 + 轻快BGM + 画外音解说穿插。",
  subtitle: "重点标粗：「持妆12小时」「敏感肌安全」，特效字：价格弹出动画。",
  // 拆书稿
  book: "《思考，快与慢》丹尼尔·卡尼曼著，行为经济学经典之作。",
  core_view: "人类的决策受两套思维系统支配：系统1（快速直觉）和系统2（慢速理性），大多数错误源于系统1的偏见。",
  dimensions: "1. 双系统理论框架  2. 常见认知偏差案例  3. 在投资/消费中的应用  4. 如何刻意训练理性思维",
  quotes: "「我们对自己的信念有过度的自信，这种过度自信主要建立在我们忽略了自己不知道的东西。」",
  insight: "在做重大决策时有意识地启动系统2，用清单和决策框架抵抗直觉偏差。",
  // 视频解说
  match_visual: "0:00-0:30 电影片段剪辑 | 0:30-1:30 图表动画+数据可视化 | 1:30-2:30 实验还原画面 | 2:30-3:00 总结金句+关注引导。",
  silence: "在关键实验结果揭晓前留白2秒，让画面自己说话。",
  // 课程大纲
  topic: "决策力：用认知科学升级你的判断",
  target_user: "25-40岁职场人、创业者、投资者，日常需要做大量决策的人群。",
  chapters: "第1节：你的大脑有两个司机 | 第2节：直觉为什么总出错 | 第3节：锚定效应——第一印象的陷阱 | 第4节：损失厌恶——为什么割肉比套牢更痛",
  homework: "第1节：记录一天中的10个决策 | 第3节：找出生活中3个锚定效应 | 第6节：设计你的个人决策流程",
};

export default function SimpleSettingsPanel({ scene, activeType }: { scene: string; activeType: string }) {
  const { showToast } = useEditorStore();

  const allSettings = scene === "marketing" ? settingsByMarketingType : settingsByKnowledgeType;
  const defaultType = scene === "marketing" ? "graphic_seed" : "book_review";
  const fields = allSettings[activeType] || allSettings[defaultType];

  const [values, setValues] = useState<Record<string, string | string[]>>({});
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

  const handleGenerate = (key: string) => {
    setGenerating(key);
    const text = mockGenerateTexts[key] || "AI 生成的内容...";
    simulateAIStream(text, (current, done) => {
      setValues((prev) => ({ ...prev, [key]: current }));
      if (done) {
        setGenerating(null);
        showToast("生成完成");
      }
    });
  };

  const handleSelectChange = (key: string, option: string) => {
    setValues((prev) => ({ ...prev, [key]: option }));
  };

  const handleMultiSelectToggle = (key: string, option: string) => {
    setValues((prev) => {
      const current = (prev[key] as string[]) || [];
      if (current.includes(option)) {
        return { ...prev, [key]: current.filter((o) => o !== option) };
      } else {
        return { ...prev, [key]: [...current, option] };
      }
    });
  };

  const renderField = (field: SettingField) => {
    const value = values[field.key];

    switch (field.type) {
      case "select":
        return (
          <div className="flex flex-wrap gap-1.5">
            {field.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectChange(field.key, opt)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-lg border transition",
                  value === opt
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700 font-medium"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        );

      case "multiSelect":
        const selected = (value as string[]) || [];
        return (
          <div className="flex flex-wrap gap-1.5">
            {field.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => handleMultiSelectToggle(field.key, opt)}
                className={cn(
                  "px-2.5 py-1 text-xs rounded-lg border transition flex items-center gap-1",
                  selected.includes(opt)
                    ? "border-indigo-400 bg-indigo-50 text-indigo-700 font-medium"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                )}
              >
                {selected.includes(opt) && <Check className="w-3 h-3" />}
                {opt}
              </button>
            ))}
          </div>
        );

      case "text":
        return (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={(value as string) || ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300"
            />
            <button
              onClick={() => handleGenerate(field.key)}
              disabled={generating === field.key}
              className="p-1.5 text-gray-400 hover:text-indigo-600 rounded disabled:opacity-50"
              title="AI 生成"
            >
              {generating === field.key ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </button>
          </div>
        );

      case "textarea":
      default:
        return (
          <div className="space-y-1.5">
            <textarea
              value={(value as string) || ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.placeholder}
              rows={3}
              className="w-full text-xs border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 placeholder:text-gray-300"
            />
            <button
              onClick={() => handleGenerate(field.key)}
              disabled={generating === field.key}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
            >
              {generating === field.key ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              AI 生成
            </button>
          </div>
        );
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* 上传参考资料 */}
      <div>
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

      {/* 设定字段 */}
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            {field.label}
          </label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}
