"use client";

import { useState } from "react";
import { Sparkles, Loader2, Upload, X, Check } from "lucide-react";
import { simulateAIStream } from "@/lib/aiSimulator";
import { useEditorStore } from "@/stores/editorStore";
import { cn } from "@/lib/utils";

type FieldType = "select" | "multiSelect" | "text" | "textarea" | "slider" | "auto";

interface SettingField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
}

const settingsBySubScene: Record<string, SettingField[]> = {
  movie: [
    { key: "format", label: "剧本格式", type: "select", options: ["标准电影本", "电视剧本", "舞台剧"] },
    { key: "scene_title", label: "场景标题", type: "text", placeholder: "内/外-地点-时间" },
    { key: "action", label: "动作描述", type: "textarea", placeholder: "人物行动+环境反应" },
    { key: "dialogue", label: "对白", type: "textarea", placeholder: "人物+台词" },
    { key: "note", label: "备注", type: "textarea", placeholder: "潜台词/特殊道具" },
  ],
  short: [
    { key: "duration", label: "单集时长", type: "select", options: ["60秒", "90秒", "120秒"] },
    { key: "hook", label: "前三秒钩子", type: "textarea", placeholder: "开场冲突" },
    { key: "paywall", label: "付费卡点", type: "text", placeholder: "第几集设置付费" },
    { key: "dialogue_density", label: "对白密度", type: "slider" },
    { key: "cliffhanger", label: "结尾悬念", type: "textarea", placeholder: "下集预告/反转点" },
  ],
  comic: [
    { key: "episodes", label: "总集数", type: "text", placeholder: "输入总集数" },
    { key: "style", label: "风格定位", type: "multiSelect", options: ["古风", "现代", "玄幻", "科幻", "甜宠", "悬疑", "搞笑", "热血", "治愈"] },
    { key: "pages_per_ep", label: "每集页数", type: "select", options: ["6页", "8页", "10页", "12页", "15页", "自由"] },
    { key: "characters", label: "角色设定", type: "textarea", placeholder: "角色名称、性格、外貌等" },
    { key: "scene_setting", label: "场景设定", type: "textarea", placeholder: "主要场景描述" },
    { key: "ep_title", label: "分集标题", type: "text", placeholder: "本集标题" },
    { key: "ep_summary", label: "本集概要", type: "textarea", placeholder: "本集主要剧情" },
    { key: "page_content", label: "分页内容", type: "textarea", placeholder: "页码+画面描述+对白+情绪提示" },
    { key: "key_props", label: "关键道具", type: "text", placeholder: "重要道具列表" },
    { key: "transition", label: "转场提示", type: "select", options: ["淡入淡出", "翻页", "滑动", "震动", "无"] },
    { key: "color_tone", label: "色调建议", type: "select", options: ["明亮", "暗黑", "暖色", "冷色", "高饱和", "低饱和"] },
  ],
  storyboard: [
    { key: "shot_num", label: "镜号", type: "auto" },
    { key: "shot_type", label: "景别", type: "select", options: ["远景", "全景", "中景", "近景", "特写"] },
    { key: "camera", label: "摄法", type: "select", options: ["推", "拉", "摇", "移", "跟", "升", "降"] },
    { key: "visual", label: "画面描述", type: "textarea", placeholder: "人物走位+构图参考+光线" },
    { key: "audio", label: "对白/音效", type: "textarea", placeholder: "对应台词/拟音" },
    { key: "duration", label: "时长", type: "text", placeholder: "秒数" },
  ],
  comic_script: [
    { key: "panel", label: "分格说明", type: "textarea", placeholder: "第几格/版面布局" },
    { key: "focus", label: "画面焦点", type: "textarea", placeholder: "特写部位/透视角度" },
    { key: "emotion", label: "情绪参考", type: "select", options: ["参考表情包", "关键词描述"] },
    { key: "bubble", label: "对白位置", type: "select", options: ["气泡在左", "气泡在右", "气泡在上", "气泡在下"] },
    { key: "sfx", label: "特效字", type: "textarea", placeholder: "拟声词/艺术字效果" },
  ],
};

