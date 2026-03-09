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

// ==================== 种草文案 - 按内容形式 ====================
const settingsByMarketingType: Record<string, SettingItem[]> = {
  graphic_seed: [
    { key: "product", label: "产品信息", value: "" },
    { key: "audience", label: "目标人群", value: "" },
    { key: "pain_point", label: "痛点场景", value: "" },
    { key: "trust", label: "信任背书", value: "" },
    { key: "cta", label: "促单理由", value: "" },
  ],
  live_script: [
    { key: "duration", label: "直播时长", value: "" },
    { key: "products", label: "货品组合", value: "" },
    { key: "timeline", label: "时间轴", value: "" },
    { key: "interact", label: "互动话术", value: "" },
    { key: "urgency", label: "逼单话术", value: "" },
  ],
  voice_script: [
    { key: "video_duration", label: "视频时长", value: "" },
    { key: "hook", label: "开头钩子", value: "" },
    { key: "style", label: "表达风格", value: "" },
    { key: "core_info", label: "核心信息", value: "" },
    { key: "ending", label: "结尾引导", value: "" },
  ],
  video_script: [
    { key: "structure", label: "脚本结构", value: "" },
    { key: "visual", label: "画面列", value: "" },
    { key: "audio", label: "声音列", value: "" },
    { key: "subtitle", label: "字幕列", value: "" },
    { key: "duration", label: "时长列", value: "" },
  ],
};

// ==================== 知识专栏 - 按内容类型 ====================
const settingsByKnowledgeType: Record<string, SettingItem[]> = {
  book_review: [
    { key: "book", label: "书籍信息", value: "" },
    { key: "core_view", label: "核心观点", value: "" },
    { key: "dimensions", label: "拆解维度", value: "" },
    { key: "quotes", label: "金句摘录", value: "" },
    { key: "insight", label: "应用启示", value: "" },
  ],
  video_explain: [
    { key: "video_type", label: "视频类型", value: "" },
    { key: "duration", label: "视频时长", value: "" },
    { key: "style", label: "解说风格", value: "" },
    { key: "match_visual", label: "画面对应", value: "" },
    { key: "silence", label: "留白处理", value: "" },
  ],
  opinion: [
    { key: "core_view", label: "核心观点", value: "" },
    { key: "angle", label: "切入角度", value: "" },
    { key: "evidence", label: "论据类型", value: "" },
    { key: "logic", label: "逻辑结构", value: "" },
    { key: "tone", label: "情绪基调", value: "" },
  ],
  course_outline: [
    { key: "topic", label: "课程主题", value: "" },
    { key: "target_user", label: "目标用户", value: "" },
    { key: "chapters", label: "章节设置", value: "" },
    { key: "format", label: "交付形式", value: "" },
    { key: "homework", label: "作业设计", value: "" },
  ],
};

