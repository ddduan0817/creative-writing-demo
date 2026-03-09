import { create } from "zustand";
import { mockChapters, mockOutline, type Chapter } from "@/data/mockChapters";
import { mockCharacters, type Character } from "@/data/mockCharacters";

interface SettingItem {
  key: string;
  label: string;
  value: string;
}

interface EditorState {
  // 场景
  scene: "novel" | "screenplay" | "marketing" | "knowledge" | "general";
  setScene: (scene: EditorState["scene"]) => void;

  // 通用写作 - 选中模板
  selectedTemplateId: string | null;
  setSelectedTemplate: (id: string | null) => void;

  // 基础信息
  title: string;
  setTitle: (title: string) => void;
  saveStatus: "saved" | "saving" | "failed";
  setSaveStatus: (status: "saved" | "saving" | "failed") => void;

  // 左栏视图
  leftView: "settings" | "tags" | "characters" | "outline" | "editor";
  setLeftView: (view: EditorState["leftView"]) => void;

  // 面板折叠
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  toggleLeft: () => void;
  toggleRight: () => void;
  focusMode: boolean;
  toggleFocusMode: () => void;
  layoutMode: "normal" | "ai-assist" | "focus";
  setLayoutMode: (mode: "normal" | "ai-assist" | "focus") => void;

  // 设定
  settings: SettingItem[];
  updateSetting: (key: string, value: string) => void;

  // 标签
  selectedTags: {
    genre: string | null;       // 题材（单选）
    elements: string[];         // 元素（多选，限3）
    style: string[];            // 风格调性（多选，限3）
    ending: string | null;      // 结局（单选）
    timespace: string | null;   // 时空（单选）
  };
  setTagGenre: (tag: string | null) => void;
  toggleTagElement: (tag: string) => void;
  toggleTagStyle: (tag: string) => void;
  setTagEnding: (tag: string | null) => void;
  setTagTimespace: (tag: string | null) => void;
  randomizeTags: () => void;

  // 角色
  characters: Character[];
  addCharacter: (character: Character) => void;

  // 大纲
  outline: string;
  setOutline: (outline: string) => void;

  // 章节
  chapters: Chapter[];
  currentChapterId: string;
  setCurrentChapter: (id: string) => void;
  setChapters: (chapters: Chapter[]) => void;
  updateChapterContent: (id: string, content: string) => void;
  addChapter: (title: string) => void;
  deleteChapter: (id: string) => void;
  renameChapter: (id: string, title: string) => void;

  // 右栏
  rightView: "inspiration" | "tips" | "rhythm" | "consistency";
  setRightView: (view: EditorState["rightView"]) => void;

  // AI对话
  chatMessages: { role: "user" | "assistant"; content: string }[];
  addChatMessage: (message: { role: "user" | "assistant"; content: string }) => void;

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;

  // 灵感卡片 → 编辑器插入
  pendingInsert: string | null;
  setPendingInsert: (text: string | null) => void;

  // 重置为空白文档
  resetToEmpty: (sceneType: EditorState["scene"]) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  scene: "novel",
  setScene: (scene) => set({ scene }),

  selectedTemplateId: null,
  setSelectedTemplate: (id) => set({ selectedTemplateId: id }),

  title: "灵脉纪",
  setTitle: (title) => set({ title }),
  saveStatus: "saved",
  setSaveStatus: (saveStatus) => set({ saveStatus }),

  leftView: "editor",
  setLeftView: (leftView) => set({ leftView }),

  leftCollapsed: false,
  rightCollapsed: false,
  toggleLeft: () => set((s) => ({ leftCollapsed: !s.leftCollapsed })),
  toggleRight: () => set((s) => ({ rightCollapsed: !s.rightCollapsed })),
  focusMode: false,
  toggleFocusMode: () =>
    set((s) => ({
      focusMode: !s.focusMode,
      leftCollapsed: !s.focusMode,
      rightCollapsed: !s.focusMode,
      layoutMode: !s.focusMode ? "focus" : "normal",
    })),
  layoutMode: "normal",
  setLayoutMode: (mode) =>
    set(() => {
      if (mode === "focus") {
        return { layoutMode: "focus", focusMode: true, leftCollapsed: true, rightCollapsed: true };
      }
      if (mode === "ai-assist") {
        return { layoutMode: "ai-assist", focusMode: false, leftCollapsed: true, rightCollapsed: false };
      }
      return { layoutMode: "normal", focusMode: false, leftCollapsed: false, rightCollapsed: false };
    }),

  settings: [
    { key: "background", label: "故事背景", value: "" },
    { key: "keyEvents", label: "前情提要", value: "" },
    { key: "perspective", label: "叙事视角", value: "" },
    { key: "coreConflict", label: "核心冲突", value: "" },
    { key: "redline", label: "创作红线", value: "" },
    { key: "style", label: "语言风格", value: "" },
  ],
  updateSetting: (key, value) =>
    set((s) => ({
      settings: s.settings.map((item) =>
        item.key === key ? { ...item, value } : item
      ),
    })),