const mockTexts: Record<string, string> = {
  scene_title: "内景 · 咖啡馆 · 白天",
  action: "林晓推门进入，目光在昏暗的大厅里扫了一圈。角落的位子上坐着一个戴帽子的男人，正低头搅着咖啡。",
  dialogue: "林晓：（压低声音）东西带来了吗？\n男人：（抬起头，露出一道疤痕）你确定想看？",
  note: "潜台词：林晓其实已经知道答案，她只是想确认。特殊道具：男人手中的咖啡杯底部刻有暗号。",
  hook: "「三天前，我亲手把自己的葬礼办了。」—— 镜头从墓碑缓缓上移，露出站在雨中的女主角。",
  paywall: "第6集结尾",
  cliffhanger: "男主突然出现在门口，手里拿着一把钥匙——「你要找的东西，我一直都有。」",
  visual: "女主站在天台边缘，夕阳从侧面打来。风吹起她的头发，手中攥着一封信。背景是整个城市的天际线。",
  audio: "对白：「如果时间能重来...」\n音效：风声渐起，远处传来救护车的鸣笛。",
  episodes: "12",
  characters: "女主·林晓：28岁，性格倔强但内心细腻，记者出身。\n男主·陈深：32岁，表面冷漠实则深情，警察背景。",
  scene_setting: "主场景：老旧公寓（暖色调）、警局档案室（冷色调）、城市天台（夕阳暖光）。",
  ep_title: "第1集：重逢",
  ep_summary: "林晓在调查失踪案时意外发现一张十年前的照片，照片中的人竟然是陈深——而他本应在那场火灾中死去。",
  page_content: "P1：远景·城市夜景·雨天 | 画面描述：霓虹灯倒映在积水中 | 对白：无 | 情绪：压抑\nP2：中景·公寓走廊 | 画面描述：林晓独自走向尽头的房间 | 对白：「404...就是这里」 | 情绪：紧张",
  key_props: "旧照片、咖啡杯、警徽、记者证",
  panel: "第1格（满版）：远景俯拍，城市全貌\n第2格（1/3页）：近景，女主侧脸\n第3格（2/3页）：特写，手中的信件",
  focus: "女主瞳孔特写，倒映出男主的身影。透视角度：45度仰拍，强调压迫感。",
  sfx: "「咔嚓」（开门声）、「滴答」（时钟声）。「轰——」使用爆炸式放射线。",
  duration: "3",
};

export default function ScreenplaySettingsPanel({ subScene }: { subScene: string }) {
  const { showToast } = useEditorStore();
  const fields = settingsBySubScene[subScene] || settingsBySubScene.movie;

  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [generating, setGenerating] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [shotCounter, setShotCounter] = useState(1);

  const handleUpload = () => {
    const mockFiles = ["剧本初稿.docx", "分镜参考.pdf", "角色小传.txt", "场景气氛板.png"];
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
    const text = mockTexts[key] || "AI 生成的内容...";
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

  const handleSliderChange = (key: string, value: number) => {
    const labels = ["低", "较低", "中等", "较高", "高"];
    setValues((prev) => ({ ...prev, [key]: labels[value] || "中等" }));
  };

  const handleAutoGenerate = (key: string) => {
    if (key === "shot_num") {
      setValues((prev) => ({ ...prev, [key]: `镜号 ${shotCounter}` }));
      setShotCounter((c) => c + 1);
      showToast(`已生成镜号 ${shotCounter}`);
    }
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

      case "slider":
        const sliderValue = ["低", "较低", "中等", "较高", "高"].indexOf(value as string);
        return (
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="4"
              value={sliderValue >= 0 ? sliderValue : 2}
              onChange={(e) => handleSliderChange(field.key, parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>低</span>
              <span>中</span>
              <span>高</span>
            </div>
            {value && <p className="text-xs text-indigo-600 font-medium">当前：{value}</p>}
          </div>
        );

      case "auto":
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg flex-1">
              {value || "点击生成"}
            </span>
            <button
              onClick={() => handleAutoGenerate(field.key)}
              className="px-2.5 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              生成
            </button>
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
