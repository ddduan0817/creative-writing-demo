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

// 三级模板
export interface SubTemplate {
  id: string;
  parentId: string; // 对应二级模板的 id
  title: string;
}

// 四级字段配置
export interface TemplateField {
  key: string;
  label: string;
  type: "input" | "textarea" | "select" | "tags";
  placeholder?: string;
  options?: string[];
  rows?: number;
  required?: boolean;
}

export interface TemplateConfig {
  subTemplateId: string;
  fields: TemplateField[];
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
  { id: "t25", categoryId: "social", title: "内容切片", description: "长视频拆解，高效二创分发", iconColor: "bg-gradient-to-br from-pink-400 to-rose-500", iconEmoji: "✂️" },
  { id: "t20", categoryId: "social", title: "品牌营销", description: "遵循品牌调性，输出全套物料", iconColor: "bg-gradient-to-br from-emerald-400 to-teal-500", iconEmoji: "🏷️" },
  { id: "t21", categoryId: "social", title: "新闻媒体", description: "基于事实材料，撰写专业报道", iconColor: "bg-gradient-to-br from-orange-400 to-amber-500", iconEmoji: "📰" },
  { id: "t26", categoryId: "social", title: "内容解读", description: "深度拆解分析，洞察爆款密码", iconColor: "bg-gradient-to-br from-indigo-400 to-blue-500", iconEmoji: "🔍" },
  // 生活日常
  { id: "t22", categoryId: "life", title: "人际交往", description: "得体发言，应对各种场合", iconColor: "bg-gradient-to-br from-rose-400 to-red-500", iconEmoji: "🤝" },
  { id: "t23", categoryId: "life", title: "高情商社交", description: "拒绝尴尬，让社交更得体", iconColor: "bg-gradient-to-br from-teal-400 to-cyan-500", iconEmoji: "💬" },
  { id: "t24", categoryId: "life", title: "影书评论", description: "独到观点，写出深度评论", iconColor: "bg-gradient-to-br from-amber-400 to-yellow-500", iconEmoji: "🎬" },
];

export const recentTemplateIds = ["t1", "t8", "t17", "t22"];

