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

const settingsBySubScene: Record<string, SettingItem[]> = {
  movie: [
    { key: "format", label: "剧本格式", value: "" },
    { key: "scene_title", label: "场景标题", value: "" },
    { key: "action", label: "动作描述", value: "" },
    { key: "dialogue", label: "对白", value: "" },
    { key: "note", label: "备注/潜台词", value: "" },
  ],
  short: [
    { key: "duration", label: "单集时长", value: "" },
    { key: "hook", label: "前三秒钩子", value: "" },
    { key: "paywall", label: "付费卡点", value: "" },
    { key: "dialogue_density", label: "对白密度", value: "" },
    { key: "cliffhanger", label: "结尾悬念", value: "" },
  ],
  comic: [
    { key: "episodes", label: "总集数", value: "" },
    { key: "style", label: "风格定位", value: "" },
    { key: "pages_per_ep", label: "每集页数", value: "" },
    { key: "characters", label: "角色设定", value: "" },
    { key: "scene_setting", label: "场景设定", value: "" },
    { key: "ep_title", label: "分集标题", value: "" },
    { key: "ep_summary", label: "本集概要", value: "" },
    { key: "page_content", label: "分页内容", value: "" },
    { key: "key_props", label: "关键道具", value: "" },
    { key: "transition", label: "转场提示", value: "" },
    { key: "color_tone", label: "色调建议", value: "" },
  ],
  storyboard: [
    { key: "shot_type", label: "景别", value: "" },
    { key: "camera", label: "摄法", value: "" },
    { key: "visual", label: "画面描述", value: "" },
    { key: "audio", label: "对白/音效", value: "" },
    { key: "duration", label: "时长（秒）", value: "" },
  ],
  comic_script: [
    { key: "panel", label: "分格说明", value: "" },
    { key: "focus", label: "画面焦点", value: "" },
    { key: "emotion", label: "情绪参考", value: "" },
    { key: "bubble", label: "对白位置", value: "" },
    { key: "sfx", label: "特效字/拟声词", value: "" },
  ],
};

const mockTexts: Record<string, string> = {
  format: "标准电影剧本格式，场景行 + 动作行 + 对白行。",
  scene_title: "内景 · 咖啡馆 · 白天",
  action: "林晓推门进入，目光在昏暗的大厅里扫了一圈。角落的位子上坐着一个戴帽子的男人，正低头搅着咖啡。",
  dialogue: "林晓：（压低声音）东西带来了吗？\n男人：（抬起头，露出一道疤痕）你确定想看？",
  note: "潜台词：林晓其实已经知道答案，她只是想确认。特殊道具：男人手中的咖啡杯底部刻有暗号。",
  hook: "「三天前，我亲手把自己的葬礼办了。」—— 镜头从墓碑缓缓上移，露出站在雨中的女主角。",
  paywall: "第6集结尾设置付费卡点：女主发现男主手机里的聊天记录截图，画面定格在一句「我从来没爱过她」。",
  dialogue_density: "高密度对白，平均每分钟15句以上，适合快节奏都市悬疑。",
  cliffhanger: "结尾悬念：男主突然出现在门口，手里拿着一把钥匙——「你要找的东西，我一直都有。」",
  shot_type: "近景 → 特写 → 全景",
  camera: "缓推 → 快速拉出 → 跟拍",
  visual: "女主站在天台边缘，夕阳从侧面打来。风吹起她的头发，手中攥着一封信。背景是整个城市的天际线。",
  audio: "对白：「如果时间能重来...」\n音效：风声渐起，远处传来救护车的鸣笛。",
  episodes: "共12集，每集约8分钟。",
  style: "现代都市 + 悬疑 + 治愈",
  pages_per_ep: "每集10页，关键情节可扩展至12页。",
  characters: "女主·林晓：28岁，性格倔强但内心细腻，记者出身。\n男主·陈深：32岁，表面冷漠实则深情，警察背景。",
  scene_setting: "主场景：老旧公寓（暖色调）、警局档案室（冷色调）、城市天台（夕阳暖光）。",
  ep_title: "第1集：重逢 | 第2集：疑云 | 第3集：真相 | 第4集：抉择",
  ep_summary: "本集概要：林晓在调查失踪案时意外发现一张十年前的照片，照片中的人竟然是陈深——而他本应在那场火灾中死去。",
  page_content: "P1：远景·城市夜景·雨天 | 画面描述：霓虹灯倒映在积水中 | 对白：无 | 情绪：压抑\nP2：中景·公寓走廊 | 画面描述：林晓独自走向尽头的房间 | 对白：「404...就是这里」 | 情绪：紧张",
  key_props: "旧照片（核心线索）、刻有暗号的咖啡杯、男主的警徽、女主的记者证。",
  transition: "淡入淡出（回忆场景）、滑动（场景切换）、震动（冲击时刻）。",
  color_tone: "日常：暖色调低饱和 | 悬疑：冷色调高对比 | 回忆：偏黄复古滤镜。",
  panel: "第1格（满版）：远景俯拍，城市全貌\n第2格（1/3页）：近景，女主侧脸\n第3格（2/3页）：特写，手中的信件",
  focus: "画面焦点：女主瞳孔特写，倒映出男主的身影。透视角度：45度仰拍，强调压迫感。",
  emotion: "参考表情：微微蹙眉+眼眶泛红（克制的悲伤）关键词：隐忍、不甘、释然。",
  bubble: "气泡在右（女主独白）、气泡在左上（画外音）。",
  sfx: "拟声词：「咔嚓」（开门声）、「滴答」（时钟声）。艺术字效果：「轰——」使用爆炸式放射线。",
};

export default function ScreenplaySettingsPanel({ subScene }: { subScene: string }) {
  const { showToast } = useEditorStore();
  const [settings, setSettings] = useState<SettingItem[]>(
    settingsBySubScene[subScene] || settingsBySubScene.movie
  );
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [generating, setGenerating] = useState<string | null>(null);

  // Update settings when subScene changes
  const currentSettings = settingsBySubScene[subScene] || settingsBySubScene.movie;

  const handleAdd = (key: string) => {
    setEditingKey(key);
    const existing = settings.find((s) => s.key === key);
    setEditValue(existing?.value || "");
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
    const text = mockTexts[key] || "AI 生成的设定内容...";
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

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

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

  const displaySettings = currentSettings.map((cs) => {
    const existing = settings.find((s) => s.key === cs.key);
    return existing || cs;
  });

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        剧本设定
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
