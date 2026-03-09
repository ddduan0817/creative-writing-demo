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
  { id: "t27", categoryId: "optimize", title: "检索成文", description: "多源调研整合，深度输出", iconColor: "bg-gradient-to-br from-indigo-400 to-purple-500", iconEmoji: "🔎" },
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
  { id: "t20", categoryId: "social", title: "品牌营销", description: "遵循品牌调性，输出全套物料", iconColor: "bg-gradient-to-br from-emerald-400 to-teal-500", iconEmoji: "🏷️" },
  { id: "t21", categoryId: "social", title: "新闻媒体", description: "基于事实材料，撰写专业报道", iconColor: "bg-gradient-to-br from-orange-400 to-amber-500", iconEmoji: "📰" },
  // 生活日常
  { id: "t22", categoryId: "life", title: "人际交往", description: "得体发言，应对各种场合", iconColor: "bg-gradient-to-br from-rose-400 to-red-500", iconEmoji: "🤝" },
  { id: "t23", categoryId: "life", title: "高情商社交", description: "拒绝尴尬，让社交更得体", iconColor: "bg-gradient-to-br from-teal-400 to-cyan-500", iconEmoji: "💬" },
  { id: "t24", categoryId: "life", title: "影书评论", description: "独到观点，写出深度评论", iconColor: "bg-gradient-to-br from-amber-400 to-yellow-500", iconEmoji: "🎬" },
];

export const recentTemplateIds = ["t1", "t8", "t17", "t22"];

// 三级模板数据
export const subTemplates: SubTemplate[] = [
  // 汇报总结 (t8)
  { id: "s8-1", parentId: "t8", title: "阶段总结" },
  { id: "s8-2", parentId: "t8", title: "正式汇报" },
  { id: "s8-3", parentId: "t8", title: "工作计划" },
  { id: "s8-4", parentId: "t8", title: "演示大纲" },
  { id: "s8-5", parentId: "t8", title: "演示讲稿" },
  { id: "s8-6", parentId: "t8", title: "方案策划" },
  { id: "s8-7", parentId: "t8", title: "商业计划书" },
  { id: "s8-8", parentId: "t8", title: "汇报材料" },

  // 会议助手 (t9)
  { id: "s9-1", parentId: "t9", title: "会议纪要" },
  { id: "s9-2", parentId: "t9", title: "会议安排" },

  // 邮件沟通 (t10)
  { id: "s10-1", parentId: "t10", title: "通用" },
  { id: "s10-2", parentId: "t10", title: "通知邮件" },
  { id: "s10-3", parentId: "t10", title: "回复邮件" },

  // 个人材料 (t11)
  { id: "s11-1", parentId: "t11", title: "个人简历" },
  { id: "s11-2", parentId: "t11", title: "自我介绍" },
  { id: "s11-3", parentId: "t11", title: "申请" },

  // 心得体会 (t12)
  { id: "s12-1", parentId: "t12", title: "通用" },
  { id: "s12-2", parentId: "t12", title: "党团" },
  { id: "s12-3", parentId: "t12", title: "安全" },
  { id: "s12-4", parentId: "t12", title: "培训" },
  { id: "s12-5", parentId: "t12", title: "学习" },
  { id: "s12-6", parentId: "t12", title: "参观" },
  { id: "s12-7", parentId: "t12", title: "座谈" },

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

  // 品牌营销 (t20)
  { id: "s20-1", parentId: "t20", title: "品牌Slogan" },
  { id: "s20-2", parentId: "t20", title: "品牌故事" },
  { id: "s20-3", parentId: "t20", title: "公关稿" },
  { id: "s20-4", parentId: "t20", title: "广告文案" },

  // 新闻媒体 (t21)
  { id: "s21-1", parentId: "t21", title: "新闻稿" },
  { id: "s21-2", parentId: "t21", title: "观点撰写" },

  // 人际交往 (t22)
  { id: "s22-1", parentId: "t22", title: "祝福贺词" },
  { id: "s22-2", parentId: "t22", title: "致辞发言" },
  { id: "s22-3", parentId: "t22", title: "家校沟通" },

  // 高情商社交 (t23)
  { id: "s23-1", parentId: "t23", title: "通用场景" },
  { id: "s23-2", parentId: "t23", title: "情侣" },
  { id: "s23-3", parentId: "t23", title: "职场" },
  { id: "s23-4", parentId: "t23", title: "聚会" },
  { id: "s23-5", parentId: "t23", title: "家庭" },
  { id: "s23-6", parentId: "t23", title: "校园" },

  // 影书评论 (t24)
  { id: "s24-1", parentId: "t24", title: "安利推荐" },
  { id: "s24-2", parentId: "t24", title: "避雷吐槽" },
  { id: "s24-3", parentId: "t24", title: "深度解读" },

  // 文章优化类
  // 仿写 (t1)
  { id: "s1-1", parentId: "t1", title: "结构仿写" },
  { id: "s1-2", parentId: "t1", title: "风格仿写" },
  { id: "s1-3", parentId: "t1", title: "标题仿写" },
  { id: "s1-4", parentId: "t1", title: "语气迁移" },

  // 续写 (t2)
  { id: "s2-1", parentId: "t2", title: "正文续写" },
  { id: "s2-2", parentId: "t2", title: "结构补齐" },
  { id: "s2-3", parentId: "t2", title: "承上启下" },
  { id: "s2-4", parentId: "t2", title: "收尾总结" },

  // 扩写 (t3)
  { id: "s3-1", parentId: "t3", title: "段落展开" },
  { id: "s3-2", parentId: "t3", title: "细节补全" },
  { id: "s3-3", parentId: "t3", title: "论据补强" },
  { id: "s3-4", parentId: "t3", title: "卖点深化" },
  { id: "s3-5", parentId: "t3", title: "提纲成文" },

  // 改写 (t4)
  { id: "s4-1", parentId: "t4", title: "语气调整" },
  { id: "s4-2", parentId: "t4", title: "结构重组" },
  { id: "s4-3", parentId: "t4", title: "视角转换" },
  { id: "s4-4", parentId: "t4", title: "场景适配" },
  { id: "s4-5", parentId: "t4", title: "降重改写" },

  // 缩写 (t5)
  { id: "s5-1", parentId: "t5", title: "段落摘要" },
  { id: "s5-2", parentId: "t5", title: "要点清单" },
  { id: "s5-3", parentId: "t5", title: "内容压缩" },
  { id: "s5-4", parentId: "t5", title: "分层提纲" },
  { id: "s5-5", parentId: "t5", title: "一句话总结" },

  // 润色 (t6)
  { id: "s6-1", parentId: "t6", title: "通顺纠错" },
  { id: "s6-2", parentId: "t6", title: "精简表达" },
  { id: "s6-3", parentId: "t6", title: "文风统一" },
  { id: "s6-4", parentId: "t6", title: "专业度提升" },
  { id: "s6-5", parentId: "t6", title: "感染力提升" },

  // 划重点 (t7)
  { id: "s7-1", parentId: "t7", title: "关键结论" },
  { id: "s7-2", parentId: "t7", title: "安排计划" },
  { id: "s7-3", parentId: "t7", title: "逻辑框架" },

  // 检索成文 (t27)
  { id: "s27-1", parentId: "t27", title: "深度调研" },
  { id: "s27-2", parentId: "t27", title: "多源综述" },
  { id: "s27-3", parentId: "t27", title: "数据盘点" },
  { id: "s27-4", parentId: "t27", title: "方案设计" },
];