// ==================== AI 生成 Mock 文本 ====================
const mockGenerateTexts: Record<string, string> = {
  // 图文种草
  product: "某品牌气垫粉底液，主打轻薄持妆、养肤概念，价格区间199-259元，适合油皮和混油皮日常使用。",
  audience: "18-35岁女性，关注护肤美妆，追求性价比与品质兼得的消费观。",
  pain_point: "夏天出油脱妆尴尬、午后补妆频繁、敏感肌不敢用厚重粉底。",
  trust: "全网销量突破500万支、多位美妆博主推荐、国家药监局备案。",
  cta: "限时折扣：前1000名下单享7折 + 赠正装卸妆油，售完即恢复原价。",
  // 直播脚本
  duration: "3小时（19:00-22:00），黄金时段全覆盖。",
  products: "引流款：9.9元面膜试用装 → 利润款：气垫粉底液199元 → 炮灰款：对比竞品A（不推荐购买，仅做对比）。",
  timeline: "19:00-19:15 暖场互动 → 19:15-19:45 引流款秒杀 → 19:45-20:30 主推款详细讲解 → 20:30-21:00 用户连麦 → 21:00-21:30 返场秒杀 → 21:30-22:00 福袋抽奖。",
  interact: "欢迎词：宝宝们来了就先点个关注，今晚福利超级大！ | 留人词：等一下！接下来这个产品你们绝对不能错过！ | 问答库：有人问xx色号适合黄皮吗？太适合了！我现在就给你们试！",
  urgency: "倒计时：3、2、1上链接！ | 库存紧张：只剩最后87单了，抢完不补！ | 加赠：现在下单的前50名额外送一支唇釉小样！",
  // 口播文案
  video_duration: "60秒（适合抖音/快手单条推荐流）。",
  hook: "反常识型：你知道吗？90%的人化妆第一步就做错了。",
  style: "感性+真诚，像跟闺蜜聊天一样自然。",
  core_info: "关键词：轻薄、持妆12小时、敏感肌友好、回购率超高。",
  ending: "引导评论：你们平时用什么底妆？评论区告诉我，翻到就回！",
  // 短视频脚本
  structure: "剧情类：闺蜜逛街→化妆对比→路人反应→产品揭秘。",
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
  video_type: "影视解说 + 科普解说混合风格。",
  match_visual: "0:00-0:30 电影片段剪辑 | 0:30-1:30 图表动画+数据可视化 | 1:30-2:30 实验还原画面 | 2:30-3:00 总结金句+关注引导。",
  silence: "在关键实验结果揭晓前留白2秒，让画面自己说话。",
  // 观点输出
  angle: "反常识切入：「努力学习的人为什么反而做出更差的决策？」",
  evidence: "数据：以色列法官假释研究 + 案例：股市追涨杀跌行为 + 个人经历：双十一冲动消费。",
  logic: "是什么（系统1/2）→ 为什么（进化优势+认知局限）→ 怎么办（3条实操建议）。",
  tone: "平静理性为主，在关键论点处适当振奋。",
  // 课程大纲
  topic: "《决策力：用认知科学升级你的判断》—— 8节音频课。",
  target_user: "25-40岁职场人、创业者、投资者，日常需要做大量决策的人群。",
  chapters: "第1节：你的大脑有两个司机 | 第2节：直觉为什么总出错 | 第3节：锚定效应——第一印象的陷阱 | 第4节：损失厌恶——为什么割肉比套牢更痛 | 第5节：从众效应——别人都在买就是对的吗 | 第6节：决策疲劳——为什么重大决定不要放在下午 | 第7节：建立你的决策清单 | 第8节：日常训练理性思维。",
  format: "音频为主 + 每节配图文笔记 + 期末一次直播答疑。",
  homework: "第1节：记录一天中的10个决策 | 第3节：找出生活中3个锚定效应 | 第6节：设计你的个人决策流程 | 第8节：写一份「我的认知偏差清单」。",
};

export default function SimpleSettingsPanel({ scene, activeType }: { scene: string; activeType: string }) {
  const { showToast } = useEditorStore();

  const allSettings = scene === "marketing" ? settingsByMarketingType : settingsByKnowledgeType;
  const defaultType = scene === "marketing" ? "graphic_seed" : "book_review";
  const currentFields = allSettings[activeType] || allSettings[defaultType];

  const [settings, setSettings] = useState<Record<string, SettingItem[]>>({});
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

  // Get display settings: merge saved values with current type's fields
  const displaySettings = currentFields.map((field) => {
    const saved = settings[activeType]?.find((s) => s.key === field.key);
    return saved || field;
  });

  const handleAdd = (key: string) => {
    setEditingKey(key);
    const existing = displaySettings.find((s) => s.key === key);
    setEditValue(existing?.value || "");
  };

  const handleSave = (key: string) => {
    setSettings((prev) => {
      const current = prev[activeType] || [...currentFields];
      const updated = current.map((item) =>
        item.key === key ? { ...item, value: editValue } : item
      );
      // If key not found in current, add it
      if (!current.find((item) => item.key === key)) {
        const field = currentFields.find((f) => f.key === key);
        if (field) updated.push({ ...field, value: editValue });
      }
      return { ...prev, [activeType]: updated };
    });
    setEditingKey(null);
    showToast("已保存");
  };

  const handleGenerate = (key: string) => {
    setGenerating(key);
    const text = mockGenerateTexts[key] || "AI 生成的设定内容...";

    simulateAIStream(text, (current, done) => {
      setSettings((prev) => {
        const current_settings = prev[activeType] || [...currentFields];
        const updated = current_settings.map((item) =>
          item.key === key ? { ...item, value: current } : item
        );
        if (!current_settings.find((item) => item.key === key)) {
          const field = currentFields.find((f) => f.key === key);
          if (field) updated.push({ ...field, value: current });
        }
        return { ...prev, [activeType]: updated };
      });
      if (done) {
        setGenerating(null);
        showToast("设定生成完成");
      }
    });
  };

  return (
    <div className="p-4 space-y-3">
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

      {displaySettings.map((item) => (
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
              className="text-xs text-gray-500 leading-relaxed cursor-pointer hover:text-gray-700 whitespace-pre-wrap"
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
