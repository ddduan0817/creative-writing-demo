export interface WorkItem {
  id: string;
  title: string;
  scene: string;
  sceneLabel: string;
  wordCount: number;
  updatedAt: string;
  emoji: string;
}

export const mockWorks: WorkItem[] = [
  {
    id: "w1",
    title: "灵脉纪",
    scene: "novel",
    sceneLabel: "小说",
    wordCount: 12340,
    updatedAt: "2026-03-06 14:30",
    emoji: "📖",
  },
  {
    id: "w2",
    title: "都市修仙录",
    scene: "novel",
    sceneLabel: "小说",
    wordCount: 8720,
    updatedAt: "2026-03-05 09:15",
    emoji: "📖",
  },
  {
    id: "w3",
    title: "逆袭甜宠短剧",
    scene: "screenplay",
    sceneLabel: "剧本脚本",
    wordCount: 4560,
    updatedAt: "2026-03-04 16:45",
    emoji: "🎬",
  },
  {
    id: "w4",
    title: "毕业论文：社交媒体对青年心理健康的影响",
    scene: "general",
    sceneLabel: "通用写作",
    wordCount: 2130,
    updatedAt: "2026-03-03 11:20",
    emoji: "✏️",
  },
  {
    id: "w5",
    title: "年终工作总结",
    scene: "general",
    sceneLabel: "通用写作",
    wordCount: 6890,
    updatedAt: "2026-03-02 20:00",
    emoji: "✏️",
  },
  {
    id: "w6",
    title: "悬疑分镜脚本 EP01",
    scene: "screenplay",
    sceneLabel: "剧本脚本",
    wordCount: 3210,
    updatedAt: "2026-03-01 15:30",
    emoji: "🎬",
  },
  {
    id: "w7",
    title: "产品体验报告",
    scene: "general",
    sceneLabel: "通用写作",
    wordCount: 1850,
    updatedAt: "2026-02-28 22:10",
    emoji: "✏️",
  },
  {
    id: "w8",
    title: "星际迷途",
    scene: "novel",
    sceneLabel: "小说",
    wordCount: 980,
    updatedAt: "2026-02-27 13:45",
    emoji: "📖",
  },
];
