// ─── Screenplay Agent Mock Data ─────────────────────────────
// 剧本脚本场景专用 Agent 对话 mock 数据
// 流程：设定（含剧集规格）→ 角色 → 集纲 → 正文

export interface InspirationCard {
  text: string;
  keywords: string[];
}

export interface InspirationRound {
  prompt: string;
  cards: InspirationCard[];
  adjustPrompt: string;
}

// ─── 设定轮次（3轮灵感卡片） ──────────────────────────────────

export const screenplayInspirationRounds: InspirationRound[] = [
  {
    prompt: "描述一下你想创作的剧本方向，我帮你快速生成一版设定。\n\n你也可以先看看下面几个方向，哪个更打动你？",
    cards: [
      {
        text: "都市悬疑：刑侦记者意外发现未婚夫出现在嫌疑人名单上。她必须在揭露真相和保护爱情之间做出抉择，每一集都有致命反转。",
        keywords: ["都市", "悬疑", "刑侦", "反转", "甜虐"],
      },
      {
        text: "古代权谋：被退婚的将军之女在流放途中救下受伤的皇子，两人联手破解宫廷阴谋。她用兵法，他用心计，一路逆袭朝堂。",
        keywords: ["古代", "权谋", "逆袭", "双强", "宫斗"],
      },
      {
        text: "现代甜宠：顶流偶像为躲狗仔藏进路边面馆，被毒舌女老板嫌弃「长得好看有什么用，面都不会煮」。被迫留下打工还债的30天里，两人从互相看不顺眼到心动。",
        keywords: ["现代", "甜宠", "娱乐圈", "欢喜冤家", "沙雕"],
      },
    ],
    adjustPrompt: "选得好！有没有想微调的？比如「想要更虐一点」「加入职场元素」之类的，随便说说就行～",
  },
  {
    prompt: "好方向！在这个基础上，你更偏好哪种叙事节奏？",
    cards: [
      {
        text: "强钩子快节奏：每集结尾一个爆点，30秒内必须抓住观众。情节密度极高，没有一句废话，看完一集立刻想看下一集。",
        keywords: ["快节奏", "强钩子", "爆点", "高密度"],
      },
      {
        text: "甜虐交替型：三集甜一集虐，用高甜片段养观众，再用反转虐心拉扯。情感起伏明显，让人又笑又哭。",
        keywords: ["甜虐", "养观众", "情感拉扯", "长线"],
      },
      {
        text: "悬疑解谜型：每集埋一条线索，主线暗线交织推进。观众一边追剧一边推理，评论区变成「破案现场」。",
        keywords: ["悬疑", "解谜", "暗线", "推理"],
      },
    ],
    adjustPrompt: "想微调什么？比如「每集时长要短一点」「再加点搞笑」，没有就跳过继续～",
  },
  {
    prompt: "最后确认一下核心卖点和受众定位：",
    cards: [
      {
        text: "极致反转：每5集一个小反转，每20集一个大反转。「你以为的好人其实是幕后黑手」「你以为的结局只是开始」。适合男女通吃的悬疑向。",
        keywords: ["反转", "烧脑", "男女通吃"],
      },
      {
        text: "甜宠爽文：女主不恋爱脑、不白莲花，该打脸打脸该逆袭逆袭。男主只有在女主面前才会失去冷静。女频核心向。",
        keywords: ["甜宠", "爽文", "打脸", "女频"],
      },
      {
        text: "虐心催泪：BE美学 + 意难平。前70%甜到齁，后30%虐到哭。结局开放式，留给观众想象空间。",
        keywords: ["虐心", "催泪", "BE", "意难平"],
      },
    ],
    adjustPrompt: "最后还想补充什么？比如「结局要HE」「核心卖点再突出一点」，没有的话我来整理设定了～",
  },
];

// ─── 设定卡片（含剧集规格，按类型动态差异） ──────────────────