// 四级配置 - 字段定义
export const templateConfigs: TemplateConfig[] = [
  // 日报
  // ========== 工作提效 ==========
  // 汇报总结 - 阶段总结 (s8-1)
  {
    subTemplateId: "s8-1",
    fields: [
      { key: "content", label: "工作内容", type: "textarea", placeholder: "请描述需要总结的工作内容...", rows: 4, required: true },
      { key: "position", label: "岗位", type: "select", options: ["企业人员", "政府人员", "教师", "医护", "学生"] },
      { key: "cycle", label: "周期", type: "select", options: ["日", "周", "月", "季", "年"] },
      { key: "scope", label: "范围", type: "select", options: ["个人", "团队"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },
  // 汇报总结 - 正式汇报 (s8-2)
  {
    subTemplateId: "s8-2",
    fields: [
      { key: "content", label: "汇报内容", type: "textarea", placeholder: "请描述需要汇报的工作内容...", rows: 4, required: true },
      { key: "scene", label: "场景", type: "select", options: ["述职", "晋升", "转正", "年终", "路演"] },
      { key: "position", label: "岗位", type: "select", options: ["企业人员", "政府人员", "教师", "医护", "学生"] },
      { key: "role", label: "角色", type: "select", options: ["个人", "主管", "负责人"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },
  // 汇报总结 - 工作计划 (s8-3)
  {
    subTemplateId: "s8-3",
    fields: [
      { key: "content", label: "计划内容", type: "textarea", placeholder: "请描述工作计划的主要内容...", rows: 4, required: true },
      { key: "position", label: "岗位", type: "select", options: ["企业人员", "政府人员", "教师", "医护", "学生"] },
      { key: "cycle", label: "周期", type: "select", options: ["日", "周", "月", "季", "年"] },
      { key: "scope", label: "范围", type: "select", options: ["个人", "团队"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },
  // 汇报总结 - 演示大纲 (s8-4)
  {
    subTemplateId: "s8-4",
    fields: [
      { key: "content", label: "演示内容", type: "textarea", placeholder: "请描述演示的主要内容...", rows: 4, required: true },
      { key: "tone", label: "语气", type: "select", options: ["中性", "正式"] },
      { key: "target", label: "对象", type: "select", options: ["同事", "上级", "下属", "客户"] },
      { key: "pages", label: "页数", type: "select", options: ["5页", "10页", "15页", "20页", "30页"] },
    ],
  },
  // 汇报总结 - 演示讲稿 (s8-5)
  {
    subTemplateId: "s8-5",
    fields: [
      { key: "content", label: "演示内容", type: "textarea", placeholder: "请描述演示的主要内容...", rows: 4, required: true },
      { key: "tone", label: "语气", type: "select", options: ["中性", "正式"] },
      { key: "target", label: "对象", type: "select", options: ["同事", "上级", "下属", "客户"] },
      { key: "pages", label: "页数", type: "select", options: ["5页", "10页", "15页", "20页", "30页"] },
    ],
  },
  // 汇报总结 - 方案策划 (s8-6)
  {
    subTemplateId: "s8-6",
    fields: [
      { key: "content", label: "方案内容", type: "textarea", placeholder: "请描述方案的主要内容...", rows: 4, required: true },
      { key: "scene", label: "场景", type: "select", options: ["企业", "校园-校级", "校园-班级", "线上"] },
      { key: "type", label: "类型", type: "select", options: ["活动策划", "项目实施", "宣传推广", "招募报名", "主题活动", "赛事运营"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字"] },
    ],
  },
  // 汇报总结 - 商业计划书 (s8-7)
  {
    subTemplateId: "s8-7",
    fields: [
      { key: "content", label: "项目内容", type: "textarea", placeholder: "请描述商业项目的主要内容...", rows: 4, required: true },
      { key: "topic", label: "主题", type: "select", options: ["企业服务", "消费品牌", "教育培训", "医疗健康", "文旅餐饮", "本地生活", "制造", "跨境电商", "其他"] },
      { key: "structure", label: "结构", type: "select", options: ["标准版", "路演版", "内部立项版", "招商合作版"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },
  // 汇报总结 - 汇报材料 (s8-8)
  {
    subTemplateId: "s8-8",
    fields: [
      { key: "content", label: "汇报主题", type: "textarea", placeholder: "请描述需要汇报的主题...", rows: 4, required: true },
      { key: "source", label: "来源偏好", type: "select", options: ["官方机构", "权威媒体", "行业研报", "学术论文", "综合"], required: true },
      { key: "style", label: "风格", type: "select", options: ["正式严谨", "商务专业", "科普易懂", "结论先行"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },

  // 会议助手 - 会议纪要 (s9-1)
  {
    subTemplateId: "s9-1",
    fields: [
      { key: "content", label: "会议内容", type: "textarea", placeholder: "请描述会议讨论的主要内容...", rows: 5, required: true },
      { key: "tone", label: "语气", type: "select", options: ["中性", "正式", "口语"] },
      { key: "type", label: "类型", type: "select", options: ["标准", "精简", "总结"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字"] },
    ],
  },
  // 会议助手 - 会议安排 (s9-2)
  {
    subTemplateId: "s9-2",
    fields: [
      { key: "content", label: "会议主题", type: "textarea", placeholder: "请描述会议的主题和目的...", rows: 3, required: true },
      { key: "type", label: "类型", type: "select", options: ["日常例会", "项目对齐", "方案评审", "面试", "头脑风暴", "客户沟通", "培训分享", "1v1沟通", "复盘"] },
      { key: "format", label: "形式", type: "select", options: ["线上", "线下", "线上+线下"] },
      { key: "duration", label: "时长", type: "select", options: ["15分钟", "30分钟", "1小时", "2小时"] },
    ],
  },

  // 邮件沟通 - 通用 (s10-1)
  {
    subTemplateId: "s10-1",
    fields: [
      { key: "content", label: "邮件内容", type: "textarea", placeholder: "请描述邮件的主要内容...", rows: 4, required: true },
      { key: "tone", label: "语气", type: "select", options: ["更委婉", "中性", "更正式"] },
      { key: "target", label: "对象", type: "select", options: ["同事", "上级", "下属", "客户"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "500字", "1000字", "1500字"] },
    ],
  },
  // 邮件沟通 - 通知邮件 (s10-2)
  {
    subTemplateId: "s10-2",
    fields: [
      { key: "content", label: "通知内容", type: "textarea", placeholder: "请描述需要通知的内容...", rows: 4, required: true },
      { key: "tone", label: "语气", type: "select", options: ["更委婉", "中性", "更正式"] },
      { key: "target", label: "对象", type: "select", options: ["同事", "上级", "下属", "客户"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "500字", "1000字", "1500字"] },
    ],
  },
  // 邮件沟通 - 回复邮件 (s10-3)
  {
    subTemplateId: "s10-3",
    fields: [
      { key: "originalEmail", label: "原邮件内容", type: "textarea", placeholder: "请粘贴需要回复的邮件内容...", rows: 3, required: true },
      { key: "replyContent", label: "回复要点", type: "textarea", placeholder: "请描述回复的主要内容...", rows: 3, required: true },
      { key: "tone", label: "语气", type: "select", options: ["更委婉", "中性", "更正式"] },
      { key: "target", label: "对象", type: "select", options: ["同事", "上级", "下属", "客户"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "500字", "1000字", "1500字"] },
    ],
  },

  // 个人材料 - 个人简历 (s11-1)
  {
    subTemplateId: "s11-1",
    fields: [
      { key: "experience", label: "工作经历", type: "textarea", placeholder: "请描述您的工作经历...", rows: 4, required: true },
      { key: "pages", label: "页数", type: "select", options: ["一页", "两页", "详细"], required: true },
      { key: "position", label: "岗位", type: "select", options: ["产品", "运营", "开发", "测试", "设计", "市场", "销售", "财务", "人事", "咨询", "教师", "医护", "管培", "其他"] },
      { key: "industry", label: "行业", type: "select", options: ["互联网", "金融", "教育", "医疗"] },
      { key: "unitType", label: "单位性质", type: "select", options: ["外企", "国企", "民营", "事业单位", "政府机关"] },
      { key: "type", label: "类型", type: "select", options: ["校招", "社招", "实习", "其他"], required: true },
    ],
  },
  // 个人材料 - 自我介绍 (s11-2)
  {
    subTemplateId: "s11-2",
    fields: [
      { key: "content", label: "个人情况", type: "textarea", placeholder: "请描述您的基本情况...", rows: 4, required: true },
      { key: "duration", label: "时长", type: "select", options: ["30秒", "1分钟", "3分钟"] },
      { key: "tone", label: "语气", type: "select", options: ["幽默", "中性", "正式"] },
    ],
  },
  // 个人材料 - 申请 (s11-3)
  {
    subTemplateId: "s11-3",
    fields: [
      { key: "content", label: "申请内容", type: "textarea", placeholder: "请描述申请的具体内容和原因...", rows: 4, required: true },
      { key: "type", label: "类型", type: "select", options: ["请假", "转正", "离职"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "500字", "1000字", "1500字"] },
    ],
  },

  // 心得体会 - 通用 (s12-1)
  {
    subTemplateId: "s12-1",
    fields: [
      { key: "content", label: "体会内容", type: "textarea", placeholder: "请描述心得体会的主要内容...", rows: 4, required: true },
      { key: "position", label: "岗位", type: "select", options: ["企业人员", "政府人员", "教师", "医护", "学生"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },
  // 心得体会 - 党团 (s12-2)
  {
    subTemplateId: "s12-2",
    fields: [
      { key: "content", label: "体会内容", type: "textarea", placeholder: "请描述党团活动的心得体会...", rows: 4, required: true },
      { key: "position", label: "岗位", type: "select", options: ["企业人员", "政府人员", "教师", "医护", "学生"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },
  // 心得体会 - 安全 (s12-3)
  {
    subTemplateId: "s12-3",
    fields: [
      { key: "content", label: "体会内容", type: "textarea", placeholder: "请描述安全学习的心得体会...", rows: 4, required: true },
      { key: "position", label: "岗位", type: "select", options: ["企业人员", "政府人员", "教师", "医护", "学生"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },
  // 心得体会 - 培训 (s12-4)
  {
    subTemplateId: "s12-4",
    fields: [
      { key: "content", label: "体会内容", type: "textarea", placeholder: "请描述培训活动的心得体会...", rows: 4, required: true },
      { key: "position", label: "岗位", type: "select", options: ["企业人员", "政府人员", "教师", "医护", "学生"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },
  // 心得体会 - 学习 (s12-5)
  {
    subTemplateId: "s12-5",
    fields: [
      { key: "content", label: "体会内容", type: "textarea", placeholder: "请描述学习活动的心得体会...", rows: 4, required: true },
      { key: "position", label: "岗位", type: "select", options: ["企业人员", "政府人员", "教师", "医护", "学生"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },
  // 心得体会 - 参观 (s12-6)
  {
    subTemplateId: "s12-6",
    fields: [
      { key: "content", label: "体会内容", type: "textarea", placeholder: "请描述参观活动的心得体会...", rows: 4, required: true },
      { key: "position", label: "岗位", type: "select", options: ["企业人员", "政府人员", "教师", "医护", "学生"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },
  // 心得体会 - 座谈 (s12-7)
  {
    subTemplateId: "s12-7",
    fields: [
      { key: "content", label: "体会内容", type: "textarea", placeholder: "请描述座谈会的心得体会...", rows: 4, required: true },
      { key: "position", label: "岗位", type: "select", options: ["企业人员", "政府人员", "教师", "医护", "学生"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字", "5000字", "8000字", "10000字"] },
    ],
  },

  // ========== 学术助手 - 论文写作 ==========
  // 专业论文 (s13-1)
  {
    subTemplateId: "s13-1",
    fields: [
      { key: "title", label: "论文题目", type: "input", placeholder: "请输入论文题目", required: true },
      { key: "level", label: "学段", type: "select", options: ["专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "type", label: "类型", type: "select", options: ["课程论文", "毕业论文", "期刊论文", "专升本论文", "教学论文"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["5000字", "8000字", "10000字", "12000字", "15000字", "20000字", "30000字"] },
    ],
  },
  // 论文标题 (s13-2)
  {
    subTemplateId: "s13-2",
    fields: [
      { key: "topic", label: "研究方向/主题", type: "textarea", placeholder: "请描述研究方向或主题...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "type", label: "类型", type: "select", options: ["课程论文", "毕业论文", "期刊论文", "专升本论文", "教学论文"], required: true },
      { key: "length", label: "标题长度", type: "select", options: ["短", "中", "长"] },
    ],
  },
  // 论文大纲 (s13-3)
  {
    subTemplateId: "s13-3",
    fields: [
      { key: "title", label: "论文题目", type: "input", placeholder: "请输入论文题目", required: true },
      { key: "level", label: "学段", type: "select", options: ["专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "type", label: "类型", type: "select", options: ["课程论文", "毕业论文", "期刊论文", "专升本论文", "教学论文"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["1000字", "2000字", "3000字", "5000字", "10000字", "15000字"] },
    ],
  },
  // 论文综述 (s13-4)
  {
    subTemplateId: "s13-4",
    fields: [
      { key: "topic", label: "研究主题", type: "textarea", placeholder: "请描述综述的研究主题...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "timeRange", label: "时间范围", type: "select", options: ["近1年", "近3年", "近5年", "近10年"] },
      { key: "literatureCount", label: "文献数量", type: "select", options: ["10篇", "20篇", "30篇"] },
      { key: "wordCount", label: "字数", type: "select", options: ["1500字", "3000字", "5000字", "8000字", "10000字", "15000字"] },
    ],
  },

  // ========== 学术助手 - 研究报告 ==========
  // 开题报告 (s14-1)
  {
    subTemplateId: "s14-1",
    fields: [
      { key: "title", label: "研究题目", type: "input", placeholder: "请输入研究题目", required: true },
      { key: "level", label: "学段", type: "select", options: ["专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "wordCount", label: "字数", type: "select", options: ["1500字", "3000字", "5000字", "8000字", "10000字", "15000字"] },
    ],
  },
  // 调研报告 (s14-2)
  {
    subTemplateId: "s14-2",
    fields: [
      { key: "topic", label: "调研主题", type: "textarea", placeholder: "请描述调研主题...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "wordCount", label: "字数", type: "select", options: ["1500字", "3000字", "5000字", "8000字", "10000字", "15000字"] },
    ],
  },
  // 进展报告 (s14-3)
  {
    subTemplateId: "s14-3",
    fields: [
      { key: "project", label: "项目/课题名称", type: "input", placeholder: "请输入项目或课题名称", required: true },
      { key: "level", label: "学段", type: "select", options: ["专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "cycle", label: "周期", type: "select", options: ["周", "月", "季", "年"] },
      { key: "wordCount", label: "字数", type: "select", options: ["1500字", "3000字", "5000字", "8000字", "10000字", "15000字"] },
    ],
  },
  // 实践报告 (s14-4)
  {
    subTemplateId: "s14-4",
    fields: [
      { key: "topic", label: "实践主题", type: "textarea", placeholder: "请描述实践内容...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["专科", "本科", "硕士", "博士"] },
      { key: "major", label: "专业", type: "select", options: ["哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学", "农学", "医学", "管理学", "艺术学"] },
      { key: "type", label: "类型", type: "select", options: ["课程实践", "社会实践", "实习报告", "教育实习", "临床实习", "毕设实践"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["1500字", "3000字", "5000字", "8000字", "10000字", "15000字"] },
    ],
  },

  // ========== 学术助手 - 作文 ==========
  // 通用作文 (s15-1)
  {
    subTemplateId: "s15-1",
    fields: [
      { key: "topic", label: "作文题目/主题", type: "input", placeholder: "请输入作文题目或主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 记叙文 (s15-2)
  {
    subTemplateId: "s15-2",
    fields: [
      { key: "topic", label: "作文题目/主题", type: "input", placeholder: "请输入作文题目或主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "structure", label: "结构", type: "select", options: ["顺叙", "倒叙", "插叙"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 议论文 (s15-3)
  {
    subTemplateId: "s15-3",
    fields: [
      { key: "topic", label: "作文题目/主题", type: "input", placeholder: "请输入作文题目或主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "structure", label: "结构", type: "select", options: ["立论", "驳论", "结合"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 说明文 (s15-4)
  {
    subTemplateId: "s15-4",
    fields: [
      { key: "topic", label: "作文题目/主题", type: "input", placeholder: "请输入作文题目或主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "structure", label: "结构", type: "select", options: ["总分总", "并列式", "递进式"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 散文 (s15-5)
  {
    subTemplateId: "s15-5",
    fields: [
      { key: "topic", label: "作文题目/主题", type: "input", placeholder: "请输入作文题目或主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 日记 (s15-6)
  {
    subTemplateId: "s15-6",
    fields: [
      { key: "topic", label: "日记主题/事件", type: "input", placeholder: "请输入日记主题或记录的事件", required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 读后感 (s15-7)
  {
    subTemplateId: "s15-7",
    fields: [
      { key: "bookName", label: "书名/文章名", type: "input", placeholder: "请输入阅读的书名或文章名", required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },

  // ========== 学术助手 - 教学设计 ==========
  // 教案 (s16-1)
  {
    subTemplateId: "s16-1",
    fields: [
      { key: "topic", label: "课程主题", type: "input", placeholder: "请输入课程主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "subject", label: "学科", type: "select", options: ["语文", "数学", "英语", "政治", "地理", "历史", "物理", "化学", "生物"], required: true },
      { key: "lessonType", label: "课型", type: "select", options: ["新课", "复习课", "练习课", "讲评课", "实验课", "活动课", "作文课", "公开课"] },
      { key: "duration", label: "课时", type: "select", options: ["40分钟", "45分钟", "60分钟", "90分钟"] },
    ],
  },
  // 课件讲义 (s16-2)
  {
    subTemplateId: "s16-2",
    fields: [
      { key: "topic", label: "课程主题", type: "input", placeholder: "请输入课程主题", required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "usage", label: "用途", type: "select", options: ["PPT讲义", "课堂板书"] },
      { key: "pages", label: "页数", type: "select", options: ["5页", "10页", "15页", "20页", "30页"] },
    ],
  },
  // 学生评语 (s16-3)
  {
    subTemplateId: "s16-3",
    fields: [
      { key: "studentInfo", label: "学生情况", type: "textarea", placeholder: "请描述学生的基本情况、特点...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "scene", label: "场景", type: "select", options: ["期末评语", "期中评语", "作业评语", "课堂表现评语"], required: true },
      { key: "format", label: "形式", type: "select", options: ["段落式", "分点式", "小作文", "格律诗", "对联式"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 学情分析 (s16-4)
  {
    subTemplateId: "s16-4",
    fields: [
      { key: "classInfo", label: "班级情况", type: "textarea", placeholder: "请描述班级的基本情况...", rows: 3, required: true },
      { key: "level", label: "学段", type: "select", options: ["小学", "初中", "高中"] },
      { key: "timeRange", label: "时间范围", type: "select", options: ["短期", "中期", "长期"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },

  // ========== 社媒文案 ==========
  // 小红书 - 标题/封面文案 (s17-1)
  {
    subTemplateId: "s17-1",
    fields: [
      { key: "content", label: "内容简介", type: "textarea", placeholder: "描述笔记的核心内容...", rows: 3, required: true },
      { key: "type", label: "类型", type: "select", options: ["测评", "教程", "避坑", "探店", "分享"] },
      { key: "wordCount", label: "字数", type: "select", options: ["10字", "20字", "50字", "100字", "200字"] },
    ],
  },
  // 小红书 - 笔记创作 (s17-2)
  {
    subTemplateId: "s17-2",
    fields: [
      { key: "topic", label: "笔记主题", type: "textarea", placeholder: "描述笔记要写的内容...", rows: 3, required: true },
      { key: "structure", label: "结构", type: "select", options: ["方法论", "案例拆解", "清单合集", "Q&A", "复盘"], required: true },
      { key: "type", label: "类型", type: "select", options: ["测评", "教程", "避坑", "探店", "分享"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 小红书 - 评论互动 (s17-3)
  {
    subTemplateId: "s17-3",
    fields: [
      { key: "comment", label: "用户评论", type: "textarea", placeholder: "粘贴需要回复的评论...", rows: 2, required: true },
      { key: "context", label: "笔记背景", type: "textarea", placeholder: "简述笔记内容，便于生成合适的回复...", rows: 2 },
      { key: "tone", label: "语气", type: "select", options: ["真诚", "俏皮", "犀利", "幽默", "官方克制"] },
      { key: "wordCount", label: "字数", type: "select", options: ["10字", "20字", "50字", "100字", "200字"] },
    ],
  },

  // 内容传播 - 干货交流 (s18-1)
  {
    subTemplateId: "s18-1",
    fields: [
      { key: "topic", label: "分享主题", type: "textarea", placeholder: "描述要分享的干货内容...", rows: 3, required: true },
      { key: "platform", label: "平台", type: "select", options: ["公众号长文", "微博", "朋友圈", "社群"] },
      { key: "style", label: "风格", type: "select", options: ["俏皮", "犀利", "正式", "治愈"] },
      { key: "structure", label: "结构", type: "select", options: ["方法论", "案例拆解", "清单合集", "Q&A", "复盘"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 内容传播 - 日常分享 (s18-2)
  {
    subTemplateId: "s18-2",
    fields: [
      { key: "content", label: "分享内容", type: "textarea", placeholder: "描述要分享的日常内容...", rows: 3, required: true },
      { key: "platform", label: "平台", type: "select", options: ["公众号长文", "微博", "朋友圈", "社群"] },
      { key: "style", label: "风格", type: "select", options: ["俏皮", "犀利", "正式", "治愈"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 内容传播 - 商品营销 (s18-3)
  {
    subTemplateId: "s18-3",
    fields: [
      { key: "product", label: "商品信息", type: "textarea", placeholder: "描述商品特点、卖点...", rows: 3, required: true },
      { key: "type", label: "类型", type: "select", options: ["详情文案", "促销话术"] },
      { key: "platform", label: "平台", type: "select", options: ["朋友圈", "社群", "私信", "商品页", "直播间公告"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },

  // 品牌营销 - 品牌Slogan (s20-1)
  {
    subTemplateId: "s20-1",
    fields: [
      { key: "brand", label: "品牌信息", type: "textarea", placeholder: "描述品牌定位、核心价值...", rows: 3, required: true },
      { key: "tone", label: "语气", type: "select", options: ["正式", "幽默", "年轻化"] },
      { key: "scene", label: "场景", type: "select", options: ["官网介绍", "招商加盟", "媒体报道", "社媒简介", "活动发布"] },
    ],
  },
  // 品牌营销 - 品牌故事 (s20-2)
  {
    subTemplateId: "s20-2",
    fields: [
      { key: "brand", label: "品牌信息", type: "textarea", placeholder: "描述品牌历史、理念、愿景...", rows: 4, required: true },
      { key: "tone", label: "语气", type: "select", options: ["正式", "幽默", "年轻化"] },
      { key: "scene", label: "场景", type: "select", options: ["官网介绍", "招商加盟", "媒体报道", "社媒简介", "活动发布"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字", "1000字"] },
    ],
  },
  // 品牌营销 - 公关稿 (s20-3)
  {
    subTemplateId: "s20-3",
    fields: [
      { key: "event", label: "事件/主题", type: "textarea", placeholder: "描述公关事件或主题...", rows: 4, required: true },
      { key: "type", label: "类型", type: "select", options: ["新品发布", "战略合作", "融资消息", "品牌升级", "公益活动", "获奖背书", "危机回应"] },
      { key: "channel", label: "发布渠道", type: "select", options: ["媒体通稿", "对外公告", "内部邮件"] },
      { key: "tone", label: "语气", type: "select", options: ["正式", "中性", "年轻化"] },
    ],
  },
  // 品牌营销 - 广告文案 (s20-4)
  {
    subTemplateId: "s20-4",
    fields: [
      { key: "product", label: "产品/服务", type: "textarea", placeholder: "描述要推广的产品或服务...", rows: 3, required: true },
      { key: "carrier", label: "载体", type: "select", options: ["短句", "海报SOP", "电梯屏", "开屏", "脚本钩子"] },
      { key: "goal", label: "目标", type: "select", options: ["拉新", "促活", "转化", "品牌心智"] },
      { key: "style", label: "风格", type: "select", options: ["简单直接", "情绪共鸣", "中性克制", "幽默反差"] },
    ],
  },

  // 新闻媒体 - 新闻稿 (s21-1)
  {
    subTemplateId: "s21-1",
    fields: [
      { key: "event", label: "事件/主题", type: "textarea", placeholder: "描述新闻事件的核心内容...", rows: 4, required: true },
      { key: "type", label: "类型", type: "select", options: ["事件消息", "新品发布", "报告解读", "人物专访", "活动报道"] },
      { key: "tone", label: "口径", type: "select", options: ["官方公告", "媒体中立", "行业分析"] },
      { key: "structure", label: "结构", type: "select", options: ["倒金字塔", "三段式", "Q&A新闻通报"] },
      { key: "wordCount", label: "字数", type: "select", options: ["500字", "800字", "1000字", "1500字", "3000字"] },
    ],
  },
  // 新闻媒体 - 观点撰写 (s21-2)
  {
    subTemplateId: "s21-2",
    fields: [
      { key: "topic", label: "议题/事件", type: "textarea", placeholder: "描述要评论的议题或事件...", rows: 4, required: true },
      { key: "stance", label: "立场", type: "select", options: ["中立", "支持", "反对"] },
      { key: "tone", label: "语气", type: "select", options: ["理性", "犀利", "温和"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "800字"] },
    ],
  },

  // ========== 生活日常 ==========
  // 人际交往 - 祝福贺词 (s22-1)
  {
    subTemplateId: "s22-1",
    fields: [
      { key: "recipient", label: "对象", type: "select", options: ["亲人", "朋友", "同事", "领导", "长辈", "晚辈", "恋人"] },
      { key: "scene", label: "场景", type: "select", options: ["生日", "结婚", "乔迁", "升职", "毕业", "节日", "新年", "中秋", "其他"] },
      { key: "tone", label: "语气", type: "select", options: ["真挚温暖", "幽默风趣", "文艺诗意", "正式得体"] },
      { key: "wordCount", label: "字数", type: "select", options: ["50字", "100字", "200字", "300字"] },
    ],
  },
  // 人际交往 - 致辞发言 (s22-2)
  {
    subTemplateId: "s22-2",
    fields: [
      { key: "recipient", label: "对象", type: "select", options: ["亲人", "朋友", "同事", "领导", "长辈", "晚辈", "恋人"] },
      { key: "scene", label: "场景", type: "select", options: ["婚礼", "生日宴", "聚会", "毕业典礼", "颁奖", "追悼会", "其他"] },
      { key: "tone", label: "语气", type: "select", options: ["真挚温暖", "幽默风趣", "文艺诗意", "正式得体"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字"] },
    ],
  },
  // 人际交往 - 家校沟通 (s22-3)
  {
    subTemplateId: "s22-3",
    fields: [
      { key: "identity", label: "身份", type: "select", options: ["家长", "老师"] },
      { key: "purpose", label: "目的", type: "select", options: ["请假", "反馈问题", "表扬感谢", "咨询事宜", "其他"] },
      { key: "occasion", label: "场合", type: "select", options: ["微信私聊", "家长群", "家长会", "书面信函"] },
      { key: "wordCount", label: "字数", type: "select", options: ["50字", "100字", "200字", "300字"] },
    ],
  },

  // 高情商社交 - 通用场景 (s23-1)
  {
    subTemplateId: "s23-1",
    fields: [
      { key: "purpose", label: "目的", type: "textarea", placeholder: "描述你想要表达的目的或情境...", rows: 3, required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["50字", "100字", "200字", "300字"] },
    ],
  },
  // 高情商社交 - 情侣 (s23-2)
  {
    subTemplateId: "s23-2",
    fields: [
      { key: "purpose", label: "目的", type: "textarea", placeholder: "描述你想要表达的目的或情境...", rows: 3, required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["50字", "100字", "200字", "300字"] },
    ],
  },
  // 高情商社交 - 职场 (s23-3)
  {
    subTemplateId: "s23-3",
    fields: [
      { key: "purpose", label: "目的", type: "textarea", placeholder: "描述你想要表达的目的或情境...", rows: 3, required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["50字", "100字", "200字", "300字"] },
    ],
  },
  // 高情商社交 - 聚会 (s23-4)
  {
    subTemplateId: "s23-4",
    fields: [
      { key: "purpose", label: "目的", type: "textarea", placeholder: "描述你想要表达的目的或情境...", rows: 3, required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["50字", "100字", "200字", "300字"] },
    ],
  },
  // 高情商社交 - 家庭 (s23-5)
  {
    subTemplateId: "s23-5",
    fields: [
      { key: "purpose", label: "目的", type: "textarea", placeholder: "描述你想要表达的目的或情境...", rows: 3, required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["50字", "100字", "200字", "300字"] },
    ],
  },
  // 高情商社交 - 校园 (s23-6)
  {
    subTemplateId: "s23-6",
    fields: [
      { key: "purpose", label: "目的", type: "textarea", placeholder: "描述你想要表达的目的或情境...", rows: 3, required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["50字", "100字", "200字", "300字"] },
    ],
  },

  // 影书评论 - 安利推荐 (s24-1)
  {
    subTemplateId: "s24-1",
    fields: [
      { key: "type", label: "类型", type: "select", options: ["电影", "电视剧", "书籍", "综艺", "纪录片", "动漫"] },
      { key: "style", label: "风格", type: "select", options: ["热情安利", "理性分析", "幽默轻松", "文艺抒情"] },
      { key: "angle", label: "角度", type: "tags", options: ["剧情", "演技/文笔", "视听/画面", "主题立意", "情感共鸣", "细节彩蛋"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字"] },
    ],
  },
  // 影书评论 - 避雷吐槽 (s24-2)
  {
    subTemplateId: "s24-2",
    fields: [
      { key: "type", label: "类型", type: "select", options: ["电影", "电视剧", "书籍", "综艺", "纪录片", "动漫"] },
      { key: "style", label: "风格", type: "select", options: ["犀利吐槽", "理性分析", "幽默调侃", "中肯点评"] },
      { key: "angle", label: "角度", type: "tags", options: ["剧情", "演技/文笔", "视听/画面", "主题立意", "逻辑硬伤", "节奏拖沓"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "200字", "300字", "500字", "800字"] },
    ],
  },
  // 影书评论 - 深度解读 (s24-3)
  {
    subTemplateId: "s24-3",
    fields: [
      { key: "type", label: "类型", type: "select", options: ["电影", "电视剧", "书籍", "综艺", "纪录片", "动漫"] },
      { key: "style", label: "风格", type: "select", options: ["学术分析", "个人感悟", "对比解读", "隐喻解析"] },
      { key: "angle", label: "角度", type: "tags", options: ["主题思想", "人物塑造", "叙事结构", "符号隐喻", "时代背景", "创作手法"] },
      { key: "wordCount", label: "字数", type: "select", options: ["300字", "500字", "800字", "1000字", "1500字"] },
    ],
  },
  // ========== 文章优化 ==========
  // 仿写 - 结构仿写 (s1-1)
  {
    subTemplateId: "s1-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要仿写的原文...", rows: 5, required: true },
      { key: "topic", label: "新主题", type: "textarea", placeholder: "仿写的新主题或内容方向...", rows: 2, required: true },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
      { key: "similarity", label: "相似度", type: "select", options: ["低", "中", "高"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 仿写 - 风格仿写 (s1-2)
  {
    subTemplateId: "s1-2",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要仿写的原文...", rows: 5, required: true },
      { key: "topic", label: "新主题", type: "textarea", placeholder: "仿写的新主题或内容方向...", rows: 2, required: true },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
      { key: "similarity", label: "相似度", type: "select", options: ["低", "中", "高"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 仿写 - 标题仿写 (s1-3)
  {
    subTemplateId: "s1-3",
    fields: [
      { key: "original", label: "原标题", type: "textarea", placeholder: "粘贴需要仿写的标题...", rows: 2, required: true },
      { key: "topic", label: "新主题", type: "textarea", placeholder: "仿写的新主题或内容方向...", rows: 2, required: true },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
      { key: "similarity", label: "相似度", type: "select", options: ["低", "中", "高"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 仿写 - 语气迁移 (s1-4)
  {
    subTemplateId: "s1-4",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要仿写的原文...", rows: 5, required: true },
      { key: "topic", label: "新主题", type: "textarea", placeholder: "仿写的新主题或内容方向...", rows: 2, required: true },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
      { key: "similarity", label: "相似度", type: "select", options: ["低", "中", "高"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },

  // 续写 - 正文续写 (s2-1)
  {
    subTemplateId: "s2-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要续写的原文...", rows: 5, required: true },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
      { key: "consistency", label: "一致性", type: "select", options: ["严格保持", "适度调整"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 续写 - 结构补齐 (s2-2)
  {
    subTemplateId: "s2-2",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要续写的原文...", rows: 5, required: true },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
      { key: "consistency", label: "一致性", type: "select", options: ["严格保持", "适度调整"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 续写 - 承上启下 (s2-3)
  {
    subTemplateId: "s2-3",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要续写的原文...", rows: 5, required: true },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
      { key: "consistency", label: "一致性", type: "select", options: ["严格保持", "适度调整"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 续写 - 收尾总结 (s2-4)
  {
    subTemplateId: "s2-4",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要续写的原文...", rows: 5, required: true },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
      { key: "consistency", label: "一致性", type: "select", options: ["严格保持", "适度调整"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },

  // 扩写 - 段落展开 (s3-1)
  {
    subTemplateId: "s3-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要扩写的原文...", rows: 5, required: true },
      { key: "style", label: "文风", type: "select", options: ["原风格", "更正式", "更口语", "更生动", "更克制"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 扩写 - 细节补全 (s3-2)
  {
    subTemplateId: "s3-2",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要扩写的原文...", rows: 5, required: true },
      { key: "style", label: "文风", type: "select", options: ["原风格", "更正式", "更口语", "更生动", "更克制"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 扩写 - 论据补强 (s3-3)
  {
    subTemplateId: "s3-3",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要扩写的原文...", rows: 5, required: true },
      { key: "style", label: "文风", type: "select", options: ["原风格", "更网感", "更高级", "更幽默", "更克制"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 扩写 - 卖点深化 (s3-4)
  {
    subTemplateId: "s3-4",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要扩写的原文...", rows: 5, required: true },
      { key: "style", label: "文风", type: "select", options: ["原风格", "更正式", "更口语", "更生动", "更克制"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 扩写 - 提纲成文 (s3-5)
  {
    subTemplateId: "s3-5",
    fields: [
      { key: "original", label: "提纲", type: "textarea", placeholder: "粘贴需要扩写的提纲...", rows: 5, required: true },
      { key: "style", label: "文风", type: "select", options: ["原风格", "更正式", "更口语", "更生动", "更克制"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },

  // 改写 - 语气调整 (s4-1)
  {
    subTemplateId: "s4-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要改写的原文...", rows: 5, required: true },
      { key: "tone", label: "语气", type: "select", options: ["更通俗", "更正式", "更犀利", "更温柔", "更委婉", "更专业"] },
      { key: "degree", label: "幅度", type: "select", options: ["轻改", "中改", "大改"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 改写 - 结构重组 (s4-2)
  {
    subTemplateId: "s4-2",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要改写的原文...", rows: 5, required: true },
      { key: "degree", label: "幅度", type: "select", options: ["轻改", "中改", "大改"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 改写 - 视角转换 (s4-3)
  {
    subTemplateId: "s4-3",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要改写的原文...", rows: 5, required: true },
      { key: "person", label: "人称", type: "select", options: ["第一人称", "第二人称", "第三人称"] },
      { key: "degree", label: "幅度", type: "select", options: ["轻改", "中改", "大改"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 改写 - 场景适配 (s4-4)
  {
    subTemplateId: "s4-4",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要改写的原文...", rows: 5, required: true },
      { key: "degree", label: "幅度", type: "select", options: ["轻改", "中改", "大改"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 改写 - 降重改写 (s4-5)
  {
    subTemplateId: "s4-5",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要改写的原文...", rows: 5, required: true },
      { key: "degree", label: "幅度", type: "select", options: ["轻改", "中改", "大改"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },

  // 缩写 - 段落摘要 (s5-1)
  {
    subTemplateId: "s5-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要缩写的原文...", rows: 6, required: true },
      { key: "focus", label: "重点", type: "select", options: ["结论优先", "论据优先", "数据优先", "行动优先"] },
      { key: "tone", label: "语气", type: "select", options: ["中性客观", "更有力度", "更口语化"] },
      { key: "wordCount", label: "字数", type: "select", options: ["20字", "50字", "100字", "200字", "500字", "1000字"] },
    ],
  },
  // 缩写 - 要点清单 (s5-2)
  {
    subTemplateId: "s5-2",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要缩写的原文...", rows: 6, required: true },
      { key: "focus", label: "重点", type: "select", options: ["结论优先", "论据优先", "数据优先", "行动优先"] },
      { key: "tone", label: "语气", type: "select", options: ["中性客观", "更有力度", "更口语化"] },
      { key: "count", label: "数量", type: "select", options: ["3条", "5条", "10条", "15条", "20条"] },
    ],
  },
  // 缩写 - 内容压缩 (s5-3)
  {
    subTemplateId: "s5-3",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要缩写的原文...", rows: 6, required: true },
      { key: "focus", label: "重点", type: "select", options: ["结论优先", "论据优先", "数据优先", "行动优先"] },
      { key: "tone", label: "语气", type: "select", options: ["中性客观", "更有力度", "更口语化"] },
      { key: "ratio", label: "长度", type: "select", options: ["压缩30%", "压缩50%", "压缩80%"] },
    ],
  },
  // 缩写 - 分层提纲 (s5-4)
  {
    subTemplateId: "s5-4",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要缩写的原文...", rows: 6, required: true },
      { key: "focus", label: "重点", type: "select", options: ["结论优先", "论据优先", "数据优先", "行动优先"] },
      { key: "tone", label: "语气", type: "select", options: ["中性客观", "更有力度", "更口语化"] },
    ],
  },
  // 缩写 - 一句话总结 (s5-5)
  {
    subTemplateId: "s5-5",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要缩写的原文...", rows: 6, required: true },
      { key: "focus", label: "重点", type: "select", options: ["结论优先", "论据优先", "数据优先", "行动优先"] },
      { key: "tone", label: "语气", type: "select", options: ["中性客观", "更有力度", "更口语化"] },
    ],
  },

  // 润色 - 通顺纠错 (s6-1)
  {
    subTemplateId: "s6-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要润色的原文...", rows: 5, required: true },
      { key: "intensity", label: "强度", type: "select", options: ["轻度", "标准", "深度"] },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
    ],
  },
  // 润色 - 精简表达 (s6-2)
  {
    subTemplateId: "s6-2",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要润色的原文...", rows: 5, required: true },
      { key: "intensity", label: "强度", type: "select", options: ["轻度", "标准", "深度"] },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
    ],
  },
  // 润色 - 文风统一 (s6-3)
  {
    subTemplateId: "s6-3",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要润色的原文...", rows: 5, required: true },
      { key: "intensity", label: "强度", type: "select", options: ["轻度", "标准", "深度"] },
      { key: "baseline", label: "基准", type: "select", options: ["开头为准", "当前段为准", "全文混合"] },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
    ],
  },
  // 润色 - 专业度提升 (s6-4)
  {
    subTemplateId: "s6-4",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要润色的原文...", rows: 5, required: true },
      { key: "intensity", label: "强度", type: "select", options: ["轻度", "标准", "深度"] },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
    ],
  },
  // 润色 - 感染力提升 (s6-5)
  {
    subTemplateId: "s6-5",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要润色的原文...", rows: 5, required: true },
      { key: "intensity", label: "强度", type: "select", options: ["轻度", "标准", "深度"] },
      { key: "emotion", label: "情绪", type: "select", options: ["克制", "适中", "饱满", "强烈"] },
      { key: "style", label: "风格", type: "select", options: ["简洁", "严肃", "文艺", "口语", "幽默"] },
    ],
  },

  // 划重点 - 关键结论 (s7-1)
  {
    subTemplateId: "s7-1",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要提取重点的原文...", rows: 6, required: true },
      { key: "target", label: "对象", type: "select", options: ["自用", "同事", "老板", "客户"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "1500字"] },
    ],
  },
  // 划重点 - 安排计划 (s7-2)
  {
    subTemplateId: "s7-2",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要提取重点的原文...", rows: 6, required: true },
      { key: "target", label: "对象", type: "select", options: ["自用", "同事", "老板", "客户"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "1500字"] },
    ],
  },
  // 划重点 - 逻辑框架 (s7-3)
  {
    subTemplateId: "s7-3",
    fields: [
      { key: "original", label: "原文", type: "textarea", placeholder: "粘贴需要提取重点的原文...", rows: 6, required: true },
      { key: "target", label: "对象", type: "select", options: ["自用", "同事", "老板", "客户"] },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "1500字"] },
    ],
  },

  // 检索成文 - 深度调研 (s27-1)
  {
    subTemplateId: "s27-1",
    fields: [
      { key: "topic", label: "调研主题", type: "textarea", placeholder: "描述需要调研的主题...", rows: 3, required: true },
      { key: "style", label: "风格", type: "select", options: ["正式严谨", "商务专业", "科普易懂", "结论先行"] },
      { key: "source", label: "来源偏好", type: "select", options: ["官方机构", "权威媒体", "行业研报", "学术论文", "综合"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 检索成文 - 多源综述 (s27-2)
  {
    subTemplateId: "s27-2",
    fields: [
      { key: "topic", label: "综述主题", type: "textarea", placeholder: "描述需要综述的主题...", rows: 3, required: true },
      { key: "style", label: "风格", type: "select", options: ["正式严谨", "商务专业", "科普易懂", "结论先行"] },
      { key: "source", label: "来源偏好", type: "select", options: ["官方机构", "权威媒体", "行业研报", "学术论文", "综合"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 检索成文 - 数据盘点 (s27-3)
  {
    subTemplateId: "s27-3",
    fields: [
      { key: "topic", label: "盘点主题", type: "textarea", placeholder: "描述需要盘点的主题...", rows: 3, required: true },
      { key: "style", label: "风格", type: "select", options: ["正式严谨", "商务专业", "科普易懂", "结论先行"] },
      { key: "source", label: "来源偏好", type: "select", options: ["官方机构", "权威媒体", "行业研报", "学术论文", "综合"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
    ],
  },
  // 检索成文 - 方案设计 (s27-4)
  {
    subTemplateId: "s27-4",
    fields: [
      { key: "topic", label: "方案主题", type: "textarea", placeholder: "描述需要设计的方案...", rows: 3, required: true },
      { key: "style", label: "风格", type: "select", options: ["正式严谨", "商务专业", "科普易懂", "结论先行"] },
      { key: "source", label: "来源偏好", type: "select", options: ["官方机构", "权威媒体", "行业研报", "学术论文", "综合"], required: true },
      { key: "wordCount", label: "字数", type: "select", options: ["100字", "300字", "500字", "1000字", "5000字", "10000字"] },
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