// 三级模板数据
export const subTemplates: SubTemplate[] = [
  // 汇报总结 (t8)
  { id: "s8-1", parentId: "t8", title: "日报" },
  { id: "s8-2", parentId: "t8", title: "周报" },
  { id: "s8-3", parentId: "t8", title: "月报" },
  { id: "s8-4", parentId: "t8", title: "季报" },
  { id: "s8-5", parentId: "t8", title: "年报" },
  { id: "s8-6", parentId: "t8", title: "项目汇报" },
  { id: "s8-7", parentId: "t8", title: "述职报告" },

  // 会议助手 (t9)
  { id: "s9-1", parentId: "t9", title: "会议纪要" },
  { id: "s9-2", parentId: "t9", title: "会议邀请" },
  { id: "s9-3", parentId: "t9", title: "会议通知" },
  { id: "s9-4", parentId: "t9", title: "会议总结" },

  // 邮件沟通 (t10)
  { id: "s10-1", parentId: "t10", title: "工作邮件" },
  { id: "s10-2", parentId: "t10", title: "感谢邮件" },
  { id: "s10-3", parentId: "t10", title: "道歉邮件" },
  { id: "s10-4", parentId: "t10", title: "邀请邮件" },
  { id: "s10-5", parentId: "t10", title: "催促邮件" },
  { id: "s10-6", parentId: "t10", title: "拒绝邮件" },

  // 个人材料 (t11)
  { id: "s11-1", parentId: "t11", title: "个人简历" },
  { id: "s11-2", parentId: "t11", title: "自我介绍" },
  { id: "s11-3", parentId: "t11", title: "求职信" },
  { id: "s11-4", parentId: "t11", title: "推荐信" },

  // 心得体会 (t12)
  { id: "s12-1", parentId: "t12", title: "读书心得" },
  { id: "s12-2", parentId: "t12", title: "培训心得" },
  { id: "s12-3", parentId: "t12", title: "工作心得" },
  { id: "s12-4", parentId: "t12", title: "学习心得" },

  // 论文写作 (t13)
  { id: "s13-1", parentId: "t13", title: "专业论文" },
  { id: "s13-2", parentId: "t13", title: "论文标题" },
  { id: "s13-3", parentId: "t13", title: "论文大纲" },
  { id: "s13-4", parentId: "t13", title: "论文综述" },

  // 研究报告 (t14)
  { id: "s14-1", parentId: "t14", title: "开题报告" },
  { id: "s14-2", parentId: "t14", title: "调研报告" },
  { id: "s14-3", parentId: "t14", title: "进展报告" },
  { id: "s14-4", parentId: "t14", title: "实践报告" },

  // 作文 (t15)
  { id: "s15-1", parentId: "t15", title: "通用作文" },
  { id: "s15-2", parentId: "t15", title: "记叙文" },
  { id: "s15-3", parentId: "t15", title: "议论文" },
  { id: "s15-4", parentId: "t15", title: "说明文" },
  { id: "s15-5", parentId: "t15", title: "散文" },
  { id: "s15-6", parentId: "t15", title: "日记" },
  { id: "s15-7", parentId: "t15", title: "读后感" },

  // 教学设计 (t16)
  { id: "s16-1", parentId: "t16", title: "教案" },
  { id: "s16-2", parentId: "t16", title: "课件讲义" },
  { id: "s16-3", parentId: "t16", title: "学生评语" },
  { id: "s16-4", parentId: "t16", title: "学情分析" },

  // 小红书笔记 (t17)
  { id: "s17-1", parentId: "t17", title: "标题/封面文案" },
  { id: "s17-2", parentId: "t17", title: "笔记创作" },
  { id: "s17-3", parentId: "t17", title: "评论互动" },

  // 内容传播 (t18)
  { id: "s18-1", parentId: "t18", title: "干货交流" },
  { id: "s18-2", parentId: "t18", title: "日常分享" },
  { id: "s18-3", parentId: "t18", title: "商品营销" },

  // 视频直播 (t19)
  { id: "s19-1", parentId: "t19", title: "短视频口播稿" },
  { id: "s19-2", parentId: "t19", title: "直播台本" },

  // 内容切片 (t25)
  { id: "s25-1", parentId: "t25", title: "长片拆条" },
  { id: "s25-2", parentId: "t25", title: "切片带货" },
  { id: "s25-3", parentId: "t25", title: "知识拆分" },
  { id: "s25-4", parentId: "t25", title: "金句提炼" },
  { id: "s25-5", parentId: "t25", title: "课程拆解" },

  // 品牌营销 (t20)
  { id: "s20-1", parentId: "t20", title: "品牌Slogan" },
  { id: "s20-2", parentId: "t20", title: "品牌故事" },
  { id: "s20-3", parentId: "t20", title: "公关稿" },
  { id: "s20-4", parentId: "t20", title: "广告文案" },

  // 新闻媒体 (t21)
  { id: "s21-1", parentId: "t21", title: "新闻稿" },
  { id: "s21-2", parentId: "t21", title: "观点撰写" },

  // 内容解读 (t26)
  { id: "s26-1", parentId: "t26", title: "影书拆解" },
  { id: "s26-2", parentId: "t26", title: "爆款拆解" },
  { id: "s26-3", parentId: "t26", title: "观点解读" },

  // 人际交往 (t22)
  { id: "s22-1", parentId: "t22", title: "祝福语" },
  { id: "s22-2", parentId: "t22", title: "感谢语" },
  { id: "s22-3", parentId: "t22", title: "道歉语" },
  { id: "s22-4", parentId: "t22", title: "邀请语" },

  // 高情商社交 (t23)
  { id: "s23-1", parentId: "t23", title: "拒绝话术" },
  { id: "s23-2", parentId: "t23", title: "夸人话术" },
  { id: "s23-3", parentId: "t23", title: "安慰话术" },
  { id: "s23-4", parentId: "t23", title: "求助话术" },

  // 影书评论 (t24)
  { id: "s24-1", parentId: "t24", title: "电影评论" },
  { id: "s24-2", parentId: "t24", title: "书评" },
  { id: "s24-3", parentId: "t24", title: "剧评" },
  { id: "s24-4", parentId: "t24", title: "音乐评论" },

  // 文章优化类 - 通用配置
  { id: "s1-1", parentId: "t1", title: "通用仿写" },
  { id: "s2-1", parentId: "t2", title: "通用续写" },
  { id: "s3-1", parentId: "t3", title: "通用扩写" },
  { id: "s4-1", parentId: "t4", title: "通用改写" },
  { id: "s5-1", parentId: "t5", title: "通用缩写" },
  { id: "s6-1", parentId: "t6", title: "通用润色" },
  { id: "s7-1", parentId: "t7", title: "通用划重点" },
];