// 短剧 × 剧本
export const screenplayMockSettings_short_script: Record<string, { label: string; value: string }[]> = {
  "创作设定": [
    { label: "核心设定", value: "刑侦记者发现未婚夫是嫌疑人，真相与爱情的极致拉扯" },
    { label: "故事线", value: "林晓调查案件时发现未婚夫陈深的名字出现在嫌疑人名单上，她在揭露真相与保护爱情之间艰难抉择" },
    { label: "核心冲突", value: "越爱越不敢查 · 查到真相就意味着失去一切" },
    { label: "核心卖点", value: "每集结尾强反转 · 甜虐双线并行" },
  ],
  "内容要素": [
    { label: "受众", value: "女频" },
    { label: "题材", value: "悬疑 · 刑侦 · 言情" },
    { label: "时空", value: "现代都市" },
    { label: "风格调性", value: "甜虐 · 反转 · 烧脑" },
    { label: "人物关系", value: "恋人 · 宿敌" },
    { label: "结局", value: "HE" },
  ],
  "剧集规格": [
    { label: "场景类型", value: "短剧" },
    { label: "输出格式", value: "剧本（场景头 + 台词 + 动作）" },
    { label: "集数", value: "80集" },
    { label: "单集时长", value: "90秒" },
  ],
};

// 短剧 × 脚本
export const screenplayMockSettings_short_storyboard: Record<string, { label: string; value: string }[]> = {
  "创作设定": [
    { label: "核心设定", value: "刑侦记者发现未婚夫是嫌疑人，真相与爱情的极致拉扯" },
    { label: "故事线", value: "林晓调查案件时发现未婚夫陈深的名字出现在嫌疑人名单上，她在揭露真相与保护爱情之间艰难抉择" },
    { label: "核心冲突", value: "越爱越不敢查 · 查到真相就意味着失去一切" },
    { label: "核心卖点", value: "每集结尾强反转 · 甜虐双线并行" },
  ],
  "内容要素": [
    { label: "受众", value: "女频" },
    { label: "题材", value: "悬疑 · 刑侦 · 言情" },
    { label: "时空", value: "现代都市" },
    { label: "风格调性", value: "甜虐 · 反转 · 烧脑" },
    { label: "结局", value: "HE" },
  ],
  "剧集规格": [
    { label: "场景类型", value: "短剧" },
    { label: "输出格式", value: "脚本（分镜 + 台词 + 时长）" },
    { label: "集数", value: "80集" },
    { label: "单集时长", value: "90秒" },
    { label: "单集镜头数", value: "8-12镜/集" },
  ],
};

// 漫剧 × 剧本
export const screenplayMockSettings_comic_script: Record<string, { label: string; value: string }[]> = {
  "创作设定": [
    { label: "核心设定", value: "刑侦记者发现未婚夫是嫌疑人，真相与爱情的极致拉扯" },
    { label: "故事线", value: "林晓调查案件时发现未婚夫陈深的名字出现在嫌疑人名单上，她在揭露真相与保护爱情之间艰难抉择" },
    { label: "核心冲突", value: "越爱越不敢查 · 查到真相就意味着失去一切" },
    { label: "核心卖点", value: "每集结尾强反转 · 甜虐双线并行" },
  ],
  "内容要素": [
    { label: "受众", value: "女频" },
    { label: "题材", value: "悬疑 · 刑侦 · 言情" },
    { label: "时空", value: "现代都市" },
    { label: "风格调性", value: "甜虐 · 反转 · 烧脑" },
    { label: "结局", value: "HE" },
  ],
  "剧集规格": [
    { label: "场景类型", value: "漫剧" },
    { label: "输出格式", value: "剧本（场景头 + 台词 + 动作）" },
    { label: "集数", value: "80集" },
    { label: "单集时长", value: "90秒" },
    { label: "画面方向", value: "竖屏" },
    { label: "画风", value: "写实 · 偏写实日漫风" },
  ],
};