  selectedTags: {
    genre: null,
    elements: [],
    style: [],
    ending: null,
    timespace: null,
  },
  setTagGenre: (tag) => set((s) => ({
    selectedTags: { ...s.selectedTags, genre: tag }
  })),
  toggleTagElement: (tag) => set((s) => {
    const current = s.selectedTags.elements;
    if (current.includes(tag)) {
      return { selectedTags: { ...s.selectedTags, elements: current.filter(t => t !== tag) } };
    }
    if (current.length >= 3) return s; // 限制最多3个
    return { selectedTags: { ...s.selectedTags, elements: [...current, tag] } };
  }),
  toggleTagStyle: (tag) => set((s) => {
    const current = s.selectedTags.style;
    if (current.includes(tag)) {
      return { selectedTags: { ...s.selectedTags, style: current.filter(t => t !== tag) } };
    }
    if (current.length >= 3) return s; // 限制最多3个
    return { selectedTags: { ...s.selectedTags, style: [...current, tag] } };
  }),
  setTagEnding: (tag) => set((s) => ({
    selectedTags: { ...s.selectedTags, ending: tag }
  })),
  setTagTimespace: (tag) => set((s) => ({
    selectedTags: { ...s.selectedTags, timespace: tag }
  })),
  randomizeTags: () => set(() => {
    const genres = ["言情", "悬疑", "惊悚", "科幻", "武侠", "仙侠", "历史", "玄幻", "奇幻", "都市", "军事", "电竞", "体育", "现实", "游戏", "末日"];
    const elements = ["权谋", "婚姻", "家庭", "校园", "职场", "娱乐圈", "重生", "穿越", "犯罪", "丧尸", "探险", "宫斗宅斗", "克苏鲁", "系统", "规则怪谈", "团宠", "囤物资", "先婚后爱", "追妻火葬场", "破镜重圆", "争霸", "超能力", "玄学风水", "种田", "直播", "萌宝", "美食", "鉴宝", "聊天群", "无限流", "快穿", "扮猪吃虎", "马甲文", "金手指", "年代文"];
    const styles = ["甜宠", "虐恋", "暗恋", "沙雕", "爽文", "复仇", "逆袭", "励志", "烧脑", "热血", "求生", "打脸", "治愈", "反套路", "搞笑", "反转", "暗黑", "轻松", "慢热", "1v1", "无CP", "双洁", "先虐后甜"];
    const endings = ["HE", "BE", "开放式"];
    const timespaces = ["古代", "现代", "近现代", "未来", "架空", "末世"];

    const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const pickN = <T>(arr: T[], n: number): T[] => {
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, n);
    };

    return {
      selectedTags: {
        genre: pick(genres),
        elements: pickN(elements, 3),
        style: pickN(styles, 3),
        ending: pick(endings),
        timespace: pick(timespaces),
      }
    };
  }),

  characters: mockCharacters,
  addCharacter: (character) =>
    set((s) => ({ characters: [...s.characters, character] })),

  outline: mockOutline,
  setOutline: (outline) => set({ outline }),

  chapters: mockChapters,
  currentChapterId: "ch1",
  setCurrentChapter: (id) => set({ currentChapterId: id, leftView: "editor" }),
  setChapters: (chapters) => set({ chapters, currentChapterId: chapters[0]?.id || "" }),
  updateChapterContent: (id, content) =>
    set((s) => ({
      chapters: s.chapters.map((ch) =>
        ch.id === id
          ? { ...ch, content, wordCount: content.replace(/<[^>]*>/g, "").length }
          : ch
      ),
    })),
  addChapter: (title) =>
    set((s) => {
      const id = `ch${Date.now()}`;
      return {
        chapters: [
          ...s.chapters,
          { id, title, content: "", wordCount: 0 },
        ],
      };
    }),
  deleteChapter: (id) =>
    set((s) => ({
      chapters: s.chapters.filter((ch) => ch.id !== id),
      currentChapterId:
        s.currentChapterId === id
          ? s.chapters[0]?.id || ""
          : s.currentChapterId,
    })),
  renameChapter: (id, title) =>
    set((s) => ({
      chapters: s.chapters.map((ch) =>
        ch.id === id ? { ...ch, title } : ch
      ),
    })),

  rightView: "inspiration",
  setRightView: (rightView) => set({ rightView }),

  chatMessages: [],
  addChatMessage: (message) =>
    set((s) => ({ chatMessages: [...s.chatMessages, message] })),

  toast: null,
  showToast: (msg) => {
    set({ toast: msg });
    setTimeout(() => set({ toast: null }), 2000);
  },

  pendingInsert: null,
  setPendingInsert: (text) => set({ pendingInsert: text }),

  resetToEmpty: (sceneType) => {
    const sceneNames: Record<string, string> = {
      novel: "未命名小说",
      screenplay: "未命名剧本",
      marketing: "未命名文案",
      knowledge: "未命名专栏",
      general: "未命名文档",
    };
    const defaultChapter = {
      id: `ch${Date.now()}`,
      title: sceneType === "screenplay" ? "第1场 开场" : "第一章",
      content: "",
      wordCount: 0,
    };
    set({
      scene: sceneType,
      title: sceneNames[sceneType] || "未命名文档",
      chapters: [defaultChapter],
      currentChapterId: defaultChapter.id,
      outline: "",
      characters: [],
      selectedTags: {
        genre: null,
        elements: [],
        style: [],
        ending: null,
        timespace: null,
      },
      chatMessages: [],
      settings: [
        { key: "background", label: "故事背景", value: "" },
        { key: "keyEvents", label: "前情提要", value: "" },
        { key: "perspective", label: "叙事视角", value: "" },
        { key: "coreConflict", label: "核心冲突", value: "" },
        { key: "redline", label: "创作红线", value: "" },
        { key: "style", label: "语言风格", value: "" },
      ],
    });
  },
}));
