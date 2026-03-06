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
  // 文章优化
  { id: "t1", categoryId: "optimize", title: "仿写", description: "复刻风格结构，生成同款", iconColor: "bg-gradient-to-br from-violet-400 to-purple-500", iconEmoji: "✍️" },
  { id: "t2", categoryId: "optimize", title: "续写", description: "承接现有内容，延续创作", iconColor: "bg-gradient-to-br from-blue-400 to-indigo-500", iconEmoji: "📖" },
  { id: "t3", categoryId: "optimize", title: "扩写", description: "补充信息细节，充实内容", iconColor: "bg-gradient-to-br from-emerald-400 to-teal-500", iconEmoji: "📝" },
  { id: "t4", categoryId: "optimize", title: "改写", description: "保留原意不变，优化表达", iconColor: "bg-gradient-to-br from-amber-400 to-orange-500", iconEmoji: "🔄" },
  { id: "t5", categoryId: "optimize", title: "缩写", description: "提炼核心信息，精简输出", iconColor: "bg-gradient-to-br from-cyan-400 to-blue-500", iconEmoji: "✂️" },
  { id: "t6", categoryId: "optimize", title: "润色", description: "提升表达质感，纠错通顺", iconColor: "bg-gradient-to-br from-pink-400 to-rose-500", iconEmoji: "💎" },
  { id: "t7", categoryId: "optimize", title: "划重点", description: "抽离关键结论，输出决策", iconColor: "bg-gradient-to-br from-yellow-400 to-amber-500", iconEmoji: "🎯" },
  // 工作提效
  { id: "t8", categoryId: "work", title: "汇报总结", description: "提炼工作进展，生成汇报", iconColor: "bg-gradient-to-br from-sky-400 to-blue-500", iconEmoji: "📊" },
  { id: "t9", categoryId: "work", title: "会议助手", description: "整理会议纪要，输出待办", iconColor: "bg-gradient-to-br from-emerald-400 to-green-500", iconEmoji: "📋" },
  { id: "t10", categoryId: "work", title: "邮件沟通", description: "生成得体邮件，快速沟通", iconColor: "bg-gradient-to-br from-indigo-400 to-violet-500", iconEmoji: "✉️" },
  { id: "t11", categoryId: "work", title: "个人材料", description: "打造专业人设，助力发展", iconColor: "bg-gradient-to-br from-fuchsia-400 to-pink-500", iconEmoji: "👤" },
  { id: "t12", categoryId: "work", title: "心得体会", description: "梳理经历感悟，沉淀体会", iconColor: "bg-gradient-to-br from-orange-400 to-amber-500", iconEmoji: "💡" },
  // 学术助手
  { id: "t13", categoryId: "academic", title: "论文写作", description: "辅助论文创作，优化学术表达", iconColor: "bg-gradient-to-br from-cyan-400 to-teal-500", iconEmoji: "🎓" },
  { id: "t14", categoryId: "academic", title: "研究报告", description: "整合资料数据，输出深度报告", iconColor: "bg-gradient-to-br from-green-400 to-emerald-500", iconEmoji: "📚" },
  { id: "t15", categoryId: "academic", title: "作文", description: "精准审题立意，生成高分范文", iconColor: "bg-gradient-to-br from-purple-400 to-indigo-500", iconEmoji: "📄" },
  { id: "t16", categoryId: "academic", title: "教学设计", description: "匹配教学目标，提升教学效率", iconColor: "bg-gradient-to-br from-rose-400 to-pink-500", iconEmoji: "📐" },
  // 社媒文案
  { id: "t17", categoryId: "social", title: "小红书笔记", description: "自带流量网感，生成爆款笔记", iconColor: "bg-gradient-to-br from-red-400 to-pink-500", iconEmoji: "📕" },
  { id: "t18", categoryId: "social", title: "内容传播", description: "干货分享营销，文案一键生成", iconColor: "bg-gradient-to-br from-blue-400 to-cyan-500", iconEmoji: "📣" },
  { id: "t19", categoryId: "social", title: "视频直播", description: "生成脚本话术，把控口播节奏", iconColor: "bg-gradient-to-br from-violet-400 to-purple-500", iconEmoji: "🎥" },
  { id: "t20", categoryId: "social", title: "品牌营销", description: "遵循品牌调性，输出全套物料", iconColor: "bg-gradient-to-br from-emerald-400 to-teal-500", iconEmoji: "🏷️" },
  { id: "t21", categoryId: "social", title: "新闻媒体", description: "基于事实材料，撰写专业报道", iconColor: "bg-gradient-to-br from-orange-400 to-amber-500", iconEmoji: "📰" },
  // 生活日常
  { id: "t22", categoryId: "life", title: "人际交往", description: "得体发言，应对各种场合", iconColor: "bg-gradient-to-br from-rose-400 to-red-500", iconEmoji: "🤝" },
  { id: "t23", categoryId: "life", title: "高情商社交", description: "拒绝尴尬，让社交更得体", iconColor: "bg-gradient-to-br from-teal-400 to-cyan-500", iconEmoji: "💬" },
  { id: "t24", categoryId: "life", title: "影书评论", description: "独到观点，写出深度评论", iconColor: "bg-gradient-to-br from-amber-400 to-yellow-500", iconEmoji: "🎬" },
];

export const recentTemplateIds = ["t1", "t8", "t17", "t22"];