// 漫剧 × 脚本
export const screenplayMockSettings_comic_storyboard: Record<string, { label: string; value: string }[]> = {
  "创作设定": [
    { label: "核心设定", value: "刑侦记者发现未婚夫是嫌疑人，真相与爱情的极致拉扯" },
    { label: "故事线", value: "林晓调查案件时发现未婚夫陈深的名字出现在嫌疑人名单上，她在揭露真相与保护爱情之间艰难抉择" },
    { label: "核心冲突", value: "越爱越不敢查 · 查到真相就意味着失去一切" },
    { label: "核心卖点", value: "每集结尾强反转 · 甜虐双线并行" },
  ],
  "内容要素": [
    { label: "受众", value: "女频" },
    { label: "题材", value: "悬疑 · 刑侦 · 言情" },
    { label: "时空", value: "现代都市" },
    { label: "风格调性", value: "甜虐 · 反转 · 烧脑" },
    { label: "结局", value: "HE" },
  ],
  "剧集规格": [
    { label: "场景类型", value: "漫剧" },
    { label: "输出格式", value: "脚本（分格 + 台词 + 情绪）" },
    { label: "集数", value: "80集" },
    { label: "单集时长", value: "90秒" },
    { label: "画面方向", value: "竖屏" },
    { label: "单集镜头数", value: "8-12格/集" },
    { label: "画风", value: "写实 · 偏写实日漫风" },
  ],
};

// 默认设定（未区分类型时使用）
export const screenplayMockSettings = screenplayMockSettings_short_script;

// ─── Alt 设定卡片（换一换时使用，故事不同于默认版） ──────────

// 短剧 × 剧本 Alt
export const screenplayMockSettings_short_script_alt: Record<string, { label: string; value: string }[]> = {
  "创作设定": [
    { label: "核心设定", value: "豪门赘婿被迫离婚后逆袭归来，前妻才发现他是千亿集团真正的掌舵人" },
    { label: "故事线", value: "陈墨隐忍三年终于离婚，以商业奇才的真实身份席卷商界，前妻苏雨晴在一次次交锋中看清了当年的误解" },
    { label: "核心冲突", value: "离婚后的重逢 · 身份反转 · 复仇还是复合" },
    { label: "核心卖点", value: "爽文逆袭 · 反转打脸 · 前期虐后期甜" },
  ],
  "内容要素": [
    { label: "受众", value: "男频 · 女频通吃" },
    { label: "题材", value: "商战 · 豪门 · 言情" },
    { label: "时空", value: "现代都市" },
    { label: "风格调性", value: "爽文 · 反转 · 打脸" },
    { label: "人物关系", value: "前妻前夫 · 商业对手" },
    { label: "结局", value: "HE" },
  ],
  "剧集规格": [
    { label: "场景类型", value: "短剧" },
    { label: "输出格式", value: "剧本（场景头 + 台词 + 动作）" },
    { label: "集数", value: "80集" },
    { label: "单集时长", value: "90秒" },
  ],
};

// 短剧 × 脚本 Alt
export const screenplayMockSettings_short_storyboard_alt: Record<string, { label: string; value: string }[]> = {
  "创作设定": [
    { label: "核心设定", value: "豪门赘婿被迫离婚后逆袭归来，前妻才发现他是千亿集团真正的掌舵人" },
    { label: "故事线", value: "陈墨隐忍三年终于离婚，以商业奇才的真实身份席卷商界，前妻苏雨晴在一次次交锋中看清了当年的误解" },
    { label: "核心冲突", value: "离婚后的重逢 · 身份反转 · 复仇还是复合" },
    { label: "核心卖点", value: "爽文逆袭 · 反转打脸 · 前期虐后期甜" },
  ],
  "内容要素": [
    { label: "受众", value: "男频 · 女频通吃" },
    { label: "题材", value: "商战 · 豪门 · 言情" },
    { label: "时空", value: "现代都市" },
    { label: "风格调性", value: "爽文 · 反转 · 打脸" },
    { label: "结局", value: "HE" },
  ],
  "剧集规格": [
    { label: "场景类型", value: "短剧" },
    { label: "输出格式", value: "脚本（分镜 + 台词 + 时长）" },
    { label: "集数", value: "80集" },
    { label: "单集时长", value: "90秒" },
    { label: "单集镜头数", value: "8-12镜/集" },
  ],
};

