export interface TemplateCategory {
  id: string;
  label: string;
  icon: string;
}

export interface TemplateCard {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  iconColor: string;
  iconEmoji: string;
}

export const templateCategories: TemplateCategory[] = [
  { id: "all", label: "全部", icon: "LayoutGrid" },
  { id: "recent", label: "最近使用", icon: "Clock" },
  { id: "work", label: "工作提效", icon: "Briefcase" },
  { id: "academic", label: "学术助手", icon: "GraduationCap" },
  { id: "social", label: "社媒文案", icon: "Share2" },
  { id: "life", label: "生活日常", icon: "Coffee" },
  { id: "optimize", label: "文章优化", icon: "Wand2" },
];

export const templateCards: TemplateCard[] = [
  // 社媒文案
  { id: "t1", categoryId: "social", title: "小红书笔记", description: "快速产出符合小红书平台调性的吸睛笔记，助力账号运营", iconColor: "bg-gradient-to-br from-red-400 to-pink-500", iconEmoji: "📕" },
  { id: "t2", categoryId: "social", title: "新闻媒体", description: "专业采访大纲生成，确保内容深度和广度", iconColor: "bg-gradient-to-br from-orange-400 to-amber-500", iconEmoji: "📰" },
  { id: "t3", categoryId: "social", title: "内容传播", description: "生成高情商表达话术，坚持立场同时缓和人际关系", iconColor: "bg-gradient-to-br from-blue-400 to-cyan-500", iconEmoji: "📣" },
  { id: "t4", categoryId: "social", title: "品牌营销", description: "生成更吸睛、更具影响力的品牌故事", iconColor: "bg-gradient-to-br from-emerald-400 to-teal-500", iconEmoji: "🏷️" },
  // 工作提效
  { id: "t5", categoryId: "work", title: "会议纪要", description: "快速整理会议内容与行动项", iconColor: "bg-gradient-to-br from-emerald-400 to-green-500", iconEmoji: "📋" },
  { id: "t6", categoryId: "work", title: "工作汇报", description: "生成结构清晰的工作汇报", iconColor: "bg-gradient-to-br from-sky-400 to-blue-500", iconEmoji: "📊" },
  { id: "t7", categoryId: "work", title: "邮件撰写", description: "高效撰写商务邮件", iconColor: "bg-gradient-to-br from-indigo-400 to-violet-500", iconEmoji: "✉️" },
  { id: "t8", categoryId: "work", title: "方案策划", description: "输出完整的项目方案文档", iconColor: "bg-gradient-to-br from-fuchsia-400 to-pink-500", iconEmoji: "💡" },
  // 学术助手
  { id: "t9", categoryId: "academic", title: "论文润色", description: "学术论文语言润色与优化", iconColor: "bg-gradient-to-br from-cyan-400 to-teal-500", iconEmoji: "🎓" },
  { id: "t10", categoryId: "academic", title: "文献综述", description: "辅助撰写文献综述框架", iconColor: "bg-gradient-to-br from-green-400 to-emerald-500", iconEmoji: "📚" },
  // 生活日常
  { id: "t11", categoryId: "life", title: "朋友圈文案", description: "随手记录生活的精彩瞬间", iconColor: "bg-gradient-to-br from-rose-400 to-red-500", iconEmoji: "🌈" },
  { id: "t12", categoryId: "life", title: "旅行日记", description: "记录旅途中的所见所感", iconColor: "bg-gradient-to-br from-teal-400 to-cyan-500", iconEmoji: "✈️" },
  // 文章优化
  { id: "t13", categoryId: "optimize", title: "内容扩写", description: "丰富文章内容，增加细节与深度", iconColor: "bg-gradient-to-br from-yellow-400 to-amber-500", iconEmoji: "📝" },
  { id: "t14", categoryId: "optimize", title: "风格转换", description: "转换文章语言风格与调性", iconColor: "bg-gradient-to-br from-purple-400 to-indigo-500", iconEmoji: "🎨" },
];

export const recentTemplateIds = ["t1", "t5", "t11", "t13"];
