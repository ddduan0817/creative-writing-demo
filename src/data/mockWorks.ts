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
    sceneLabel: "剧本",
    wordCount: 4560,
    updatedAt: "2026-03-04 16:45",
    emoji: "🎬",
  },
  {
    id: "w4",
    title: "美妆好物安利合集",
    scene: "marketing",
    sceneLabel: "其他",
    wordCount: 2130,
    updatedAt: "2026-03-03 11:20",
    emoji: "🌿",
  },
  {
    id: "w5",
    title: "《思考快与慢》拆书稿",
    scene: "knowledge",
    sceneLabel: "内容解读",
    wordCount: 6890,
    updatedAt: "2026-03-02 20:00",
    emoji: "📚",
  },
  {
    id: "w6",
    title: "悬疑分镜脚本 EP01",
    scene: "screenplay",
    sceneLabel: "脚本",
    wordCount: 3210,
    updatedAt: "2026-03-01 15:30",
    emoji: "🎬",
  },
  {
    id: "w7",
    title: "职场成长观点文",
    scene: "knowledge",
    sceneLabel: "内容解读",
    wordCount: 1850,
    updatedAt: "2026-02-28 22:10",
    emoji: "📚",
  },
  {
    id: "w8",
    title: "数码产品种草文案",
    scene: "marketing",
    sceneLabel: "其他",
    wordCount: 980,
    updatedAt: "2026-02-27 13:45",
    emoji: "🌿",
  },
];
