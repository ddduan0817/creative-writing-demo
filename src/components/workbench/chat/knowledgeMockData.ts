// ─── Knowledge (知识专栏) Agent Mock Data ─────────────────────
// 三大Agent：深度拆书 · 内容解读 · 知识博客
// 流程：选择Agent → 引导输入 → 分析卡片 → 参数选择 → 最终产物

// ═══════════════════════════════════════════════════════════════
// 类型定义
// ═══════════════════════════════════════════════════════════════

export type KnowledgeAgentType = "book_analysis" | "content_interpret" | "knowledge_podcast";

/** 书籍分析卡片 */
export interface BookAnalysis {
  bookInfo: { label: string; value: string }[];
  chapterStructure: { chapter: string; pages: string }[];
  contentStats: { label: string; value: string }[];
}

/** 内容分析卡片 */
export interface ContentAnalysis {
  contentInfo: { label: string; value: string }[];
  keywords: string[];
  topicBreakdown: { topic: string; weight: string }[];
}

/** 素材概览卡片 */
export interface SourceOverview {
  sourceInfo: { label: string; value: string }[];
  keyPoints: string[];
  suggestedAngles: { angle: string; desc: string }[];
}

/** 学习报告（深度拆书产物） */
export interface LearningReport {
  title: string;
  bookName: string;
  mode: string;
  knowledgePoints: {
    id: number;
    title: string;
    definition: string;
    originalCase: string;
    crossIndustryCase: string;
    lifeCase: string;
  }[];
  industryMigration: {
    industry: string;
    application: string;
  }[];
  sop: {
    step: number;
    action: string;
    detail: string;
  }[];
  feymanQuiz: {
    question: string;
    hint: string;
    criteria: string;
  }[];
}

/** 精华笔记（内容解读产物） */
export interface InsightNotes {
  title: string;
  contentName: string;
  oneSentence: string;
  coreInsights: {
    id: number;
    point: string;
    detail: string;
    timestamp?: string;
  }[];
  goldenQuotes: {
    quote: string;
    timestamp?: string;
  }[];
  timeline: {
    time: string;
    type: string;
    title: string;
    desc: string;
  }[];
  threeMinRead: string;
}

/** 播客脚本（知识播客产物） */
export interface PodcastScript {
  title: string;
  bookName: string;
  style: string; // e.g. "双人对谈" | "单人叙述"
  duration: string; // e.g. "约20分钟"
  segments: {
    id: number;
    tag: string; // "开场" | "核心理论" | "案例共鸣" | "实用工具" | "总结"
    dialogues: {
      speaker: string; // "说话人1" | "说话人2"
      text: string;
    }[];
  }[];
  showNotes: {
    keyPoints: string[];
    tools: string[];
    quote: string;
  };
}

// ═══════════════════════════════════════════════════════════════
// 深度拆书 Agent Mock Data
// ═══════════════════════════════════════════════════════════════

/** 书籍分析卡片：《原则》Ray Dalio */
export const mockBookAnalysis: BookAnalysis = {
  bookInfo: [
    { label: "书名", value: "《原则：生活和工作》" },
    { label: "作者", value: "瑞·达利欧 (Ray Dalio)" },
    { label: "页数", value: "576页" },
    { label: "出版时间", value: "2017年" },
    { label: "语言", value: "中文译本" },
    { label: "核心主题", value: "决策框架 · 极度透明 · 系统化思维" },
  ],
  chapterStructure: [
    { chapter: "第一部分：我的历程", pages: "1-120页" },
    { chapter: "第二部分：生活原则", pages: "121-300页" },
    { chapter: "第三部分：工作原则", pages: "301-550页" },
    { chapter: "附录：工具与流程", pages: "551-576页" },
  ],
  contentStats: [
    { label: "核心概念", value: "约210个原则条目" },
    { label: "案例故事", value: "47个真实商业案例" },
    { label: "可视化图表", value: "23张" },
    { label: "适合拆解评估", value: "⭐⭐⭐⭐⭐ 极佳（结构清晰、原则可独立理解）" },
  ],
};