// 漫剧 × 剧本 Alt
export const screenplayMockSettings_comic_script_alt: Record<string, { label: string; value: string }[]> = {
  "创作设定": [
    { label: "核心设定", value: "豪门赘婿被迫离婚后逆袭归来，前妻才发现他是千亿集团真正的掌舵人" },
    { label: "故事线", value: "陈墨隐忍三年终于离婚，以商业奇才的真实身份席卷商界，前妻苏雨晴在一次次交锋中看清了当年的误解" },
    { label: "核心冲突", value: "离婚后的重逢 · 身份反转 · 复仇还是复合" },
    { label: "核心卖点", value: "爽文逆袭 · 反转打脸 · 前期虐后期甜" },
  ],
  "内容要素": [
    { label: "受众", value: "男频 · 女频通吃" },
    { label: "题材", value: "商战 · 豪门 · 言情" },
    { label: "时空", value: "现代都市" },
    { label: "风格调性", value: "爽文 · 反转 · 打脸" },
    { label: "结局", value: "HE" },
  ],
  "剧集规格": [
    { label: "场景类型", value: "漫剧" },
    { label: "输出格式", value: "剧本（场景头 + 台词 + 动作）" },
    { label: "集数", value: "80集" },
    { label: "单集时长", value: "90秒" },
    { label: "画面方向", value: "竖屏" },
    { label: "画风", value: "写实 · 偏写实日漫风" },
  ],
};

// 漫剧 × 脚本 Alt
export const screenplayMockSettings_comic_storyboard_alt: Record<string, { label: string; value: string }[]> = {
  "创作设定": [
    { label: "核心设定", value: "豪门赘婿被迫离婚后逆袭归来，前妻才发现他是千亿集团真正的掌舵人" },
    { label: "故事线", value: "陈墨隐忍三年终于离婚，以商业奇才的真实身份席卷商界，前妻苏雨晴在一次次交锋中看清了当年的误解" },
    { label: "核心冲突", value: "离婚后的重逢 · 身份反转 · 复仇还是复合" },
    { label: "核心卖点", value: "爽文逆袭 · 反转打脸 · 前期虐后期甜" },
  ],
  "内容要素": [
    { label: "受众", value: "男频 · 女频通吃" },
    { label: "题材", value: "商战 · 豪门 · 言情" },
    { label: "时空", value: "现代都市" },
    { label: "风格调性", value: "爽文 · 反转 · 打脸" },
    { label: "结局", value: "HE" },
  ],
  "剧集规格": [
    { label: "场景类型", value: "漫剧" },
    { label: "输出格式", value: "脚本（分格 + 台词 + 情绪）" },
    { label: "集数", value: "80集" },
    { label: "单集时长", value: "90秒" },
    { label: "画面方向", value: "竖屏" },
    { label: "单集镜头数", value: "8-12格/集" },
    { label: "画风", value: "写实 · 偏写实日漫风" },
  ],
};