// 四级配置 - 字段定义
export const templateConfigs: TemplateConfig[] = [
  // 日报
  {
    subTemplateId: "s8-1",
    fields: [
      { key: "date", label: "日期", type: "input", placeholder: "如：2024年3月9日" },
      { key: "todayWork", label: "今日工作内容", type: "textarea", placeholder: "请描述今天完成的主要工作...", rows: 4, required: true },
      { key: "problems", label: "遇到的问题", type: "textarea", placeholder: "工作中遇到的困难或需要协调的事项...", rows: 2 },
      { key: "tomorrowPlan", label: "明日计划", type: "textarea", placeholder: "明天计划完成的工作...", rows: 2 },
      { key: "tone", label: "语气风格", type: "select", options: ["正式简洁", "详细专业", "轻松随意"] },
    ],
  },
  // 周报
  {
    subTemplateId: "s8-2",
    fields: [
      { key: "week", label: "周次", type: "input", placeholder: "如：第10周（3.4-3.8）" },
      { key: "weekWork", label: "本周工作总结", type: "textarea", placeholder: "请总结本周完成的主要工作...", rows: 4, required: true },
      { key: "achievement", label: "重点成果", type: "textarea", placeholder: "本周取得的关键进展或成果...", rows: 2 },
      { key: "problems", label: "问题与风险", type: "textarea", placeholder: "遇到的问题及潜在风险...", rows: 2 },
      { key: "nextWeekPlan", label: "下周计划", type: "textarea", placeholder: "下周的工作安排...", rows: 2 },
      { key: "tone", label: "语气风格", type: "select", options: ["正式简洁", "详细专业", "数据导向"] },
    ],
  },
  // 月报
  {
    subTemplateId: "s8-3",
    fields: [
      { key: "month", label: "月份", type: "input", placeholder: "如：2024年3月" },
      { key: "monthSummary", label: "月度工作总结", type: "textarea", placeholder: "本月主要工作内容及成果...", rows: 5, required: true },
      { key: "keyMetrics", label: "关键指标", type: "textarea", placeholder: "完成的KPI、数据指标等...", rows: 2 },
      { key: "problems", label: "问题分析", type: "textarea", placeholder: "遇到的问题及解决方案...", rows: 2 },
      { key: "nextMonthPlan", label: "下月规划", type: "textarea", placeholder: "下月工作计划...", rows: 2 },
    ],
  },
  // 项目汇报
  {
    subTemplateId: "s8-6",
    fields: [
      { key: "projectName", label: "项目名称", type: "input", placeholder: "请输入项目名称", required: true },
      { key: "progress", label: "项目进度", type: "select", options: ["筹备阶段", "进行中", "收尾阶段", "已完成"] },
      { key: "content", label: "项目概况", type: "textarea", placeholder: "项目背景、目标、当前状态...", rows: 4, required: true },
      { key: "milestone", label: "里程碑", type: "textarea", placeholder: "已完成和待完成的关键节点...", rows: 2 },
      { key: "risk", label: "风险与对策", type: "textarea", placeholder: "潜在风险及应对措施...", rows: 2 },
    ],
  },
  // 会议纪要
  {
    subTemplateId: "s9-1",
    fields: [
      { key: "meetingTitle", label: "会议主题", type: "input", placeholder: "请输入会议主题", required: true },
      { key: "attendees", label: "参会人员", type: "input", placeholder: "参会人员名单" },
      { key: "time", label: "会议时间", type: "input", placeholder: "如：2024年3月9日 14:00-15:00" },
      { key: "content", label: "会议内容", type: "textarea", placeholder: "讨论的主要内容、发言要点...", rows: 5, required: true },
      { key: "decisions", label: "会议决议", type: "textarea", placeholder: "达成的共识、决定的事项...", rows: 2 },
      { key: "todos", label: "待办事项", type: "textarea", placeholder: "后续任务分配（负责人、截止时间）...", rows: 2 },
    ],
  },
  // 工作邮件
  {
    subTemplateId: "s10-1",
    fields: [
      { key: "recipient", label: "收件人", type: "input", placeholder: "收件人称呼，如：张总、各位同事" },
      { key: "subject", label: "邮件主题", type: "input", placeholder: "简洁明了的邮件主题", required: true },
      { key: "purpose", label: "邮件目的", type: "select", options: ["汇报工作", "请求批准", "通知事项", "寻求协助", "确认信息"] },
      { key: "content", label: "邮件内容", type: "textarea", placeholder: "邮件的主要内容...", rows: 4, required: true },
      { key: "tone", label: "语气", type: "select", options: ["正式商务", "礼貌友好", "简洁直接"] },
    ],
  },
  // 个人简历
  {
    subTemplateId: "s11-1",
    fields: [
      { key: "position", label: "目标岗位", type: "input", placeholder: "应聘的职位名称", required: true },
      { key: "experience", label: "工作经历", type: "textarea", placeholder: "按时间倒序列出工作经历...", rows: 4, required: true },
      { key: "education", label: "教育背景", type: "textarea", placeholder: "学历、专业、毕业院校...", rows: 2 },
      { key: "skills", label: "技能特长", type: "textarea", placeholder: "专业技能、证书、语言能力...", rows: 2 },
      { key: "style", label: "简历风格", type: "select", options: ["专业正式", "简洁现代", "创意个性"] },
    ],
  },

  // ========== 学术助手 - 论文写作 ==========
  // 专业论文 (s13-1)
  {
    subTemplateId: "s13-1",
    fields: [
      { key: "title", label: "论文题目", type: "input", placeholder: "请输入论文题目", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["专业不限", "哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "type", label: "类型", type: "select", options: ["课程论文", "毕业论文", "期刊论文", "专升本论文", "教学论文"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "5000字", "8000字", "10000字", "12000字", "15000字", "20000字", "30000字"] },
    ],
  },
  // 论文标题 (s13-2)
  {
    subTemplateId: "s13-2",
    fields: [
      { key: "topic", label: "研究方向/主题", type: "textarea", placeholder: "请描述研究方向或主题...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["专业不限", "哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "type", label: "类型", type: "select", options: ["课程论文", "毕业论文", "期刊论文", "专升本论文", "教学论文"] },
      { key: "length", label: "标题长度", type: "select", options: ["字数不限", "短", "中", "长"] },
    ],
  },
  // 论文大纲 (s13-3)
  {
    subTemplateId: "s13-3",
    fields: [
      { key: "title", label: "论文题目", type: "input", placeholder: "请输入论文题目", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["专业不限", "哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "type", label: "类型", type: "select", options: ["课程论文", "毕业论文", "期刊论文", "专升本论文", "教学论文"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "1000字", "2000字", "3000字", "5000字", "10000字", "15000字"] },
    ],
  },
  // 论文综述 (s13-4)
  {
    subTemplateId: "s13-4",
    fields: [
      { key: "topic", label: "研究主题", type: "textarea", placeholder: "请描述综述的研究主题...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["专业不限", "哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "timeRange", label: "时间范围", type: "select", options: ["时间不限", "近1年", "近3年", "近5年", "近10年"] },
      { key: "literatureCount", label: "文献数量", type: "select", options: ["文献数量不限", "10篇", "20篇", "30篇"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "1500字", "3000字", "5000字", "8000字", "10000字", "15000字"] },
    ],
  },

  // ========== 学术助手 - 研究报告 ==========
  // 开题报告 (s14-1)
  {
    subTemplateId: "s14-1",
    fields: [
      { key: "title", label: "研究题目", type: "input", placeholder: "请输入研究题目", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["专业不限", "哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "1500字", "3000字", "5000字", "8000字", "10000字", "15000字"] },
    ],
  },
  // 调研报告 (s14-2)
  {
    subTemplateId: "s14-2",
    fields: [
      { key: "topic", label: "调研主题", type: "textarea", placeholder: "请描述调研主题...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["专业不限", "哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "1500字", "3000字", "5000字", "8000字", "10000字", "15000字"] },
    ],
  },
  // 进展报告 (s14-3)
  {
    subTemplateId: "s14-3",
    fields: [
      { key: "project", label: "项目/课题名称", type: "input", placeholder: "请输入项目或课题名称", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["专业不限", "哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "cycle", label: "周期", type: "select", options: ["周期不限", "周", "月", "季", "年"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "1500字", "3000字", "5000字", "8000字", "10000字", "15000字"] },
    ],
  },
  // 实践报告 (s14-4)
  {
    subTemplateId: "s14-4",
    fields: [
      { key: "topic", label: "实践主题", type: "textarea", placeholder: "请描述实践内容...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["专业不限", "哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "type", label: "类型", type: "select", options: ["课程实践", "社会实践", "实习报告", "教育实习", "临床实习", "毕设实践"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "1500字", "3000字", "5000字", "8000字", "10000字", "15000字"] },
    ],
  },

  // ========== 学术助手 - 作文 ==========
  // 通用作文 (s15-1)
  {
    subTemplateId: "s15-1",
    fields: [
      { key: "topic", label: "作文题目/主题", type: "input", placeholder: "请输入作文题目或主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 记叙文 (s15-2)
  {
    subTemplateId: "s15-2",
    fields: [
      { key: "topic", label: "作文题目/主题", type: "input", placeholder: "请输入作文题目或主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "structure", label: "结构", type: "select", options: ["顺叙", "倒叙", "插叙"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 议论文 (s15-3)
  {
    subTemplateId: "s15-3",
    fields: [
      { key: "topic", label: "作文题目/主题", type: "input", placeholder: "请输入作文题目或主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "structure", label: "结构", type: "select", options: ["立论", "驳论", "结合"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 说明文 (s15-4)
  {
    subTemplateId: "s15-4",
    fields: [
      { key: "topic", label: "作文题目/主题", type: "input", placeholder: "请输入作文题目或主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "structure", label: "结构", type: "select", options: ["总分总", "并列式", "递进式"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 散文 (s15-5)
  {
    subTemplateId: "s15-5",
    fields: [
      { key: "topic", label: "作文题目/主题", type: "input", placeholder: "请输入作文题目或主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 日记 (s15-6)
  {
    subTemplateId: "s15-6",
    fields: [
      { key: "topic", label: "日记主题/事件", type: "input", placeholder: "请输入日记主题或记录的事件", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 读后感 (s15-7)
  {
    subTemplateId: "s15-7",
    fields: [
      { key: "bookName", label: "书名/文章名", type: "input", placeholder: "请输入阅读的书名或文章名", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },

  // ========== 学术助手 - 教学设计 ==========
  // 教案 (s16-1)
  {
    subTemplateId: "s16-1",
    fields: [
      { key: "topic", label: "课程主题", type: "input", placeholder: "请输入课程主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "subject", label: "学科", type: "select", options: ["语文", "数学", "英语", "政治", "地理", "历史", "物理", "化学", "生物"] },
      { key: "lessonType", label: "课型", type: "select", options: ["课型不限", "新课", "复习课", "练习课", "讲评课", "实验课", "活动课", "作文课", "公开课"] },
      { key: "duration", label: "课时", type: "select", options: ["课时不限", "40分钟", "45分钟", "60分钟", "90分钟"] },
    ],
  },
  // 课件讲义 (s16-2)
  {
    subTemplateId: "s16-2",
    fields: [
      { key: "topic", label: "课程主题", type: "input", placeholder: "请输入课程主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "usage", label: "用途", type: "select", options: ["用途不限", "PPT讲义", "课堂板书"] },
      { key: "pages", label: "页数", type: "select", options: ["页数不限", "5页", "10页", "15页", "20页", "30页"] },
    ],
  },
  // 学生评语 (s16-3)
  {
    subTemplateId: "s16-3",
    fields: [
      { key: "studentInfo", label: "学生情况", type: "textarea", placeholder: "请描述学生的基本情况、特点...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "scene", label: "场景", type: "select", options: ["期末评语", "期中评语", "作业评语", "课堂表现评语"] },
      { key: "format", label: "形式", type: "select", options: ["形式不限", "段落式", "分点式", "小作文", "格律诗", "对联式"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 学情分析 (s16-4)
  {
    subTemplateId: "s16-4",
    fields: [
      { key: "classInfo", label: "班级情况", type: "textarea", placeholder: "请描述班级的基本情况...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["学段不限", "小学", "初中", "高中"] },
      { key: "timeRange", label: "时间范围", type: "select", options: ["时间范围不限", "短期", "中期", "长期"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },

  // ========== 社媒文案 ==========
  // 小红书 - 标题/封面文案 (s17-1)
  {
    subTemplateId: "s17-1",
    fields: [
      { key: "content", label: "内容简介", type: "textarea", placeholder: "描述笔记的核心内容...", rows: 3, required: true },
      { key: "type", label: "类型", type: "select", options: ["类型不限", "测评", "教程", "避坑", "探店", "分享"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "10字", "20字", "50字", "100字", "200字"] },
    ],
  },
  // 小红书 - 笔记创作 (s17-2)
  {
    subTemplateId: "s17-2",
    fields: [
      { key: "topic", label: "笔记主题", type: "textarea", placeholder: "描述笔记要写的内容...", rows: 3, required: true },
      { key: "structure", label: "结构", type: "select", options: ["方法论", "案例拆解", "清单合集", "Q&A", "复盘"] },
      { key: "type", label: "类型", type: "select", options: ["类型不限", "测评", "教程", "避坑", "探店", "分享"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 小红书 - 评论互动 (s17-3)
  {
    subTemplateId: "s17-3",
    fields: [
      { key: "comment", label: "用户评论", type: "textarea", placeholder: "粘贴需要回复的评论...", rows: 2, required: true },
      { key: "context", label: "笔记背景", type: "textarea", placeholder: "简述笔记内容，便于生成合适的回复...", rows: 2 },
      { key: "tone", label: "语气", type: "select", options: ["语气不限", "真诚", "俏皮", "犀利", "幽默", "官方克制"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "10字", "20字", "50字", "100字", "200字"] },
    ],
  },

  // 内容传播 - 干货交流 (s18-1)
  {
    subTemplateId: "s18-1",
    fields: [
      { key: "topic", label: "分享主题", type: "textarea", placeholder: "描述要分享的干货内容...", rows: 3, required: true },
      { key: "platform", label: "平台", type: "select", options: ["平台不限", "公众号长文", "微博", "朋友圈", "社群"] },
      { key: "style", label: "风格", type: "select", options: ["风格不限", "俏皮", "犀利", "正式", "治愈"] },
      { key: "structure", label: "结构", type: "select", options: ["方法论", "案例拆解", "清单合集", "Q&A", "复盘"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 内容传播 - 日常分享 (s18-2)
  {
    subTemplateId: "s18-2",
    fields: [
      { key: "content", label: "分享内容", type: "textarea", placeholder: "描述要分享的日常内容...", rows: 3, required: true },
      { key: "platform", label: "平台", type: "select", options: ["平台不限", "公众号长文", "微博", "朋友圈", "社群"] },
      { key: "style", label: "风格", type: "select", options: ["风格不限", "俏皮", "犀利", "正式", "治愈"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 内容传播 - 商品营销 (s18-3)
  {
    subTemplateId: "s18-3",
    fields: [
      { key: "product", label: "商品信息", type: "textarea", placeholder: "描述商品特点、卖点...", rows: 3, required: true },
      { key: "type", label: "类型", type: "select", options: ["详情文案", "促销话术"] },
      { key: "platform", label: "平台", type: "select", options: ["平台不限", "朋友圈", "社群", "私信", "商品页", "直播间公告"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },

  // 视频直播 - 短视频口播稿 (s19-1)
  {
    subTemplateId: "s19-1",
    fields: [
      { key: "topic", label: "视频主题", type: "textarea", placeholder: "描述视频要讲的内容...", rows: 3, required: true },
      { key: "type", label: "类型", type: "select", options: ["类型不限", "开箱", "测评", "教程", "探店", "对比", "剧情"] },
      { key: "style", label: "风格", type: "select", options: ["风格不限", "真实测评", "专业讲解", "情绪感染", "反转剧情", "干脆直接"] },
      { key: "duration", label: "时长", type: "select", options: ["时长不限", "15秒", "30秒", "60秒", "3分钟", "10分钟"] },
    ],
  },
  // 视频直播 - 直播台本 (s19-2)
  {
    subTemplateId: "s19-2",
    fields: [
      { key: "topic", label: "直播主题", type: "textarea", placeholder: "描述直播内容、产品...", rows: 3, required: true },
      { key: "pace", label: "节奏", type: "select", options: ["节奏不限", "快", "中", "慢"] },
      { key: "type", label: "类型", type: "select", options: ["类型不限", "日常分享", "大促专场", "清仓福利", "其他"] },
      { key: "duration", label: "时长", type: "select", options: ["时长不限", "30分钟", "1小时", "2小时"] },
    ],
  },

  // 内容切片 - 长片拆条 (s25-1)
  {
    subTemplateId: "s25-1",
    fields: [
      { key: "content", label: "原片内容", type: "textarea", placeholder: "粘贴或描述原视频/文章内容...", rows: 5, required: true },
      { key: "clipCount", label: "切片数量", type: "select", options: ["切片数量不限", "3条", "5条", "10条"] },
      { key: "style", label: "风格", type: "select", options: ["风格不限", "口语", "专业", "幽默", "犀利"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "500字", "800字", "1000字", "1500字", "3000字", "5000字", "10000字"] },
    ],
  },
  // 内容切片 - 切片带货 (s25-2)
  {
    subTemplateId: "s25-2",
    fields: [
      { key: "content", label: "原片内容", type: "textarea", placeholder: "粘贴或描述原视频/文章内容...", rows: 5, required: true },
      { key: "clipCount", label: "切片数量", type: "select", options: ["切片数量不限", "3条", "5条", "10条"] },
      { key: "style", label: "风格", type: "select", options: ["风格不限", "口语", "专业", "幽默", "犀利"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "500字", "800字", "1000字", "1500字", "3000字", "5000字", "10000字"] },
    ],
  },
  // 内容切片 - 知识拆分 (s25-3)
  {
    subTemplateId: "s25-3",
    fields: [
      { key: "content", label: "原片内容", type: "textarea", placeholder: "粘贴或描述原视频/文章内容...", rows: 5, required: true },
      { key: "clipCount", label: "切片数量", type: "select", options: ["切片数量不限", "3条", "5条", "10条"] },
      { key: "style", label: "风格", type: "select", options: ["风格不限", "口语", "专业", "幽默", "犀利"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "500字", "800字", "1000字", "1500字", "3000字", "5000字", "10000字"] },
    ],
  },
  // 内容切片 - 金句提炼 (s25-4)
  {
    subTemplateId: "s25-4",
    fields: [
      { key: "content", label: "原片内容", type: "textarea", placeholder: "粘贴或描述原视频/文章内容...", rows: 5, required: true },
      { key: "clipCount", label: "切片数量", type: "select", options: ["切片数量不限", "3条", "5条", "10条"] },
      { key: "style", label: "风格", type: "select", options: ["风格不限", "口语", "专业", "幽默", "犀利"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "500字", "800字", "1000字", "1500字", "3000字", "5000字", "10000字"] },
    ],
  },
  // 内容切片 - 课程拆解 (s25-5)
  {
    subTemplateId: "s25-5",
    fields: [
      { key: "content", label: "原片内容", type: "textarea", placeholder: "粘贴或描述原视频/文章内容...", rows: 5, required: true },
      { key: "clipCount", label: "切片数量", type: "select", options: ["切片数量不限", "3条", "5条", "10条"] },
      { key: "style", label: "风格", type: "select", options: ["风格不限", "口语", "专业", "幽默", "犀利"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "500字", "800字", "1000字", "1500字", "3000字", "5000字", "10000字"] },
    ],
  },

  // 品牌营销 - 品牌Slogan (s20-1)
  {
    subTemplateId: "s20-1",
    fields: [
      { key: "brand", label: "品牌信息", type: "textarea", placeholder: "描述品牌定位、核心价值...", rows: 3, required: true },
      { key: "tone", label: "语气", type: "select", options: ["语气不限", "正式", "幽默", "年轻化"] },
      { key: "scene", label: "场景", type: "select", options: ["场景不限", "官网介绍", "招商加盟", "媒体报道", "社媒简介", "活动发布"] },
    ],
  },
  // 品牌营销 - 品牌故事 (s20-2)
  {
    subTemplateId: "s20-2",
    fields: [
      { key: "brand", label: "品牌信息", type: "textarea", placeholder: "描述品牌历史、理念、愿景...", rows: 4, required: true },
      { key: "tone", label: "语气", type: "select", options: ["语气不限", "正式", "幽默", "年轻化"] },
      { key: "scene", label: "场景", type: "select", options: ["场景不限", "官网介绍", "招商加盟", "媒体报道", "社媒简介", "活动发布"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 品牌营销 - 公关稿 (s20-3)
  {
    subTemplateId: "s20-3",
    fields: [
      { key: "event", label: "事件/主题", type: "textarea", placeholder: "描述公关事件或主题...", rows: 4, required: true },
      { key: "type", label: "类型", type: "select", options: ["类型不限", "新品发布", "战略合作", "融资消息", "品牌升级", "公益活动", "获奖背书", "危机回应"] },
      { key: "channel", label: "发布渠道", type: "select", options: ["媒体通稿", "对外公告", "内部邮件"] },
      { key: "tone", label: "语气", type: "select", options: ["语气不限", "正式", "中性", "年轻化"] },
    ],
  },
  // 品牌营销 - 广告文案 (s20-4)
  {
    subTemplateId: "s20-4",
    fields: [
      { key: "product", label: "产品/服务", type: "textarea", placeholder: "描述要推广的产品或服务...", rows: 3, required: true },
      { key: "carrier", label: "载体", type: "select", options: ["载体不限", "短句", "海报SOP", "电梯屏", "开屏", "脚本钩子"] },
      { key: "goal", label: "目标", type: "select", options: ["目标不限", "拉新", "促活", "转化", "品牌心智"] },
      { key: "style", label: "风格", type: "select", options: ["风格不限", "简单直接", "情绪共鸣", "中性克制", "幽默反差"] },
    ],
  },

  // 新闻媒体 - 新闻稿 (s21-1)
  {
    subTemplateId: "s21-1",
    fields: [
      { key: "event", label: "事件/主题", type: "textarea", placeholder: "描述新闻事件的核心内容...", rows: 4, required: true },
      { key: "type", label: "类型", type: "select", options: ["类型不限", "事件消息", "新品发布", "报告解读", "人物专访", "活动报道"] },
      { key: "tone", label: "口径", type: "select", options: ["口径不限", "官方公告", "媒体中立", "行业分析"] },
      { key: "structure", label: "结构", type: "select", options: ["倒金字塔", "三段式", "Q&A新闻通报"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "500字", "800字", "1000字", "1500字", "3000字"] },
    ],
  },
  // 新闻媒体 - 观点撰写 (s21-2)
  {
    subTemplateId: "s21-2",
    fields: [
      { key: "topic", label: "议题/事件", type: "textarea", placeholder: "描述要评论的议题或事件...", rows: 4, required: true },
      { key: "stance", label: "立场", type: "select", options: ["中立", "支持", "反对"] },
      { key: "tone", label: "语气", type: "select", options: ["语气不限", "理性", "犀利", "温和"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "100字", "300字", "500字", "800字"] },
    ],
  },

  // 内容解读 - 影书拆解 (s26-1)
  {
    subTemplateId: "s26-1",
    fields: [
      { key: "work", label: "作品信息", type: "textarea", placeholder: "填写影视/书籍名称及简介...", rows: 3, required: true },
      { key: "platform", label: "平台", type: "select", options: ["平台不限", "小红书图文", "公众号长文", "知乎", "微博", "视频口播稿"] },
      { key: "angle", label: "角度", type: "select", options: ["角度不限", "剧情结构", "人物弧光", "主题立意", "叙事手法", "营销传播"] },
      { key: "format", label: "表达形式", type: "select", options: ["表达形式不限", "清单要点", "长文深度", "金句解读", "复盘总结"] },
      { key: "tone", label: "语气", type: "select", options: ["语气不限", "中立", "理性", "温和", "犀利", "幽默"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "500字", "800字", "1000字", "1500字", "3000字", "5000字", "10000字"] },
    ],
  },
  // 内容解读 - 爆款拆解 (s26-2)
  {
    subTemplateId: "s26-2",
    fields: [
      { key: "content", label: "爆款内容", type: "textarea", placeholder: "粘贴或描述要拆解的爆款内容...", rows: 4, required: true },
      { key: "inputType", label: "输入形态", type: "select", options: ["图文", "短视频", "公众号文章", "直播切片"] },
      { key: "focus", label: "重点", type: "tags", options: ["选题分析", "标题与封面钩子", "结构与节奏", "卖点", "互动设计", "转化路径", "视觉镜头"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "500字", "800字", "1000字", "1500字", "3000字", "5000字", "10000字"] },
    ],
  },
  // 内容解读 - 观点解读 (s26-3)
  {
    subTemplateId: "s26-3",
    fields: [
      { key: "topic", label: "议题/事件", type: "textarea", placeholder: "描述要解读的议题或事件...", rows: 4, required: true },
      { key: "platform", label: "平台", type: "select", options: ["平台不限", "小红书图文", "公众号长文", "知乎", "微博", "视频口播稿"] },
      { key: "angle", label: "角度", type: "select", options: ["角度不限", "时间线梳理", "争议点拆分", "因果链分析", "观点对比", "影响评估"] },
      { key: "tone", label: "语气", type: "select", options: ["语气不限", "中立", "理性", "温和", "犀利", "幽默"] },
      { key: "wordCount", label: "字数", type: "select", options: ["字数不限", "500字", "800字", "1000字", "1500字", "3000字", "5000字", "10000字"] },
    ],
  },

  // ========== 生活日常 ==========
  {
    subTemplateId: "s22-1",
    fields: [
      { key: "occasion", label: "场合", type: "select", options: ["生日", "结婚", "新年", "升职", "乔迁", "毕业", "节日", "其他"], required: true },
      { key: "recipient", label: "对象", type: "input", placeholder: "祝福对象，如：朋友、长辈、同事..." },
      { key: "relationship", label: "关系", type: "select", options: ["亲密朋友", "普通朋友", "长辈", "晚辈", "同事", "领导", "客户"] },
      { key: "extra", label: "补充信息", type: "textarea", placeholder: "特殊要求或想表达的内容...", rows: 2 },
      { key: "style", label: "风格", type: "select", options: ["真挚温暖", "幽默风趣", "文艺诗意", "正式得体"] },
    ],
  },
  // 电影评论
  {
    subTemplateId: "s24-1",
    fields: [
      { key: "movieName", label: "电影名称", type: "input", placeholder: "请输入电影名称", required: true },
      { key: "rating", label: "个人评分", type: "select", options: ["10分-神作", "8-9分-优秀", "6-7分-一般", "5分以下-较差"] },
      { key: "impression", label: "观影感受", type: "textarea", placeholder: "看完电影的感受、印象深刻的点...", rows: 4, required: true },
      { key: "aspect", label: "评论角度", type: "tags", options: ["剧情", "演技", "画面", "配乐", "主题", "节奏", "细节"] },
      { key: "style", label: "评论风格", type: "select", options: ["专业影评", "个人感想", "深度解析", "轻松吐槽"] },
    ],
  },
  // 通用仿写
  {
    subTemplateId: "s1-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要仿写的原文...", rows: 5, required: true },
      { key: "topic", label: "新主题", type: "textarea", placeholder: "仿写的新主题或内容方向...", rows: 2, required: true },
      { key: "keepStyle", label: "保留元素", type: "tags", options: ["语言风格", "结构框架", "修辞手法", "情感基调", "段落节奏"] },
    ],
  },
  // 通用续写
  {
    subTemplateId: "s2-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要续写的原文...", rows: 5, required: true },
      { key: "direction", label: "续写方向", type: "textarea", placeholder: "希望续写的内容方向...", rows: 2 },
      { key: "length", label: "续写长度", type: "select", options: ["短续(100-200字)", "中续(300-500字)", "长续(500字以上)"] },
    ],
  },
  // 通用扩写
  {
    subTemplateId: "s3-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要扩写的原文...", rows: 4, required: true },
      { key: "expandAspect", label: "扩展方向", type: "tags", options: ["增加细节", "补充例证", "深化分析", "丰富描写", "增加过渡"] },
      { key: "targetLength", label: "目标字数", type: "select", options: ["扩展50%", "扩展100%", "扩展200%"] },
    ],
  },
  // 通用改写
  {
    subTemplateId: "s4-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要改写的原文...", rows: 5, required: true },
      { key: "requirement", label: "改写要求", type: "textarea", placeholder: "具体的改写需求...", rows: 2 },
      { key: "targetStyle", label: "目标风格", type: "select", options: ["更正式", "更口语", "更简洁", "更详细", "更生动"] },
    ],
  },
  // 通用缩写
  {
    subTemplateId: "s5-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要缩写的原文...", rows: 6, required: true },
      { key: "targetLength", label: "目标字数", type: "select", options: ["精简至50%", "精简至30%", "精简至100字内", "精简至50字内"] },
      { key: "keepElements", label: "保留要点", type: "textarea", placeholder: "必须保留的核心信息...", rows: 2 },
    ],
  },
  // 通用润色
  {
    subTemplateId: "s6-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要润色的原文...", rows: 5, required: true },
      { key: "focus", label: "润色重点", type: "tags", options: ["语法纠错", "措辞优化", "逻辑通顺", "风格统一", "表达升级"] },
      { key: "targetTone", label: "目标语气", type: "select", options: ["保持原样", "更正式", "更生动", "更专业", "更口语化"] },
    ],
  },
  // 通用划重点
  {
    subTemplateId: "s7-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要提取重点的原文...", rows: 6, required: true },
      { key: "format", label: "输出格式", type: "select", options: ["要点列表", "一句话总结", "思维导图", "关键词"] },
      { key: "focus", label: "关注方向", type: "textarea", placeholder: "特别关注的方面（可选）...", rows: 2 },
    ],
  },
];

// 获取某个二级模板的所有三级模板
export function getSubTemplates(parentId: string): SubTemplate[] {
  return subTemplates.filter((s) => s.parentId === parentId);
}

// 获取某个三级模板的四级配置
export function getTemplateConfig(subTemplateId: string): TemplateConfig | undefined {
  return templateConfigs.find((c) => c.subTemplateId === subTemplateId);
}