/** 书籍分析 → 左侧编辑器设定卡片格式 */
export const mockBookSettingsCard: Record<string, { label: string; value: string }[]> = {
  "书籍信息": [
    { label: "书名", value: "《原则：生活和工作》" },
    { label: "作者", value: "瑞·达利欧 (Ray Dalio)" },
    { label: "页数", value: "576页" },
    { label: "章节结构", value: "3大部分 · 约210个原则条目" },
  ],
  "内容识别": [
    { label: "核心概念", value: "约210个原则条目" },
    { label: "案例故事", value: "47个真实商业案例" },
    { label: "可视化图表", value: "23张" },
    { label: "拆解评估", value: "⭐⭐⭐⭐⭐ 极佳" },
  ],
};

/** 学习报告：深度模式 · 《原则》 */
export const mockLearningReport: LearningReport = {
  title: "《原则》深度拆书报告",
  bookName: "《原则：生活和工作》",
  mode: "深度模式",
  knowledgePoints: [
    {
      id: 1,
      title: "极度透明（Radical Transparency）",
      definition: "在组织内部消除信息不对称，让每个人都能接触到真实的数据和反馈，即使这些信息令人不舒服。透明不是目的，而是建立信任和做出更好决策的手段。",
      originalCase: "桥水基金内部会议全程录音，任何员工都可以调取任何会议的录音。新员工入职第一天就被告知：「这里没有背后说人的文化，所有反馈都当面给。」",
      crossIndustryCase: "Netflix的「自由与责任」文化：所有战略文档对全员开放，包括财务数据。员工可以自主决定休假时间，但所有决策过程透明可追溯。",
      lifeCase: "家庭财务透明化：夫妻共享一个记账App，所有收支实时可见。不是为了互相监督，而是为了在大额支出前有共同的决策基础。",
    },
    {
      id: 2,
      title: "痛苦 + 反思 = 进步",
      definition: "每一次失败和痛苦都是学习机会。关键不在于避免犯错，而在于建立系统化的反思流程，将痛苦转化为可复用的原则。达利欧将此称为「进化循环」。",
      originalCase: "1982年达利欧预测经济崩溃并公开下注，结果大错特错，公司几乎破产，只剩自己一个员工。这次惨痛失败让他建立了「压力测试」决策系统。",
      crossIndustryCase: "丰田的「安灯绳」制度：任何一线工人发现问题都可以拉绳停止整条生产线。每次停线都是一次「痛苦→反思→改进」的循环。",
      lifeCase: "跑步训练中的「痛苦日志」：记录每次跑崩的配速、天气、饮食、睡眠，三个月后发现规律——不是体能不够，是前一天睡眠不足6小时必然崩盘。",
    },
    {
      id: 3,
      title: "可信度加权决策（Believability-Weighted Decision Making）",
      definition: "不是所有人的意见权重相同。在特定领域有更多经验和成功记录的人，其意见应该被赋予更高权重。这不是独裁，而是精英制的民主。",
      originalCase: "桥水使用「棒球卡」系统：每个员工都有一张数字档案，记录其在不同领域的判断准确率。开会讨论时，系统自动计算每个人的意见权重。",
      crossIndustryCase: "谷歌的「20%时间」项目评审：项目是否立项不是投票决定，而是由该领域Top 5的工程师评估，他们的判断占80%权重。",
      lifeCase: "家庭装修决策：关于水电布局听专业水电工的（他们见过1000套房子），关于审美风格听设计师的，关于预算听自己的。不同问题找不同「可信度高」的人。",
    },
    {
      id: 4,
      title: "五步流程法",
      definition: "实现目标的系统方法：①设定目标 → ②发现问题 → ③诊断根因 → ④设计方案 → ⑤执行到位。大多数人失败不是因为能力不够，而是在某一步卡住了却不自知。",
      originalCase: "达利欧发现桥水95%的决策失误集中在第③步——人们急于找解决方案，却没有诊断清楚问题的根本原因。",
      crossIndustryCase: "亚马逊的「逆向工作法」：先写新闻稿（目标），再写FAQ（发现问题），然后6页纸备忘录（诊断+方案），最后才开始编码（执行）。",
      lifeCase: "减肥卡在第②步的人最多：设了目标（瘦20斤），也在执行（每天跑步），但从没发现真正的问题不是运动量而是深夜的外卖习惯。",
    },
    {
      id: 5,
      title: "系统化原则（Systemized Principles）",
      definition: "将反复出现的决策场景总结为明确的原则，并用算法或流程图固化。好的原则应该像代码一样可执行、可测试、可迭代。",
      originalCase: "桥水将200多条投资原则编写成算法，让计算机在80%的常规决策中代替人类。人类只需要处理剩下20%的例外情况。",
      crossIndustryCase: "Shopify的「决策树文档」：客服团队将所有常见问题归纳为决策树，新人第一天就能处理90%的客户请求，不需要判断力，只需要遵循流程。",
      lifeCase: "「周末要不要出门」决策原则：如果天气>25℃ + 没有ddl + 精力>6/10 → 出门；否则在家。不用每次都纠结，原则替你做决定。",
    },
  ],
  industryMigration: [
    { industry: "互联网/科技", application: "将「极度透明」应用于代码评审文化——所有PR公开可见，评审意见署名，形成可追溯的技术决策记录" },
    { industry: "教育行业", application: "「痛苦+反思=进步」转化为错题本2.0——不只记录错题，还诊断错误类型（粗心/概念不清/方法错误），对症下药" },
    { industry: "医疗健康", application: "「可信度加权」应用于多学科会诊——不同科室医生对同一病例的意见，根据其专科经验自动加权" },
    { industry: "金融投资", application: "「系统化原则」转化为量化交易策略——将主观判断编码为可回测的规则" },
    { industry: "创业公司", application: "「五步流程法」作为周会复盘框架——每周检查团队卡在哪一步，针对性解决" },
    { industry: "制造业", application: "「极度透明」应用于供应链管理——所有环节实时可见，问题溯源到分钟级" },
    { industry: "咨询行业", application: "「可信度加权」用于方案评审——根据顾问在该行业的项目经验分配发言权重" },
    { industry: "个人成长", application: "「痛苦日志」习惯——每天记录一个让自己不舒服的事件，每周复盘，每月提炼原则" },
  ],
  sop: [
    { step: 1, action: "建立痛苦日志", detail: "每天记录1-3个让自己感到不舒服、犯错或失败的事件。不需要分析，只需要记录事实和当时的情绪。" },
    { step: 2, action: "每周根因诊断", detail: "每周五花30分钟回顾本周痛苦日志，用「5个为什么」找到每个事件的根本原因。区分「能力问题」和「认知盲区」。" },
    { step: 3, action: "提炼个人原则", detail: "每月将反复出现的模式总结为一条原则（if...then...格式）。好的原则足够具体，任何人看到都能执行。" },
    { step: 4, action: "构建可信度网络", detail: "识别生活中在不同领域值得信赖的人，遇到相关决策时主动寻求他们的意见，并给予更高权重。" },
    { step: 5, action: "定期压力测试", detail: "每季度回顾所有个人原则，问：「最近有没有违背这条原则？违背后结果如何？原则需要修改吗？」" },
  ],
  feymanQuiz: [
    {
      question: "请用自己的话解释「极度透明」和「毫无隐私」的区别。为什么达利欧认为前者能建立信任，而后者会破坏信任？",
      hint: "思考「目的性」和「边界」这两个维度",
      criteria: "能说出透明是为了更好的决策（有目的），而非窥探个人生活（无边界）；能举出一个具体的应用场景",
    },
    {
      question: "如果你是一家50人创业公司的CEO，会如何实施「可信度加权决策」？列出前三步。",
      hint: "考虑：如何衡量可信度？如何避免变成「谁资历老谁说了算」？",
      criteria: "提到可信度需要量化（不是拍脑袋）、需要分领域（不是全能权威）、需要动态更新（判断错了要降权）",
    },
    {
      question: "用五步流程法分析一个你最近遇到的问题。你觉得自己卡在了第几步？为什么？",
      hint: "大部分人卡在第②步（发现问题）或第③步（诊断根因），而非第⑤步（执行）",
      criteria: "能准确识别自己卡在哪一步，并且给出的根因分析不是表面原因",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// 内容解读 Agent Mock Data
// ═══════════════════════════════════════════════════════════════

/** 内容分析卡片：TED演讲 - Simon Sinek */
export const mockContentAnalysis: ContentAnalysis = {
  contentInfo: [
    { label: "标题", value: "How Great Leaders Inspire Action — Simon Sinek" },
    { label: "来源", value: "TED Talk" },
    { label: "类型", value: "演讲视频" },
    { label: "时长", value: "18分04秒" },
    { label: "语言", value: "英文（中文字幕）" },
    { label: "观看量", value: "6200万+" },
    { label: "核心主题", value: "黄金圆环理论 · Why思维 · 领导力" },
  ],
  keywords: ["黄金圆环", "Start with Why", "领导力", "苹果", "马丁·路德·金", "创新扩散", "信任"],
  topicBreakdown: [
    { topic: "黄金圆环理论阐述", weight: "40%" },
    { topic: "苹果公司案例分析", weight: "25%" },
    { topic: "马丁·路德·金案例", weight: "15%" },
    { topic: "莱特兄弟 vs 兰利对比", weight: "10%" },
    { topic: "创新扩散曲线应用", weight: "10%" },
  ],
};

/** 内容分析 → 左侧编辑器设定卡片格式 */
export const mockContentSettingsCard: Record<string, { label: string; value: string }[]> = {
  "内容信息": [
    { label: "标题", value: "How Great Leaders Inspire Action" },
    { label: "演讲者", value: "Simon Sinek" },
    { label: "来源", value: "TED Talk · 18分04秒" },
    { label: "核心主题", value: "黄金圆环理论 · Why思维" },
  ],
  "分析识别": [
    { label: "核心观点", value: "预计5-6个" },
    { label: "案例故事", value: "3个（苹果/马丁·路德·金/莱特兄弟）" },
    { label: "金句数量", value: "预计8-10条" },
    { label: "内容密度", value: "⭐⭐⭐⭐⭐ 极高" },
  ],
};

/** 精华笔记：TED - Start with Why */
export const mockInsightNotes: InsightNotes = {
  title: "「Start with Why」精华笔记",
  contentName: "How Great Leaders Inspire Action — Simon Sinek",
  oneSentence: "伟大的领导者和组织之所以能激发行动，不是因为他们告诉别人「做什么」，而是因为他们先回答了「为什么做」——人们买的不是你的产品，而是你的信念。",
  coreInsights: [
    {
      id: 1,
      point: "黄金圆环：Why → How → What",
      detail: "所有组织都知道自己做什么（What），大部分知道怎么做（How），但极少数知道为什么做（Why）。普通公司从外向内沟通（What→Why），而苹果等伟大公司从内向外（Why→What）。",
      timestamp: "01:22",
    },
    {
      id: 2,
      point: "人们买的是你的「为什么」，不是「做什么」",
      detail: "苹果的竞争力不在于产品参数，而在于「挑战现状、用不同方式思考」的信念。这就是为什么苹果卖电脑、手机、音乐播放器都能成功——因为人们追随的是信念。",
      timestamp: "04:15",
    },
    {
      id: 3,
      point: "这不是心理学推测，而是生物学事实",
      detail: "人脑的新皮层（理性脑）对应What层——处理语言和数据；边缘系统（情感脑）对应Why层——驱动决策和行为。所以当你从Why开始沟通，直接触达决策中枢。",
      timestamp: "06:50",
    },
    {
      id: 4,
      point: "莱特兄弟 vs 兰利：资源不等于成功",
      detail: "塞缪尔·兰利有资金、人脉、市场条件，却输给了没钱没学历的莱特兄弟。区别在于：兰利想出名（What），莱特兄弟相信飞行能改变世界（Why）。",
      timestamp: "09:30",
    },
    {
      id: 5,
      point: "创新扩散定律：先打动信徒",
      detail: "市场采纳曲线中，前2.5%创新者和13.5%早期采用者买单是因为信念共鸣。当渗透率过16%临界点，大众才会跟进。不要试图说服所有人，先找到相信你为什么做的人。",
      timestamp: "12:45",
    },
    {
      id: 6,
      point: "马丁·路德·金：I have a dream, not a plan",
      detail: "25万人来到华盛顿广场不是为了马丁·路德·金——而是为了他们自己的信念。他只是说出了他们心中相信的东西。伟大的领导者不是说服别人跟随，而是吸引与你信念相同的人。",
      timestamp: "15:20",
    },
  ],
  goldenQuotes: [
    { quote: "People don't buy what you do, they buy why you do it.", timestamp: "04:32" },
    { quote: "The goal is not to do business with everybody who needs what you have. The goal is to do business with people who believe what you believe.", timestamp: "05:18" },
    { quote: "Martin Luther King gave the 'I have a dream' speech, not the 'I have a plan' speech.", timestamp: "15:45" },
    { quote: "If you hire people just because they can do a job, they'll work for your money. But if you hire people who believe what you believe, they'll work for you with blood and sweat and tears.", timestamp: "07:22" },
    { quote: "There are leaders and there are those who lead. Leaders hold a position of power, but those who lead inspire us.", timestamp: "16:50" },
    { quote: "What you do simply proves what you believe.", timestamp: "03:55" },
    { quote: "We follow those who lead not because we have to, but because we want to.", timestamp: "17:15" },
    { quote: "The Wright brothers had no funding, no connections, and barely a high school education. But they had a dream.", timestamp: "10:12" },
  ],
  timeline: [
    { time: "00:00-01:20", type: "引入", title: "三个问题", desc: "为什么有些人/组织能持续创新和激励？为什么苹果、马丁·路德·金、莱特兄弟如此不同？" },
    { time: "01:22-04:00", type: "核心概念", title: "黄金圆环模型", desc: "Why→How→What三层结构，从内到外vs从外到内的两种沟通方式" },
    { time: "04:00-06:30", type: "案例", title: "苹果的Why", desc: "如果苹果像其他公司一样沟通vs实际的苹果式沟通——效果天壤之别" },
    { time: "06:30-09:00", type: "科学依据", title: "大脑生物学", desc: "新皮层(What/理性) vs 边缘系统(Why/决策)——从生物学解释为什么Why有效" },
    { time: "09:00-12:00", type: "案例", title: "莱特兄弟vs兰利", desc: "同样追求飞行，一个为了梦想一个为了名利，结果截然不同" },
    { time: "12:00-15:00", type: "理论延伸", title: "创新扩散曲线", desc: "2.5%创新者→13.5%早期采用者→临界点→大众。TiVo为什么有好产品却失败" },
    { time: "15:00-17:30", type: "案例", title: "马丁·路德·金", desc: "I have a dream——25万人追随的不是他，而是自己的信念" },
    { time: "17:30-18:04", type: "总结", title: "Leaders vs Those Who Lead", desc: "领导者和引领者的区别：职位 vs 信念。从Why出发的人能激发追随" },
  ],
  threeMinRead: `一句话总结：伟大的领导者之所以能激发行动，是因为他们从「为什么」开始，而非从「做什么」开始。

核心模型——黄金圆环：
想象三个同心圆。最外圈是What（你做什么），中间是How（你怎么做），最内圈是Why（你为什么做）。

99%的公司从外向内沟通："我们做了一台很棒的电脑（What），它设计精美、简单好用（How），想买一台吗？"

苹果从内向外："我们相信挑战现状、用不同方式思考（Why），我们通过设计精美、简单好用的产品来实现这一信念（How），我们恰好做了电脑（What）。想买一台吗？"

感受到区别了吗？第二种方式让你想掏钱。

为什么有效？不是心理话术，而是大脑结构。你的理性脑处理语言和数据（对应What），但做决定的是情感脑（对应Why）。所以消费者经常说"感觉对了"——因为决策真的发生在"感觉"层面。

实战启示：
· 先问自己/团队：我们为什么做这件事？（不是为了赚钱，那是结果）
· 招人：找相信你为什么做的人，而非只是能干活的人
· 营销：先传递信念，再展示产品
· 创新：不需要说服所有人，先找到那16%的信徒`,
};

// ═══════════════════════════════════════════════════════════════
// 知识博客 Agent Mock Data
// ═══════════════════════════════════════════════════════════════

/** 素材概览卡片 */
export const mockSourceOverview: SourceOverview = {
  sourceInfo: [
    { label: "素材来源", value: "深度拆书报告 ·《原则》" },
    { label: "素材类型", value: "系统拆书报告" },
    { label: "知识点数量", value: "5个核心知识点" },
    { label: "案例数量", value: "15个（原书+跨行业+生活）" },
    { label: "素材字数", value: "约6000字" },
  ],
  keyPoints: [
    "极度透明（Radical Transparency）",
    "痛苦 + 反思 = 进步",
    "可信度加权决策",
    "五步流程法",
    "系统化原则",
  ],
  suggestedAngles: [
    { angle: "双人对谈", desc: "两位主播轮流分享读后感与生活案例，最自然" },
    { angle: "故事切入", desc: "以达利欧1982年破产故事开场，代入感强" },
    { angle: "问答互动", desc: "一人提问一人解读，适合知识型播客" },
    { angle: "单人深度", desc: "主播独白式精讲，适合碎片时间收听" },
  ],
};

/** 素材概览 → 左侧编辑器设定卡片格式 */
export const mockSourceSettingsCard: Record<string, { label: string; value: string }[]> = {
  "素材信息": [
    { label: "来源", value: "深度拆书报告 ·《原则》" },
    { label: "类型", value: "系统拆书报告" },
    { label: "知识点", value: "5个核心知识点" },
    { label: "素材字数", value: "约6000字" },
  ],
  "播客配置": [
    { label: "播客形式", value: "待选择" },
    { label: "目标时长", value: "待选择" },
    { label: "风格基调", value: "待选择" },
  ],
};

/** 播客脚本：双人对谈风格 · 《原则》 */
export const mockPodcastScript: PodcastScript = {
  title: "达利欧用40年总结的5条人生算法，第3条让我重新想了想身边的人",
  bookName: "《原则：生活和工作》",
  style: "双人对谈",
  duration: "约20分钟",
  segments: [
    {
      id: 1,
      tag: "开场",
      dialogues: [
        { speaker: "说话人1", text: "哈喽各位，今天咱们来聊一本我反复看了三遍的书——《原则》，瑞·达利欧写的，就是那个管着1500亿美元的桥水基金创始人。这本书我第一次看觉得很干，第二次看开始觉得有点意思，第三次看才真正被震到了。" },
        { speaker: "说话人2", text: "我也是！我第一次看就是冲着它的名气去的，以为是什么成功学，结果完全不是。它更像是一个人把自己怎么思考、怎么犯错、怎么从错误里总结出规律这件事，完整地拆给你看了。" },
        { speaker: "说话人1", text: "对，而且特别真实。他在书里直接说1982年他在国会听证会上预测经济要崩，结果大错特错，公司几乎破产，最后只剩他一个员工。这件事放在书最开头，我就觉得，这个人是认真的，不是来跟你讲成功故事的。" },
      ],
    },
    {
      id: 2,
      tag: "核心理论",
      dialogues: [
        { speaker: "说话人2", text: "书里最核心的，我觉得是一个公式：痛苦加反思等于进步。听起来很简单对吧，但他把它拆得特别细。大多数人犯了错，难受一下，过了就过了，然后过段时间犯同样的错。达利欧不一样，他会把这个错误记下来，分析根因，然后提炼成一条原则。" },
        { speaker: "说话人1", text: "这个我深有体会。我之前总是在同一个地方跌倒，比如每次开重要会议前都会紧张过度，发挥失常。但我从来没有认真去想这到底是为什么——是准备不够？还是太在乎别人怎么看我？达利欧说的那种系统化反思，我当时完全没有。" },
        { speaker: "说话人2", text: "还有一个我觉得最颠覆认知的，叫可信度加权决策。他说，不是所有人的意见都应该被平等对待。你要看这个人在这个具体领域有没有成功记录。桥水甚至给每个员工建了一张棒球卡，记录你在不同领域做判断的准确率。" },
        { speaker: "说话人1", text: "对，这一条刚看到的时候我有点不舒服，感觉好像在否定普通人的价值。但仔细一想，这不就是我们日常做决定时理应有的逻辑吗？比如我要换工作，我去问一个从没跳过槽的朋友，他给我的建议跟一个跳了三次槽的人给的，应该一样重要吗？" },
      ],
    },
    {
      id: 3,
      tag: "案例共鸣",
      dialogues: [
        { speaker: "说话人2", text: "还有五步流程法。他说实现任何目标都是这五步：设目标、发现问题、诊断根因、设计方案、执行。然后他特别指出，90%的失败不是因为执行不够努力，而是卡在了第二步和第三步——根本没发现真正的问题是什么。" },
        { speaker: "说话人1", text: "这个太准了！我之前想减肥，目标设了，每天也在跑步，就是没效果。后来才意识到，我根本没发现我的问题不是运动量，而是每天晚上十二点之后还在吃东西。我卡死在第二步了，还以为自己是第五步执行力不行。" },
        { speaker: "说话人2", text: "这个例子讲给我听的时候我也笑了，因为我发现自己在工作上也经常这样。一个项目推进不动，我以为是团队执行力不行，然后给大家开会激励，给大家加班。结果后来才发现，是需求本来就没说清楚，大家根本不知道做这件事的目的是什么。" },
      ],
    },
    {
      id: 4,
      tag: "实用工具",
      dialogues: [
        { speaker: "说话人1", text: "聊完这些理论，我想分享几个从这本书里拿出来可以马上用的东西。第一个是痛苦日志——今天开始，在手机备忘录里建一个叫「让我不爽的事」的文档，每天记一条，不用分析，只记事实和当时的感受。一个月后回看，规律就出来了。" },
        { speaker: "说话人2", text: "我现在真的在用！其实不用每天，我大概三四天记一次，但效果很明显。以前我会觉得自己就是容易焦虑，是个人问题。后来发现，我焦虑的时间点高度集中在一个人呆着太久的时候。这是规律，我可以解决它。" },
        { speaker: "说话人1", text: "第二个工具是给自己的决策找到「可信度高的人」。不是找比你聪明的人，是找在这个具体问题上经历比你丰富的人。下次遇到大决定，先想三秒：我问的这个人，有没有在这件事上真的踩过坑、爬出来过？" },
        { speaker: "说话人2", text: "第三个我会推荐的是写你的第一条原则。格式是if-then：如果XXX情况出现，我就做XXX。越具体越好。比如我写的一条是：如果有人给我提意见，我的第一反应是想反驳，那我就先闭嘴，等二十四小时再回应。这条原则帮了我好几次。" },
      ],
    },
    {
      id: 5,
      tag: "总结",
      dialogues: [
        { speaker: "说话人1", text: "好，今天聊了很多，来做个收尾。《原则》这本书最了不起的地方，我觉得不是它告诉你「达利欧的原则是什么」，而是它告诉你「怎么建立自己的原则系统」。" },
        { speaker: "说话人2", text: "对，它是一个方法论，不是一份答案。书里那些原则是达利欧的，但如果你真的读进去了，你会开始问自己：我的原则是什么？我在哪里反复犯同样的错？我的决策是基于谁的意见？" },
        { speaker: "说话人1", text: "今天的三个行动建议：第一，建一个「痛苦日志」。第二，找一个在你当下最重要的决策领域，可信度真正高的人。第三，写下你的第一条if-then原则。好了，今天就到这里，我们下期见！" },
        { speaker: "说话人2", text: "下期见！如果这一集对你有用，记得分享给那个最近遇到难题、反复在同一个地方卡住的朋友，可能他就差这一套系统。" },
      ],
    },
  ],
  showNotes: {
    keyPoints: [
      "痛苦 + 反思 = 进步（进化循环）",
      "可信度加权决策——不是民主，是精英制的民主",
      "五步流程法——90%的人卡在第2、3步",
      "系统化原则——把决策写成if-then规则",
    ],
    tools: [
      "痛苦日志：手机备忘录记录让自己不爽的事，每月复盘规律",
      "可信度筛选：重大决策前确认咨询对象在该领域的成功记录",
      "if-then原则：把反复出现的决策写成条件语句",
    ],
    quote: "成功的秘诀不是聪明，而是每一个错误只犯一次。——瑞·达利欧",
  },
};

/** 播客脚本（故事切入风格，另一种选择） */
export const mockPodcastScriptStory: PodcastScript = {
  title: "1982年，他因一个预测几乎毁掉一切——后来他靠什么管了1500亿？",
  bookName: "《原则：生活和工作》",
  style: "故事切入",
  duration: "约15分钟",
  segments: [
    {
      id: 1,
      tag: "开场",
      dialogues: [
        { speaker: "说话人1", text: "1982年，瑞·达利欧在美国国会听证会上，信心满满地预测美国经济即将崩溃。他公开下了重注。结果呢——他错了，公司几乎破产，最后只剩他一个人。" },
        { speaker: "说话人1", text: "但就是这次惨败，让他用接下来四十年的时间，建立了一套让桥水基金管理全球1500亿美元资产的决策系统。他把这套系统写成了《原则》。今天我来拆给你听。" },
      ],
    },
    {
      id: 2,
      tag: "核心理论",
      dialogues: [
        { speaker: "说话人1", text: "这本书的核心是一个反直觉的观点：痛苦不是要被避免的，而是要被利用的。达利欧的公式是——痛苦加反思，等于进步。每一次失败，每一次不舒服，都是一次原材料，你可以把它提炼成可以复用的原则。" },
        { speaker: "说话人1", text: "他说，绝大多数人处理痛苦的方式是：犯错、难受、然后忘掉。而真正的进化者的路径是：犯错、难受、记录、分析根因、提炼原则、下次遇到同类情况直接调用。" },
      ],
    },
    {
      id: 3,
      tag: "实用工具",
      dialogues: [
        { speaker: "说话人1", text: "马上能用的三个工具。第一，建一个痛苦日志。今天让你不舒服的事是什么？记下来，不用分析，只记事实。一个月后你会发现自己的行为规律。" },
        { speaker: "说话人1", text: "第二，在你最重要的一个决策上，找一个「可信度真正高的人」，不是最聪明的人，是在这件事上真的踩过坑、爬出来过的人。" },
        { speaker: "说话人1", text: "第三，写下你的第一条原则。格式是if-then：如果XXX发生，我就做XXX。越具体越可执行。" },
      ],
    },
    {
      id: 4,
      tag: "总结",
      dialogues: [
        { speaker: "说话人1", text: "这本书最了不起的地方，是它不是在给你达利欧的答案，而是在教你建立自己的原则系统。你读完它，能开始问自己：我的原则是什么？我在哪里反复犯同样的错？" },
        { speaker: "说话人1", text: "如果这期节目对你有用，分享给那个最近在同一个地方反复卡住的朋友，可能他就差这套系统。我们下期见。" },
      ],
    },
  ],
  showNotes: {
    keyPoints: [
      "痛苦 + 反思 = 进步",
      "可信度加权决策",
      "五步流程法",
    ],
    tools: [
      "痛苦日志",
      "可信度筛选法",
      "if-then原则写作",
    ],
    quote: "成功的秘诀不是聪明，而是每一个错误只犯一次。——瑞·达利欧",
  },
};