export const screenplayCharacterRounds: InspirationRound[] = [
  {
    prompt: "设定已完成！接下来创建角色。先看看女主角的性格方向：",
    cards: [
      {
        text: "飒爽记者型：嗅觉敏锐、行动力极强，为了线索可以蹲点三天三夜。嘴上说着「我只相信证据」，心里却在害怕查出来的真相。看似理性，实则感情用事。",
        keywords: ["飒爽", "记者", "敏锐", "外强内柔"],
      },
      {
        text: "沉稳分析型：冷静克制，擅长从海量信息中找到关联。同事都叫她「人形数据库」。但面对陈深时，所有的冷静分析能力都会失效。",
        keywords: ["沉稳", "冷静", "数据库", "反差软肋"],
      },
      {
        text: "元气冒险型：新人记者，初生牛犊不怕虎。胆子大、运气好、直觉准。随着真相越来越沉重，她的元气也在一点点消耗。",
        keywords: ["元气", "冒险", "直觉", "成长"],
      },
    ],
    adjustPrompt: "想调整女主性格吗？比如「再强势一点」「加点幽默感」，或者跳过～",
  },
  {
    prompt: "女主很有魅力！再来看看男主角的人设：",
    cards: [
      {
        text: "温柔陷阱型：表面是完美未婚夫——温柔、体贴、高学历、高收入。但偶尔会在深夜接到神秘电话，眼神瞬间变冷。他的温柔到底是真心还是任务的一部分？",
        keywords: ["温柔", "完美", "双面", "真假难辨"],
      },
      {
        text: "疏离守护型：话少、表情管理完美、社交距离感强。但每次林晓遇到危险，他总是第一个出现。他的冷漠是保护她的方式——「你越不了解我，就越安全」。",
        keywords: ["疏离", "守护", "冷漠", "保护"],
      },
      {
        text: "亦正亦邪型：聪明到可怕，总是比所有人多想三步。你永远猜不到他站在哪一边。唯一能让他露出破绽的，只有林晓——她是他计划里唯一的变量。",
        keywords: ["亦正亦邪", "聪明", "变量", "破绽"],
      },
    ],
    adjustPrompt: "想调整男主什么？比如「再神秘一点」「加点反派感」，或者跳过～",
  },
  {
    prompt: "男女主搭配很有火花！最后确认关键配角和人物关系：",
    cards: [
      {
        text: "对立阵营型：陈队长（正义但受限的警方代表）、方主编（报社靠山，有自己的秘密）、茶馆老板娘周姐（地下信息网的女王）、线人小K（随时可能消失的不稳定因素）。",
        keywords: ["对立", "阵营", "信息网", "不稳定"],
      },
      {
        text: "圈层渗透型：林晓的闺蜜苏薇（律师，暗中被利用）、陈深的兄弟阿泽（表面兄弟实则监视者）、神秘大佬「先生」（只闻声不见人）、基层刑警老马（最后的良心）。",
        keywords: ["圈层", "渗透", "监视", "良心"],
      },
      {
        text: "情感纠葛型：林晓的前男友方逸（现任主编，对她仍有感情）、陈深的青梅竹马沈月（知道陈深所有秘密）。每个人都是情感和真相的交汇点。",
        keywords: ["情感", "纠葛", "前任", "青梅竹马"],
      },
    ],
    adjustPrompt: "配角还想加谁？或者想调整关系设定？没有就跳过～",
  },
];

// ─── 角色总结卡片 ──────────────────────────────────────────

export interface CharacterProfile {
  name: string;
  identity: string;
  appearance: string;
  personality: string;
  background: string;
}

export interface CharacterCardData {
  femaleLead: CharacterProfile;
  maleLead: CharacterProfile;
  supporting: { name: string; role: string; desc: string }[];
  relationships: string;
}

export const screenplayMockCharacterCard: CharacterCardData = {
  femaleLead: {
    name: "林晓",
    identity: "《滨城晚报》深度调查记者，业内新锐",
    appearance: "短发干练，常穿风衣+帆布鞋，随身背着采访包。跑线索时扎马尾，约会时会换裙子",
    personality: "飒爽果敢，嗅觉敏锐，嘴硬心软。面对线索时冷静如冰，面对陈深时理性全线崩溃",
    background: "三年前曾经历一场车祸，失去部分记忆。她一直以为那只是意外，直到开始调查这个案件",
  },
  maleLead: {
    name: "陈深",
    identity: "知名投资公司高级分析师（表面身份），林晓的未婚夫",
    appearance: "西装革履，气质清冷。左手无名指的戒指永远不摘——那是他唯一的真心",
    personality: "表面温柔完美、实则深不可测。唯一会露出真实情绪的时刻是林晓遇到危险",
    background: "深夜独自在书房打加密电话时会无意识地转戒指。他不是警方卧底，而是另一个组织的人，接近林晓最初是任务，但他真的爱上了她",
  },
  supporting: [
    { name: "陈队长", role: "刑侦队队长", desc: "正直的老警察，掌握关键证据但受上层压力无法公开" },
    { name: "方主编", role: "报社主编 / 林晓前男友", desc: "表面是林晓的靠山，实则和幕后势力有说不清的关系" },
    { name: "周姐", role: "永安巷茶馆老板娘", desc: "地下信息网络的枢纽人物，是陈深母亲的旧识" },
    { name: "老马", role: "基层刑警", desc: "陈队长的老搭档，全剧最后的道德底线" },
  ],
  relationships: "林晓 × 陈深：未婚夫妻 → 信任崩塌 → 对立 → 和解\n方主编 → 林晓：暗中保护又有所隐瞒\n陈队长 ↔ 陈深：表面对立，暗线关联\n周姐 → 陈深：「你妈让我看着你，别走歪了」",
};

// ─── 集纲卡片（替代原大纲卡片） ──────────────────────────────

export interface EpisodeOutline {
  ep: string;
  title: string;
  summary: string;
  hook: string;
}

export interface EpisodeOutlineCardData {
  structure: string;
  totalEpisodes: number;
  episodeDuration: string;
  episodes: EpisodeOutline[];
}

// 复用 OutlineCardData 接口结构，方便 ChatPanel 通用渲染
export interface OutlineChapter {
  title: string;
  summary: string;
  keyEvent: string;
}

export interface OutlineCardData {
  structure: string;
  totalChapters: number;
  estimatedWords: string;
  chapters: OutlineChapter[];
}

export const screenplayMockOutlineCard: OutlineCardData = {
  structure: "三幕八转 · 悬疑甜虐双线",
  totalChapters: 80,
  estimatedWords: "80集 × 90秒",
  chapters: [
    { title: "第1集 雨夜接头", summary: "林晓深夜在永安巷与线人接头，获得一份加密文件。回家时发现陈深异常——他比她先到家，衣角却是湿的。", keyEvent: "悬念开场 · 第一个疑点" },
    { title: "第2集 完美未婚夫", summary: "闪回林晓和陈深的日常：他做早餐、接她下班、记住她所有的喜好。甜蜜到不真实。", keyEvent: "人设建立 · 反差预埋" },
    { title: "第3集 名单上的名字", summary: "林晓解密文件，在嫌疑人关联名单上发现了「陈深」两个字。她以为自己看错了。", keyEvent: "核心悬念启动" },
    { title: "第5集 秘密电话", summary: "林晓半夜醒来，发现陈深在阳台打电话，声音冰冷：「她不会发现的。」", keyEvent: "信任动摇 · 第一刀" },
    { title: "第10集 永安巷追踪", summary: "林晓尾随陈深到永安巷，目睹他和一个黑衣人交接物品。她的世界开始崩塌。", keyEvent: "第一个大反转" },
    { title: "第20集 摊牌", summary: "林晓把证据摔在陈深面前：「你到底是谁？」陈深沉默了很久：「我是爱你的人。」", keyEvent: "信任崩塌 · 高潮点" },
    { title: "第30集 第三方", summary: "林晓发现陈深既不是警察也不是犯罪分子，而是第三方组织的人。真相比她想象的更复杂。", keyEvent: "世界观扩展 · 中段反转" },
    { title: "第40集 三年前的真相", summary: "所有线索指向林晓三年前的车祸。那不是意外——有人要她遗忘的，正是这整个案件的起点。", keyEvent: "女主过去线揭露" },
    { title: "第55集 终局布置", summary: "废弃码头，最后的对决即将展开。陈深把戒指交给林晓：「不管结果怎样，这枚戒指是真的。」", keyEvent: "高潮前奏 · 催泪点" },
    { title: "第80集 雨过天晴", summary: "案件告破，但代价沉重。片尾：一年后，林晓在永安巷茶馆采访，门口走进一个熟悉的身影。", keyEvent: "HE · 开放式余韵" },
  ],
};

// ─── 正文 mock（剧本格式，按集） ──────────────────────────────

export const screenplayMockChapterTexts: Record<number, string> = {
  0: `【第1集 · 雨夜接头】

场景1 | 外景 · 永安巷 · 夜
画面：雨水冲刷着青石板路。巷子尽头的路灯忽明忽暗，照出一个撑伞的身影。

旁白（林晓）：我是林晓，《滨城晚报》的深度调查记者。入行三年，什么阴暗面都见过——直到那个雨夜，我见到了自己的。

林晓收起伞，推开三味堂的木门。

场景2 | 内景 · 三味堂茶馆 · 夜
茶馆空空荡荡，只有角落里坐着一个戴帽子的男人。桌上放着一杯已经凉透的茶。

线人小K（压低声音）：资料在茶杯下面。你只有三天时间。
林晓：三天够了。线索指向谁？
小K（起身）：指向你最不想查的人。

小K把帽檐压低，从后门消失在雨里。林晓拿起茶杯，底下是一个U盘。

场景3 | 内景 · 林晓家 · 夜
林晓开门进屋。客厅的灯亮着——陈深坐在沙发上，翻着一本书。

陈深（微笑）：回来了？今天加班到这么晚？
林晓（脱外套）：嗯，临时有个选题要跟。
陈深：给你留了饭，热一下就能吃。

林晓走向厨房，不经意回头——
她注意到陈深的裤脚是湿的。外面在下雨。但他说他一直在家。

林晓（画外音）：那一刻，我还没意识到这意味着什么。

—— 黑屏 · 钩子字幕 ——
「你以为你了解枕边人吗？」

【第1集 完】`,

  1: `【第2集 · 完美未婚夫】

场景1 | 内景 · 林晓家 · 厨房 · 晨
阳光从窗帘缝隙洒进来。陈深系着围裙，煎蛋的手法流畅优雅。

林晓（揉着眼睛走出卧室）：又做早餐？你不用上班吗？
陈深（不回头）：八点半的会，来得及。你昨天又熬夜了，黑眼圈都出来了。
林晓：...你怎么知道我熬夜。
陈深（端出煎蛋和牛油果吐司）：你的台灯凌晨两点才关。我设了闹钟检查的。
林晓（嘴角忍不住上扬）：变态。
陈深（温柔一笑）：你的变态。

场景2 | 外景 · 滨城街头 · 晨
陈深开车送林晓上班。车内放着林晓最近循环的歌单。

林晓：你怎么连我的歌单都同步了？
陈深：你上周说这首歌好听，我就设成车载默认了。
林晓看着陈深的侧脸，心想——这个人，怎么可以这么完美？

旁白（林晓）：如果我知道这一切完美都有一个期限，我会不会选择永远不打开那个U盘？

—— 转场 · 钩子字幕 ——
「完美的人，往往有最深的秘密。」

【第2集 完】`,
};

// ─── 废弃的世界观数据（保留接口兼容，不再使用） ──────────────

export interface WorldbuildingScene {
  name: string;
  description: string;
}

export interface WorldbuildingData {
  summary: string;
  timeline: string;
  scenes: WorldbuildingScene[];
  socialEcology: string[];
  hiddenClues: string[];
}

// 空的世界观数据（剧本 agent 不再使用世界观轮次）
export const screenplayMockWorldbuilding: WorldbuildingData = {
  summary: "",
  timeline: "",
  scenes: [],
  socialEcology: [],
  hiddenClues: [],
};

export const screenplayWorldbuildingRounds: InspirationRound[] = [];
