// ─── Marketing (电商带货脚本) Agent Mock Data ─────────────────
// 电商带货短视频脚本场景 · 参考4.1 Chat Agent工作流设计
// 新流程: 商品信息采集 → 内容平台确认 → 商品信息卡片确认 → 内容结构生成（三类场景）→ 逐段精修

export interface InspirationCard {
  text: string;
  keywords: string[];
}

export interface InspirationRound {
  prompt: string;
  cards: InspirationCard[];
  adjustPrompt: string;
}

// ─── 阶段1-3 灵感轮次：产品方向 → 视频风格 → 转化策略 ──────

export const marketingInspirationRounds: InspirationRound[] = [
  {
    prompt: "收到产品信息！我分析了这款花漾柔光持妆气垫的核心卖点。你觉得视频最该主打哪个方向？",
    cards: [
      {
        text: "持妆翻车对比 · 视觉冲击：开场用旧气垫 vs 花漾气垫的持妆效果做强对比，让观众第一秒就被「12小时不脱妆」震撼。核心画面：T区特写，油皮姐妹直呼亲妈。",
        keywords: ["持妆", "对比", "视觉冲击", "T区特写"],
      },
      {
        text: "控油硬核实测：直接带妆12小时，从早上8点拍到晚上8点。用纸巾按压T区验证零浮粉，制造「怎么可能」的感觉，评论区会疯狂讨论。",
        keywords: ["控油", "实测", "硬核", "讨论度"],
      },
      {
        text: "职场场景覆盖：早起赶妆、地铁通勤、办公室加班、下班约会…展示气垫融入职场女性每个瞬间。观众看完觉得「每个场景我都需要」，降低决策门槛。",
        keywords: ["场景", "职场", "覆盖", "需求感"],
      },
    ],
    adjustPrompt: "选得好！想微调吗？比如「多加控油实测」「突出性价比」，随便说～",
  },
  {
    prompt: "方向定了！视频的内容风格你更偏好哪种？",
    cards: [
      {
        text: "闺蜜安利型：一个人对着镜头自然分享，手持气垫边化边聊。像闺蜜推荐好物一样亲切，抖音完播率最高的形式。适合30-60秒。",
        keywords: ["闺蜜", "真人", "自然", "高完播"],
      },
      {
        text: "产品特写+旁白：全程底妆微距特写+上妆画面切换，旁白解说卖点。画面质感高、制作精良。适合品牌调性强的投放，45-90秒。",
        keywords: ["特写", "旁白", "质感", "品牌"],
      },
      {
        text: "剧情反转型：短剧情 + 产品植入。「早起底妆翻车→掏出花漾气垫→四分钟逆袭出门」。有故事性，适合传播和二次创作，60秒左右。",
        keywords: ["剧情", "反转", "逆袭", "传播"],
      },
    ],
    adjustPrompt: "想调整什么？比如「时长短一点」「加个真实翻车环节」，没有就跳过～",
  },
  {
    prompt: "最后确认一下转化策略和钩子设计：",
    cards: [
      {
        text: "价格锚定型：先展示同类气垫均价169-299元，再亮出本品到手价129元。配合「限时活动」紧迫感，制造「不买就亏了」的冲动。结尾强引导点击小黄车。",
        keywords: ["价格", "锚定", "限时", "冲动"],
      },
      {
        text: "功效叠加型：每5秒揭露一个新功效（控油→不卡粉→防晒→保湿→提亮），层层递进，观众一直有「还有？！」的惊喜感。最后一句「到手价只要129元」。",
        keywords: ["功效", "叠加", "惊喜", "递进"],
      },
      {
        text: "社会证明型：穿插真实评论截图/用户反馈/销量数据。「油皮亲妈」「上脸服帖不假白」「四分钟搞定全脸」。用口碑建立信任，降低购买焦虑。",
        keywords: ["社会证明", "评论", "口碑", "信任"],
      },
    ],
    adjustPrompt: "最后还想补充什么？比如「结尾加紧迫感」「强调送替换芯」，没有的话我开始整理视频策略了～",
  },
];

// ─── 设定确认卡片（视频策略Brief） ──────────────────────

export const marketingMockSettings: Record<string, { label: string; value: string }[]> = {
  "产品信息": [
    { label: "产品名称", value: "花漾柔光持妆气垫（花知晓）" },
    { label: "核心卖点", value: "控油持妆12小时 · 微米级粉体不卡粉 · SPF50+高倍防晒" },
    { label: "价格", value: "到手价129元（日常价169元）" },
    { label: "目标人群", value: "22-30岁职场女性，早起赶时间，受够卡粉脱妆" },
  ],
  "视频策略": [
    { label: "时长", value: "60秒" },
    { label: "风格", value: "反转型 · 真人出镜" },
    { label: "平台", value: "抖音" },
    { label: "语言", value: "中文口语" },
  ],
  "角色与转化": [
    { label: "出镜角色", value: "女主 · 25岁职场白领 · 油皮 · 日常通勤妆" },
    { label: "开篇策略", value: "真实翻车 · 旧气垫脱妆 vs 花漾气垫持妆" },
    { label: "转化策略", value: "功效叠加 + 价格锚定" },
    { label: "CTA", value: "点击小黄车 · 限时到手价129元" },
  ],
};

// ─── 世界观轮次（故事线设计） ──────────────────────────

export const marketingWorldbuildingRounds: InspirationRound[] = [
  {
    prompt: "视频策略确认！接下来设计故事线。开篇你希望用什么钩子抓住观众？",
    cards: [
      {
        text: "翻车对比开场：第一个画面女主对着镜子，旧气垫脱妆翻车——T区大油田、鼻翼卡粉斑驳。一句「所有气垫都逃不过下午脱妆」直接点痛点。3秒内引发共鸣。",
        keywords: ["翻车", "痛点", "3秒", "共鸣"],
      },
      {
        text: "结果前置开场：直接展示12小时后的底妆状态——T区清爽、柔光通透。观众一头雾水：「下午5点还能这样？」然后倒叙揭秘产品。好奇心驱动完播。",
        keywords: ["结果前置", "悬念", "好奇心", "完播"],
      },
      {
        text: "赶时间开场：闹钟响了又响，女主慌忙起床赶着出门。一边吐槽「只有4分钟化妆」一边掏出气垫快速上妆。制造紧张感和代入感。",
        keywords: ["赶时间", "紧张", "代入", "快速"],
      },
    ],
    adjustPrompt: "钩子想调整吗？比如「再夸张一点」「加个文字弹幕」，或者跳过～",
  },
  {
    prompt: "钩子定了！中间核心演示环节你想怎么安排？",
    cards: [
      {
        text: "功效逐个击破：控油持妆→不卡粉→SPF50+防晒→保湿提亮，每个功效一个画面，节奏紧凑。字幕同步标注每个卖点，静音也能看懂。",
        keywords: ["逐个击破", "紧凑", "字幕", "卖点"],
      },
      {
        text: "时间线跟拍型：早8点上妆→午12点开会→下午3点加班→晚6点下班约会。用时间推进展示持妆效果，每个时间点都验证底妆状态。",
        keywords: ["时间线", "跟拍", "验证", "多场景"],
      },
      {
        text: "半脸对比型：左半脸用旧气垫、右半脸用花漾气垫，同时带妆一整天。午后对比效果一目了然——左脸斑驳脱妆，右脸依然服帖。",
        keywords: ["半脸", "对比", "一目了然", "实测"],
      },
    ],
    adjustPrompt: "演示方式想调整什么？比如「加入纸巾验油环节」「场景再多一个」，没有就跳过～",
  },
  {
    prompt: "核心演示很有看点！最后确认结尾的转化收口：",
    cards: [
      {
        text: "价格揭晓+紧迫感：「日常价169元，现在到手价只要129元，还送15g替换芯！」配合价格字幕动画和限时提示。制造「不买就亏了」的冲动。",
        keywords: ["价格揭晓", "紧迫感", "替换芯", "字幕"],
      },
      {
        text: "成分背书+引导：展示玻尿酸保湿、烟酰胺提亮、无酒精无香精的成分优势，「敏感肌也能用」，然后「点击下方小黄车」。理性说服+明确引导。",
        keywords: ["成分", "背书", "敏感肌", "引导"],
      },
      {
        text: "用户评价收口：切入3-4条真实评价「油皮亲妈」「上脸服帖不假白」「四分钟搞定全脸」。社会证明收尾，最后「小黄车链接」。",
        keywords: ["评价", "社会证明", "口碑", "信任"],
      },
    ],
    adjustPrompt: "转化收口还想调什么？比如「加个赠品信息」「再强调一下送替换芯」，没有的话我开始生成故事线了～",
  },
];

// ─── 世界观总结卡片（故事线） ──────────────────────────

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

export const marketingMockWorldbuilding: WorldbuildingData = {
  summary: "60秒反转型抖音带货视频。真人出镜翻车开场，功效逐个击破，价格锚定+用户口碑收口。目标：3秒痛点共鸣，40秒建立信任，最后20秒促成转化。",
  timeline: "0-5s 翻车钩子 → 5-15s 闺蜜安利+怀疑试用 → 15-25s 旧气垫脱妆对比 → 25-40s 花漾气垫补妆演示 → 40-50s 12小时持妆验证 → 50-60s 价格揭晓+CTA",
  scenes: [
    { name: "开场 · 翻车钩子", description: "女主对着镜子用旧气垫，T区卡粉结块，翻白眼叹气。自然光，卧室梳妆台前，真实翻车感。" },
    { name: "转折 · 闺蜜安利", description: "女主拿起花漾柔光持妆气垫，满脸怀疑：「闺蜜硬塞给我的，说能持妆12小时？我才不信！」" },
    { name: "对比 · 旧妆翻车", description: "办公室场景，手机前置拍T区，旧气垫3小时后斑驳脱妆、鼻翼卡粉。嫌弃表情拉满。" },
    { name: "逆袭 · 花漾上妆", description: "掏出花漾气垫补妆，微米级粉体均匀覆盖，SPF50+防晒加持，皮肤呈现自然柔光质感。" },
    { name: "验证 · 12小时持妆", description: "展示12小时后T区清爽无油光，纸巾按压无浮粉。玻尿酸保湿不拔干，烟酰胺提亮肤色。" },
    { name: "收口 · 价格+CTA", description: "展示正装+替换芯套装，价格弹窗：日常价169元→到手价129元。「油皮姐妹冲！点击小黄车」" },
  ],
  socialEcology: [
    "抖音算法偏好：前3秒高停留 + 完播率 + 互动（评论问链接）",
    "评论区预埋策略：安排3-5条「链接在哪」「油皮已下单」「回购第三盒了」",
    "发布时间建议：工作日早7-9点或晚7-10点（职场女性活跃时段）",
    "话题标签：#油皮气垫 #持妆测试 #底妆推荐 #花知晓 #职场妆容",
  ],
  hiddenClues: [
    "翻车开场的3秒完播率决定了整条视频的流量级别——真实感越强越好",
    "旧气垫脱妆环节是评论区讨论度最高的部分，油皮姐妹会疯狂共鸣",
    "价格揭晓要放在功效叠加之后，观众已认可价值再看价格 = 超值感",
    "结尾露出价格是特殊要求——129元+送替换芯的信息必须在最后10秒强调",
  ],
};

// ─── 角色轮次（出镜角色设定） ──────────────────────────

export const marketingCharacterRounds: InspirationRound[] = [
  {
    prompt: "故事线完成！接下来确定出镜角色。你希望主出镜者是什么样的？",
    cards: [
      {
        text: "职场通勤型 · 小鱼：25岁，简约衬衫+西装裤，干净利落的马尾。说话自然带点小吐槽，像在跟闺蜜分享踩雷和好物。抖音最受欢迎的种草风格。",
        keywords: ["职场", "自然", "25岁", "闺蜜风"],
      },
      {
        text: "美妆博主型 · 芋圆：23-28岁，精致淡妆，穿搭时髦。表达专业有条理，会用成分和数据说服人。适合测评向内容，转化率高。",
        keywords: ["美妆", "专业", "成分", "测评"],
      },
      {
        text: "大学生型 · 奶茶：20-24岁，卫衣牛仔裤，元气满满。早起赶课化妆的真实日常，自带亲和力。适合学生党人群，性价比种草效果好。",
        keywords: ["学生", "元气", "亲和", "日常"],
      },
    ],
    adjustPrompt: "想调整出镜人设吗？比如「再成熟一点」「加个闺蜜角色」，或者跳过～",
  },
  {
    prompt: "角色定了！表演风格和台词怎么设计？",
    cards: [
      {
        text: "闺蜜吐槽型：像跟闺蜜聊天一样说话。会用「说真的」「我跟你们讲」「绝了」等抖音高频表达。不读稿，有自然停顿和翻白眼等真实表情。",
        keywords: ["闺蜜", "自然", "抖音", "不读稿"],
      },
      {
        text: "快节奏种草型：语速1.3倍，每句话都在传递信息。「控油！不卡粉！防晒！保湿！还只要129！」短句轰炸，信息密度高。",
        keywords: ["快节奏", "短句", "信息密", "种草"],
      },
      {
        text: "故事叙述型：用第一人称讲述发现产品的过程。「作为一个大油田，这辈子最大的痛苦就是下午脱妆…」有情感弧线，观众跟着一起经历从翻车到逆袭的旅程。",
        keywords: ["叙述", "第一人称", "情感", "旅程"],
      },
    ],
    adjustPrompt: "表演风格想调整什么？比如「加点吐槽」「表情再夸张一点」，或者跳过～",
  },
  {
    prompt: "很有画面感！最后确认辅助元素：",
    cards: [
      {
        text: "字幕强化型：每个卖点都有大字幕弹出（控油12小时 / 不卡粉 / 到手价129元）。抖音80%用户静音观看，字幕是必须的。",
        keywords: ["字幕", "弹出", "静音", "必须"],
      },
      {
        text: "画中画型：主画面出镜+角落小窗展示上妆特写/T区对比画面。信息量翻倍，观众同时看到人和底妆效果，不需要频繁切镜。",
        keywords: ["画中画", "双视角", "信息量", "特写"],
      },
      {
        text: "极简真实型：不加额外特效，只有人+产品+自然光。让产品本身说话，「少即是多」。追求真实翻车感和真实逆袭感。",
        keywords: ["极简", "真实", "翻车", "逆袭"],
      },
    ],
    adjustPrompt: "辅助元素还想加什么？比如「加个品牌Logo」「加背景音乐」，没有就跳过～",
  },
];

// ─── 角色总结卡片 ──────────────────────────────────────

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

export const marketingMockCharacterCard: CharacterCardData = {
  femaleLead: {
    name: "出镜者 · 女主",
    identity: "25岁职场白领，油皮，每天早起赶时间化妆",
    appearance: "简约衬衫+西装裤，干净利落的马尾，妆感自然。整体就是「你身边的职场闺蜜」",
    personality: "自然带点小吐槽，像在跟闺蜜分享踩雷和好物。会用抖音高频口语表达，有适度的嫌弃感和惊喜感",
    background: "说到关键卖点时会不自觉凑近镜头，展示底妆效果时表情真实。核心策略：不是在「卖货」，而是在「分享一个自己真心用了回不去的好物」",
  },
  maleLead: {
    name: "产品 · 花漾柔光持妆气垫",
    identity: "花知晓品牌 · 核心底妆单品",
    appearance: "精致气垫盒设计，粉扑细腻柔软，粉体微米级细腻质感。在自然光下展示最佳上妆效果",
    personality: "清透柔光+控油持妆，每次出场都要让观众感叹「这底妆效果也太好了」",
    background: "每次出场都配合特写镜头，强调「不卡粉」和「柔光感」。产品在画面中要有高级感——细腻粉体的质感是核心视觉卖点",
  },
  supporting: [
    { name: "字幕系统", role: "信息传达", desc: "每个核心卖点用白色粗体弹出，价格用黄色/红色突出。确保静音观看也能获取80%信息" },
    { name: "BGM", role: "节奏引导", desc: "选择抖音热门轻快BGM，节拍与切镜节奏同步。音量控制在口播的30%-40%" },
    { name: "场景/道具", role: "可信度", desc: "卧室梳妆台（真实感）、办公室（职场场景）、旧气垫（对比道具）、纸巾（验油道具）。所有道具为展示功效服务" },
  ],
  relationships: "女主 × 产品：真实用户的自然推荐关系，从怀疑到真香\n字幕 × 口播：互补关系，口播讲感受，字幕强化功效数据\nBGM × 节奏：踩点切镜，音乐驱动观看节奏",
};

// ─── 大纲总结卡片（分幕脚本） ──────────────────────────

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

export const marketingMockOutlineCard: OutlineCardData = {
  structure: "翻车钩子→闺蜜安利→旧妆对比→花漾逆袭→持妆验证→价格收口",
  totalChapters: 6,
  estimatedWords: "60秒 · 6个分幕",
  chapters: [
    { title: "分幕1 · 开篇翻车钩子", summary: "女主对着镜子用旧气垫拍脸，T区卡粉结块，翻白眼叹气：「说真的，所有气垫都逃不过下午脱妆，我已经放弃了…」", keyEvent: "0-5s · 真实翻车引发油皮共鸣" },
    { title: "分幕2 · 闺蜜安利转折", summary: "女主看到桌上花漾柔光持妆气垫，拿起满脸怀疑：「闺蜜硬塞给我的，说能持妆12小时？我才不信，今天就测给你们看！」", keyEvent: "5-15s · 制造怀疑悬念引导看下去" },
    { title: "分幕3 · 旧妆翻车对比", summary: "办公室场景，手机前置拍T区：旧气垫3小时后斑驳脱妆、鼻翼卡粉结块。「你看，这才3小时就成这样了！」", keyEvent: "15-25s · 强化痛点对比" },
    { title: "分幕4 · 花漾逆袭上妆", summary: "掏出花漾气垫快速补妆。微米级粉体均匀覆盖，SPF50+防晒加持。「上脸完全不卡粉，还带高倍防晒，早上涂了不用额外涂防晒！」", keyEvent: "25-40s · 核心功效演示" },
    { title: "分幕5 · 12小时持妆验证", summary: "展示12小时后T区清爽无油光，纸巾按压无浮粉。「控油持妆真的绝，玻尿酸保湿不拔干，烟酰胺还提亮肤色！」", keyEvent: "40-50s · 效果验证建立信任" },
    { title: "分幕6 · 价格揭晓+CTA", summary: "展示正装+15g替换芯套装，价格弹窗：日常价169元→到手价129元。「四分钟搞定全脸，油皮姐妹真的可以冲！点击小黄车！」", keyEvent: "50-60s · 价格锚定+强CTA" },
  ],
};

// ─── 正文 mock（分幕脚本详细） ──────────────────────────

export const marketingMockChapterTexts: Record<number, string> = {
  0: `【分幕1 · 开篇翻车钩子】0-5s

场景：卧室，梳妆台前，自然晨光
镜头：中景，女主面对镜子

画面描述：
女主穿睡衣坐在梳妆台前，拿起旧气垫快速拍脸。
T区明显卡粉结块，镜子里皮肤斑驳不均匀。
女主翻白眼，无奈叹气。

台词（中文口语）：
"说真的，所有气垫都逃不过下午脱妆——"（对着镜子拍粉）
"我已经放弃了…"（翻白眼，扔下旧气垫）

字幕：所有气垫都逃不过下午脱妆
BGM：轻快节拍起，音量30%
技巧标注：真实翻车感 + 油皮痛点共鸣，3秒内建立情绪代入`,

  1: `【分幕2 · 闺蜜安利转折】5-15s

场景：同一卧室，梳妆台上
镜头：中近景→产品特写

画面描述：
女主看到梳妆台角落的花漾柔光持妆气垫，拿起来晃了晃。
镜头聚焦气垫外壳的品牌设计，女主满脸怀疑地挑眉。
然后打开气垫盖，手指触碰粉体感受质地。

台词（中文口语）：
"直到我闺蜜硬塞给我这个花漾柔光持妆气垫——"（拿起气垫）
"说能持妆12小时？我才不信！"（挑眉，怀疑脸）
"今天就测给你们看！"（对镜头比了个手势）

字幕：持妆12小时？我才不信！
技巧标注：怀疑→测试的悬念设置，引导观众看下去`,

  2: `【分幕3 · 旧妆翻车对比】15-25s

场景：办公室工位
镜头：手机前置特写

画面描述：
女主在办公室对着手机前置摄像头。
展示T区斑驳脱妆——鼻翼卡粉结块、额头浮粉。
手指蹭下鼻翼浮粉，嫌弃地展示给镜头看。

台词（中文口语）：
"你看！这才3小时——"（指着T区）
"旧气垫已经成这样了！"（手指蹭浮粉展示）
"斑驳到能当面具！"（嫌弃脸拉满）

字幕：才3小时就斑驳成面具
技巧标注：真实脱妆画面强化痛点，制造「旧气垫不行」的认知`,

  3: `【分幕4 · 花漾逆袭上妆】25-40s

场景：办公室工位/洗手间
镜头：中景→特写交替

画面描述：
女主掏出花漾柔光持妆气垫，打开盖子。
粉扑沾取粉体，镜头特写微米级细腻粉质。
快速拍打全脸，卡粉处被均匀覆盖，皮肤呈现自然柔光质感。

台词（中文口语）：
"再看看花漾的——微米级粉体，上脸完全不卡粉！"（快速上妆中）
"还带SPF50+高倍防晒——"（展示粉扑质感）
"早上涂了都不用额外涂防晒！"（对镜头竖大拇指）

字幕：微米级粉体不卡粉 · SPF50+防晒
技巧标注：核心功效逐个击破，上妆过程可视化建立信任`,

  4: `【分幕5 · 12小时持妆验证】40-50s

场景：办公室，傍晚自然光
镜头：特写→中景

画面描述：
女主展示12小时后的底妆状态。
T区依然清爽无油光，用纸巾按压T区——无浮粉无油迹。
侧脸展示透亮底妆效果。

台词（中文口语）：
"现在已经12小时了！你看——"（展示T区）
"还是这么服帖！控油持妆真的绝！"（纸巾按压验证）
"玻尿酸保湿也不拔干，烟酰胺还能悄悄提亮肤色！"（侧脸展示）

字幕：控油持妆12小时 · 玻尿酸保湿 · 烟酰胺提亮
技巧标注：效果验证 > 口头承诺，纸巾验油制造信任感`,

  5: `【分幕6 · 价格揭晓+CTA】50-60s

场景：回到卧室/办公室，光线明亮
镜头：中景，产品特写穿插

画面描述：
女主双手举着花漾柔光持妆气垫。
旁边展示正装15g + 15g替换芯的套装。
屏幕弹出价格动画：日常价169元→划掉→到手价129元（红色放大）。
女主微笑，手指向下指（指向小黄车）。

台词（中文口语）：
"现在到手价只要129元！"（价格弹窗弹出）
"还送15g替换芯！四分钟搞定全脸——"（展示套装）
"油皮姐妹真的可以冲！点击下方小黄车购买！"（手指向下，坚定微笑）

字幕：到手价129元（日常价169元）· 送15g替换芯
技巧标注：价格锚定+赠品信息+明确CTA，结尾必须露出价格`,
};

// ─── 新流程：商品信息卡片 ──────────────────────────────────

export const marketingProductInfoCard: Record<string, { label: string; value: string }[]> = {
  "商品信息": [
    { label: "商品名称", value: "花漾柔光持妆气垫（花知晓）" },
    { label: "价格", value: "到手价129元（日常价169元）" },
    { label: "品类", value: "美妆 · 底妆气垫" },
    { label: "商品简介", value: "15g正装+15g替换芯，控油持妆12小时、微米级粉体不卡粉、SPF50+高倍防晒。含玻尿酸保湿、烟酰胺提亮，无酒精无香精。" },
    { label: "目标用户", value: "22-30岁职场女性，早起赶时间，受够卡粉脱妆，油皮/混油皮" },
    { label: "核心卖点", value: "控油持妆12小时 · 微米级粉体不卡粉 · SPF50+高倍防晒 · 玻尿酸保湿 · 烟酰胺提亮" },
  ],
};

// ─── 新流程：内容平台选项 ──────────────────────────────────

export const marketingPlatforms = [
  { id: "douyin", label: "抖音", desc: "短视频+直播", contentTypes: ["short_video", "live_script"] as const },
  { id: "xiaohongshu", label: "小红书", desc: "图文种草+短视频", contentTypes: ["graphic_note", "short_video"] as const },
  { id: "kuaishou", label: "快手", desc: "短视频+直播", contentTypes: ["short_video", "live_script"] as const },
  { id: "wechat", label: "视频号", desc: "短视频", contentTypes: ["short_video"] as const },
  { id: "tiktok", label: "TikTok", desc: "海外短视频", contentTypes: ["short_video"] as const },
  { id: "bilibili", label: "B站", desc: "中长视频", contentTypes: ["short_video"] as const },
];

// ─── 新流程：内容结构（按内容类型索引，根据平台选择输出） ──────

export interface ContentScenario {
  type: "short_video" | "live_script" | "graphic_note";
  typeLabel: string;
  title: string;
  duration: string;
  overview: string;
  timeline: string;
  structure: string;
  sections: { title: string; desc: string; duration?: string }[];
}

export const marketingContentByType: Record<string, ContentScenario> = {
  short_video: {
    type: "short_video",
    typeLabel: "短视频脚本",
    title: "「油皮亲妈」持妆12小时翻车逆袭实测",
    duration: "60秒",
    overview: "60秒反转型抖音带货视频。真人出镜翻车开场，功效逐个击破，价格锚定+用户口碑收口。目标：3秒痛点共鸣，40秒建立信任，最后20秒促成转化。",
    timeline: "0-5s 翻车钩子 → 5-15s 闺蜜安利+怀疑试用 → 15-25s 旧妆对比 → 25-40s 花漾上妆演示 → 40-50s 12小时持妆验证 → 50-60s 价格揭晓+CTA",
    structure: "翻车钩子→闺蜜安利→旧妆对比→花漾逆袭→持妆验证→价格收口",
    sections: [
      { title: "开篇钩子", desc: "女主用旧气垫翻车：T区卡粉、底妆斑驳。「所有气垫都逃不过下午脱妆」制造油皮痛点共鸣", duration: "0-5s" },
      { title: "闺蜜安利", desc: "拿起花漾气垫满脸怀疑：「说能持妆12小时？我才不信，今天测给你们看！」", duration: "5-15s" },
      { title: "旧妆翻车", desc: "办公室实拍3小时后旧气垫脱妆状态，T区浮粉、鼻翼卡粉，制造强烈对比", duration: "15-25s" },
      { title: "花漾逆袭", desc: "掏出花漾气垫补妆演示：微米级粉体不卡粉 + SPF50+防晒 + 上妆过程特写", duration: "25-40s" },
      { title: "价格+促单", desc: "「到手价129元，送15g替换芯，油皮姐妹冲！」价格弹窗 + 小黄车引导", duration: "40-60s" },
    ],
  },
  live_script: {
    type: "live_script",
    typeLabel: "直播台本",
    title: "「油皮翻身」花漾柔光持妆气垫专场",
    duration: "15分钟",
    overview: "15分钟闺蜜安利型直播带货台本，真人出镜互动式讲解。以痛点共鸣开场，现场上妆演示，逐一展示核心功效，最后以限时限量促单收尾。目标：留住观众→建立信任→促成下单。",
    timeline: "0-2min 开场暖场 → 2-5min 痛点铺垫 → 5-10min 产品讲解+上妆演示 → 10-13min 效果验证 → 13-15min 逼单收尾",
    structure: "暖场→痛点→上妆演示→效果验证→逼单",
    sections: [
      { title: "留人话术", desc: "「油皮姐妹们今天一定要蹲住！这款气垫我自己用空了两盒，上次直播3000单10分钟抢光，今天返场价更低！」" },
      { title: "建立信任", desc: "「我自己就是大油田，试了无数气垫都不行。直到闺蜜塞给我这个花漾气垫——给你们看我这个月的空瓶」" },
      { title: "产品讲解", desc: "逐一演示核心功效：微米级粉体质地（特写）、现场上妆（不卡粉）、SPF50+防晒、玻尿酸保湿、烟酰胺提亮" },
      { title: "促单话术", desc: "「今天到手价129元！日常169！还送15g替换芯，等于两盒的量！这个价格数量有限，点小黄车第一个链接」" },
      { title: "逼单话术", desc: "「已经300多单了！犹豫的姐妹想想，129块四分钟搞定全脸，少喝两杯奶茶换一个月不脱妆！3、2、1，上链接！」" },
    ],
  },
  graphic_note: {
    type: "graphic_note",
    typeLabel: "图文笔记",
    title: "「油皮亲妈」花漾气垫12小时真实测评",
    duration: "6张图+正文",
    overview: "小红书图文种草笔记，以真实用户分享口吻撰写。封面对比+产品展示+上妆过程+持妆验证+正文+购买引导，6图配长文，打造「油皮素人真实测评」的可信感。目标：吸引点击→建立共鸣→引导购买。",
    timeline: "封面对比（吸引点击）→ 产品展示（视觉种草）→ 上妆过程（代入感）→ 持妆验证（理性决策）→ 正文（情感共鸣）→ 购买引导（转化收口）",
    structure: "封面对比→产品展示→上妆过程→持妆验证→价格信息→购买引导",
    sections: [
      { title: "封面图+标题", desc: "封面：左右对比——旧气垫脱妆 vs 花漾12小时后\n标题：「油皮亲妈！花漾气垫12小时实测，下午5点T区居然还在！」\n标签：#油皮气垫 #持妆测试 #底妆推荐" },
      { title: "产品展示图", desc: "花漾气垫开盖特写 + 粉扑质感展示 + 正装+替换芯套装摆拍" },
      { title: "上妆过程图", desc: "三张上妆图：粉扑沾取粉体（质地特写）、拍打全脸（手法展示）、上妆后柔光效果" },
      { title: "持妆验证图", desc: "12小时对比：早8点 vs 下午5点 T区特写 + 纸巾按压验证无浮粉" },
      { title: "正文文案", desc: "以第一人称「种草体」写作：油皮痛点→闺蜜安利→真实使用体验→功效逐个点评→适合人群总结" },
      { title: "购买引导", desc: "「链接放评论区了！到手价129元还送替换芯，油皮姐妹真的可以冲」+ 评论区置顶链接" },
    ],
  },
};

// ─── 短视频脚本：R1 Brief 数据 ──────────────────────────────

export interface SellingPointMatrix {
  core: string[];
  secondary: string[];
  differentiated: string[];
}

export interface AudienceProfile {
  age: string;
  identity: string;
  painPoints: string;
  preference: string;
}

export interface CreativeDirection {
  title: string;
  storyType: string;
  overview: string;
  hook: string;
}

export interface VideoBrief {
  confirmedParams: { label: string; value: string }[];
  sellingPoints: SellingPointMatrix;
  audience: AudienceProfile;
  directions: CreativeDirection[];
  recommendIndex: number;
}

export const mockVideoBrief: VideoBrief = {
  confirmedParams: [
    { label: "商品名称", value: "花漾柔光持妆气垫（花知晓）" },
    { label: "价格", value: "到手价129元（日常价169元）" },
    { label: "品类", value: "美妆 · 底妆气垫" },
    { label: "目标平台", value: "抖音" },
    { label: "视频时长", value: "60秒" },
    { label: "视频风格", value: "反转型" },
    { label: "目标人群", value: "22-30岁职场女性，早起赶时间，受够卡粉脱妆" },
  ],
  sellingPoints: {
    core: ["控油持妆12小时（早8点到晚8点不脱妆）", "微米级粉体不卡粉（上脸服帖不假白）", "SPF50+高倍防晒（省去额外涂防晒步骤）"],
    secondary: ["玻尿酸保湿不拔干", "烟酰胺提亮肤色", "无酒精无香精（敏感肌友好）", "15g正装+15g替换芯"],
    differentiated: ["四分钟快速搞定全脸底妆——职场女性早起救星", "129元价位同时具备控油+防晒+保湿提亮的全能气垫"],
  },
  audience: {
    age: "22-30岁",
    identity: "职场白领 / 通勤族，油皮/混油皮，每天早起赶时间化妆",
    painPoints: "底妆午后脱妆卡粉、T区大油田、鼻翼浮粉斑驳、夏天需要频繁补妆",
    preference: "追求高性价比、看重真实持妆效果、易被翻车逆袭型内容种草",
  },
  directions: [
    {
      title: "方向1：早起翻车逆袭型",
      storyType: "场景反转",
      overview: "女主用旧气垫化妆翻车（T区卡粉、午后脱妆），闺蜜安利花漾气垫后半信半疑试用，结果12小时后T区依然清爽。从翻车到逆袭，最后价格揭晓制造惊喜。",
      hook: "「说真的，所有气垫都逃不过下午脱妆，我已经放弃了…」",
    },
    {
      title: "方向2：12小时硬核实测型",
      storyType: "硬核对比反转",
      overview: "开头声称「持妆12小时？骗鬼呢」，然后从早8点开始计时——上妆、通勤、开会、加班，每隔3小时验证底妆状态。12小时后纸巾按压T区零浮粉，从怀疑到真香。",
      hook: "「我赌一杯奶茶这气垫扛不过6小时」",
    },
    {
      title: "方向3：闺蜜安利反转型",
      storyType: "社交互动反转",
      overview: "闺蜜吐槽女主下午底妆又翻车了，硬塞花漾气垫现场安利。女主从嫌弃到试用后「不卡粉？？」的惊讶，再到了解价格后秒下单。全程自然对话，像真实闺蜜安利。",
      hook: "「你这底妆也太拉了——来试试我这个」",
    },
  ],
  recommendIndex: 0,
};

// ─── 短视频脚本：R2 分幕剧本数据 ──────────────────────────────

export interface ScriptCharacter {
  name: string;
  description: string;
}

export interface ScenePlan {
  sceneNo: number;
  location: string;
  timeSpace: string;
  purpose: string;
}

export interface ScriptScene {
  act: number;
  heading: string;
  characters: string[];
  duration: string;
  productExposure: string;
  visual: string;
  dialogue: string;
  sellingPoint?: string;
}

export interface SellingPointCheck {
  type: string;
  content: string;
  count: string;
  compliance: string;
}

export interface VideoScript {
  title: string;
  duration: string;
  style: string;
  characters: ScriptCharacter[];
  scenePlans: ScenePlan[];
  scenes: ScriptScene[];
  sellingPointChecks: SellingPointCheck[];
}

export const mockVideoScript: VideoScript = {
  title: "花漾柔光持妆气垫 · 短视频脚本",
  duration: "60s",
  style: "反转型 · 真人出镜",
  characters: [
    { name: "女主", description: "25 岁职场白领，油皮，日常赶时间化妆，对持妆效果有高要求，自带「吐槽体质」" },
  ],
  scenePlans: [
    { sceneNo: 1, location: "卧室", timeSpace: "日 / 内", purpose: "早上赶时间化妆，展示旧气垫翻车效果" },
    { sceneNo: 2, location: "办公室", timeSpace: "日 / 内", purpose: "下午工作场景，展示花漾气垫 12 小时持妆效果" },
  ],
  scenes: [
    {
      act: 1,
      heading: "1 卧室 日 内",
      characters: ["女主"],
      duration: "0-5s",
      productExposure: "旧气垫",
      visual: "女主对着镜子，用旧气垫快速拍脸，T 区明显卡粉结块，眉头紧皱，对着镜头翻白眼",
      dialogue: "\"说真的，所有气垫都逃不过下午脱妆，我已经放弃了...\"",
      sellingPoint: "痛点铺垫",
    },
    {
      act: 2,
      heading: "2 卧室 日 内",
      characters: ["女主"],
      duration: "5-15s",
      productExposure: "花漾柔光持妆气垫（镜头扫过）",
      visual: "女主看到桌上的花漾气垫，拿起晃了晃，满脸怀疑",
      dialogue: "\"直到我闺蜜硬塞给我这个花漾气垫，说能持妆 12 小时？我才不信，今天就测给你们看！\"",
      sellingPoint: "核心卖点①：控油持妆 12 小时",
    },
    {
      act: 3,
      heading: "3 办公室 日 内",
      characters: ["女主"],
      duration: "15-25s",
      productExposure: "旧气垫脱妆效果（手机前置画面）",
      visual: "女主对着手机前置摄像头，展示 T 区斑驳脱妆、鼻翼卡粉的状态，用手指蹭下浮粉",
      dialogue: "\"你看，这才 3 小时，旧气垫已经成这样了，斑驳到能当面具！\"",
      sellingPoint: "对比强化痛点",
    },
    {
      act: 4,
      heading: "4 办公室 日 内",
      characters: ["女主"],
      duration: "25-40s",
      productExposure: "花漾气垫（补妆过程）",
      visual: "女主掏出花漾气垫，快速拍打全脸，微米级粉体均匀覆盖卡粉处，皮肤呈现自然柔光质感",
      dialogue: "\"再看看花漾的，微米级粉体，上脸完全不卡粉，还带 SPF50+ 高倍防晒，早上涂了都不用额外涂防晒！\"",
      sellingPoint: "核心卖点②：微米级粉体不卡粉 + 核心卖点③：SPF50+",
    },
    {
      act: 5,
      heading: "5 办公室 日 内",
      characters: ["女主"],
      duration: "40-50s",
      productExposure: "花漾气垫（12 小时持妆效果）",
      visual: "女主展示 12 小时后的底妆，T 区依然清爽无脱妆，皮肤透亮，用纸巾按压 T 区无油迹",
      dialogue: "\"现在已经 12 小时了！你看，还是这么服帖，控油持妆真的绝，玻尿酸保湿也不拔干，烟酰胺还能悄悄提亮肤色！\"",
      sellingPoint: "次要卖点：玻尿酸保湿 + 烟酰胺提亮",
    },
    {
      act: 6,
      heading: "6 办公室 日 内",
      characters: ["女主"],
      duration: "50-60s",
      productExposure: "花漾气垫（正装 + 替换芯）、价格弹窗",
      visual: "女主拿着花漾气垫，旁边展示正装 + 15g 替换芯，屏幕弹出价格：「到手价 129 元（日常价 169 元）」",
      dialogue: "\"现在到手价只要 129 元，还送 15g 替换芯，四分钟搞定全脸，油皮姐妹真的可以冲！点击下方小黄车购买！\"",
      sellingPoint: "价格锚定 + CTA",
    },
  ],
  sellingPointChecks: [
    { type: "核心卖点 1", content: "控油持妆 12 小时", count: "2 次", compliance: "符合≥2 处呈现要求" },
    { type: "核心卖点 2", content: "微米级粉体不卡粉", count: "2 次", compliance: "符合≥2 处呈现要求" },
    { type: "核心卖点 3", content: "SPF50+ 高倍防晒", count: "1 次", compliance: "符合≥1 处呈现要求" },
    { type: "次要卖点", content: "玻尿酸保湿、烟酰胺提亮", count: "各 1 次", compliance: "符合≤1 处呈现要求" },
    { type: "差异化卖点", content: "四分钟快速上妆、油皮适配", count: "各 1 次", compliance: "符合场景植入要求" },
  ],
};

// ─── 短视频脚本：R3 分镜表数据 ──────────────────────────────

export interface StoryboardShot {
  shotNo: number;
  act: number;
  shotSize: string;
  cameraMove: string;
  visual: string;
  audioDialogue: string;
  duration: number;
  productExposure: string;
}

export interface SellingPointCoverage {
  type: string;
  content: string;
  shotRefs: string;
}

export interface Storyboard {
  title: string;
  targetDuration: number;
  totalDuration: number;
  shots: StoryboardShot[];
  sellingPointCoverage: SellingPointCoverage[];
}

export const mockStoryboard: Storyboard = {
  title: "花漾柔光持妆气垫 · 分镜表",
  targetDuration: 60,
  totalDuration: 60,
  shots: [
    { shotNo: 1, act: 1, shotSize: "特写", cameraMove: "推镜", visual: "女主手指沾着旧气垫粉膏，T区卡粉结块的皮肤纹理清晰可见", audioDialogue: "女主：\"说真的，所有气垫都逃不过下午脱妆，我已经放弃了...\"\n音效：无奈叹气声", duration: 5, productExposure: "旧气垫（部分）" },
    { shotNo: 2, act: 2, shotSize: "近景", cameraMove: "固定", visual: "女主拿起桌上的花漾气垫，镜头聚焦气垫外壳的品牌logo，女主满脸怀疑地挑眉", audioDialogue: "女主：\"直到我闺蜜硬塞给我这个花漾气垫，说能持妆12小时？我才不信，今天就测给你们看！\"\n音效：疑惑语气词\"嗯？\"", duration: 10, productExposure: "花漾柔光持妆气垫（完整）" },
    { shotNo: 3, act: 3, shotSize: "特写", cameraMove: "固定", visual: "手机前置摄像头画面，女主T区斑驳脱妆，鼻翼卡粉结块，手指蹭下浮粉", audioDialogue: "女主：\"你看，这才3小时，旧气垫已经成这样了，斑驳到能当面具！\"\n音效：嫌弃的\"啧\"声", duration: 8, productExposure: "旧气垫脱妆效果（无产品露出）" },
    { shotNo: 4, act: 4, shotSize: "中景", cameraMove: "跟拍", visual: "女主快速打开花漾气垫，粉扑沾取粉体，镜头特写微米级细腻粉质", audioDialogue: "旁白：\"微米级粉体，上脸完全不卡粉！\"\n音效：粉扑拍打皮肤的轻响", duration: 7, productExposure: "花漾气垫（粉芯+粉扑）" },
    { shotNo: 5, act: 4, shotSize: "近景", cameraMove: "固定", visual: "女主用粉扑快速拍打全脸，卡粉处被均匀覆盖，皮肤呈现自然柔光质感", audioDialogue: "女主：\"还带SPF50+高倍防晒，早上涂了都不用额外涂防晒！\"\n音效：轻快的背景音起", duration: 6, productExposure: "花漾气垫（手持）" },
    { shotNo: 6, act: 5, shotSize: "特写", cameraMove: "固定", visual: "女主展示12小时后的底妆，T区清爽无油光，纸巾按压T区后无明显粉迹", audioDialogue: "女主：\"现在已经12小时了！你看，还是这么服帖，控油持妆真的绝！\"\n音效：惊讶的\"哇\"声", duration: 8, productExposure: "花漾气垫（放置在桌面）" },
    { shotNo: 7, act: 5, shotSize: "近景", cameraMove: "拉镜", visual: "女主侧脸展示透亮底妆，镜头拉远露出桌上的花漾气垫", audioDialogue: "女主：\"玻尿酸保湿不拔干，烟酰胺还能悄悄提亮肤色！\"", duration: 6, productExposure: "花漾气垫（完整）" },
    { shotNo: 8, act: 6, shotSize: "中景", cameraMove: "固定", visual: "女主双手举着花漾气垫，旁边特写正装+15g替换芯的套装，屏幕弹出价格弹窗", audioDialogue: "女主：\"现在到手价只要129元，还送15g替换芯，四分钟搞定全脸，油皮姐妹真的可以冲！点击下方小黄车购买！\"\n音效：急促的下单提示音", duration: 10, productExposure: "花漾气垫（正装+替换芯）、价格弹窗" },
  ],
  sellingPointCoverage: [
    { type: "核心卖点1（控油持妆12小时）", content: "镜号6、7", shotRefs: "2 次呈现" },
    { type: "核心卖点2（微米级粉体不卡粉）", content: "镜号4、5", shotRefs: "2 次呈现" },
    { type: "核心卖点3（SPF50+高倍防晒）", content: "镜号5", shotRefs: "1 次呈现" },
    { type: "次要卖点（玻尿酸保湿、烟酰胺提亮）", content: "镜号7", shotRefs: "1 次呈现" },
    { type: "差异化卖点（四分钟快速上妆、油皮适配）", content: "镜号8", shotRefs: "1 次呈现" },
  ],
};

// ─── 直播台本：Brief ──────────────────────────────────────

export const mockLiveBrief: VideoBrief = {
  confirmedParams: [
    { label: "商品名称", value: "花漾柔光持妆气垫" },
    { label: "价格", value: "¥129（日常价¥169）" },
    { label: "品类", value: "美妆 · 底妆" },
    { label: "目标平台", value: "抖音直播" },
    { label: "直播时长", value: "15分钟（单品讲解）" },
    { label: "话术风格", value: "闺蜜安利型" },
    { label: "特殊要求", value: "需要现场上妆演示" },
  ],
  sellingPoints: {
    core: ["控油持妆 12 小时", "微米级粉体不卡粉", "SPF50+ 高倍防晒"],
    secondary: ["玻尿酸保湿不拔干", "烟酰胺提亮肤色"],
    differentiated: ["四分钟快速上妆", "油皮亲妈", "附赠 15g 替换芯"],
  },
  audience: {
    age: "20-35 岁",
    identity: "职场女性 / 大学生，油性/混油皮肤，日常化妆需求",
    painPoints: "底妆午后脱妆、卡粉浮粉、夏天需要频繁补妆",
    preference: "追求性价比，喜欢看真人实测",
  },
  directions: [
    {
      title: "闺蜜安利型",
      storyType: "口语化分享",
      overview: "像跟闺蜜聊天一样安利产品，边上妆边讲感受，真实不做作",
      hook: "「姐妹们我跟你们说，这个气垫我用了一个月，再也回不去了」",
    },
    {
      title: "现场实测型",
      storyType: "实验对比",
      overview: "直播间现场半脸对比实测，左旧右新，12 小时后验证效果",
      hook: "「今天我就在直播间实测，12 小时后你们来看效果」",
    },
    {
      title: "专业讲解型",
      storyType: "成分科普",
      overview: "从成分和技术角度讲解产品优势，配合上妆演示",
      hook: "「今天给你们讲讲为什么这款气垫能做到 12 小时持妆」",
    },
  ],
  recommendIndex: 0,
};

// ─── 直播台本：完整台本数据 ──────────────────────────────

export interface LiveScriptPhase {
  timeRange: string;
  phase: string;
  script: string;
  interaction: string;
  productExposure: string;
}

export interface LiveScriptData {
  title: string;
  duration: string;
  style: string;
  rhythmPlan: { timeRange: string; phase: string; goal: string }[];
  phases: LiveScriptPhase[];
  interactionLibrary: { type: string; lines: string[] }[];
  sellingPointChecks: SellingPointCheck[];
}

export const mockLiveScript: LiveScriptData = {
  title: "花漾柔光持妆气垫 · 直播台本",
  duration: "15分钟",
  style: "闺蜜安利型",
  rhythmPlan: [
    { timeRange: "0-2min", phase: "开场暖场", goal: "拉停留、攒人气" },
    { timeRange: "2-5min", phase: "痛点铺垫", goal: "引共鸣、埋需求" },
    { timeRange: "5-10min", phase: "产品讲解 + 上妆演示", goal: "展示卖点、建立信任" },
    { timeRange: "10-13min", phase: "效果验证", goal: "用实际效果说服" },
    { timeRange: "13-15min", phase: "逼单收尾", goal: "制造紧迫感、引导下单" },
  ],
  phases: [
    {
      timeRange: "0-30s",
      phase: "开场",
      script: "家人们今天不废话！直接上我最近用空了两盒的气垫，花漾柔光持妆气垫！我跟你们说，油皮姐妹今天一定要蹲住！",
      interaction: "扣「1」想看实测",
      productExposure: "无",
    },
    {
      timeRange: "30s-2min",
      phase: "暖场互动",
      script: "先问问大家，你们是不是也有这种困扰——早上化完妆美美出门，下午一照镜子，T区油田大爆发，鼻翼卡粉，底妆斑驳成面具？扣「有」的让我看看有多少姐妹！",
      interaction: "扣「有」看有多少姐妹 / 扣「油田」同款",
      productExposure: "无",
    },
    {
      timeRange: "2-4min",
      phase: "痛点铺垫",
      script: "我之前也是这样，试了好多气垫都不行，一到下午就脱妆。直到我闺蜜硬塞给我这个花漾的气垫——说实话当时我也不信，12小时持妆？骗鬼呢！结果用了一次就真香了。",
      interaction: "「你们猜我用了多久被圈粉的？扣时间」",
      productExposure: "花漾气垫出镜（手持展示）",
    },
    {
      timeRange: "4-6min",
      phase: "产品讲解",
      script: "来，我先给大家看看这个粉体——微米级的，你们看多细腻！上脸是真的不卡粉。而且它有SPF50+防晒，早上涂了这个就不用额外涂防晒了，懒人直接省一步！",
      interaction: "「想看我现场上妆的扣 666」",
      productExposure: "气垫开盖展示粉芯 + 粉扑",
    },
    {
      timeRange: "6-8min",
      phase: "现场上妆",
      script: "好！666够了，我现在就给你们上妆！看到没，粉扑沾取粉体，轻轻拍打就行——T区重点多拍两下。你们看这个柔光感！皮肤立马变得好通透，而且完全不厚重。",
      interaction: "「看到效果了吗？看到的扣 好好看」",
      productExposure: "上妆全过程（气垫 + 粉扑 + 上脸）",
    },
    {
      timeRange: "8-10min",
      phase: "卖点叠加",
      script: "关键是这个气垫还添加了玻尿酸和烟酰胺，保湿不拔干，还能提亮肤色。油皮用了控油，干皮用了保湿，真的是通杀。而且四分钟就能搞定全脸！",
      interaction: "「油皮的扣油 / 干皮的扣干 / 混合的扣混」",
      productExposure: "产品正面特写",
    },
    {
      timeRange: "10-12min",
      phase: "效果验证",
      script: "好了你们看，我已经上完妆了。我答应你们今天直播结束之前再给你们看效果，但是先看看之前我实测的照片——12小时之后，T区还是这么清爽，纸巾按压没有浮粉！",
      interaction: "「信了的扣 冲 / 还在犹豫的扣 ?」",
      productExposure: "展示持妆效果照片",
    },
    {
      timeRange: "12-14min",
      phase: "逼单",
      script: "来！今天直播间价格——129元！日常可是169！而且买一送一个替换芯！15g替换芯！等于两盒的量只要129！这个价格我也是争取了好久才拿到的，数量有限哦！",
      interaction: "扣「已拍」已下单 / 扣「犹豫」我帮你分析",
      productExposure: "正装 + 替换芯套装展示",
    },
    {
      timeRange: "14-15min",
      phase: "收尾",
      script: "还没下单的姐妹抓紧了！129到手，送替换芯，四分钟搞定全脸，油皮亲妈！今天过了就恢复原价了！好，下一个品我们马上安排！",
      interaction: "「下单了的扣 冲冲冲 / 关注直播间下次不迷路」",
      productExposure: "产品 + 价格弹窗",
    },
  ],
  interactionLibrary: [
    { type: "留人话术", lines: ["新来的姐妹先别走！马上放价！", "还有5分钟就要改价了，蹲住！", "在线人数破X了，感谢家人们！"] },
    { type: "逼单话术", lines: ["库存只剩XX单了！", "这个价格只有今天！", "已经有XX位姐妹下单了，跟上！"] },
    { type: "转化话术", lines: ["犹豫的姐妹看评论区实测图！", "不好用随时来找我！", "先拍先得，数量有限！"] },
  ],
  sellingPointChecks: [
    { type: "核心卖点 1", content: "控油持妆 12 小时", count: "3 次", compliance: "符合≥2 处呈现要求" },
    { type: "核心卖点 2", content: "微米级粉体不卡粉", count: "2 次", compliance: "符合≥2 处呈现要求" },
    { type: "核心卖点 3", content: "SPF50+ 高倍防晒", count: "1 次", compliance: "符合≥1 处呈现要求" },
    { type: "次要卖点", content: "玻尿酸保湿、烟酰胺提亮", count: "各 1 次", compliance: "符合≤1 处呈现要求" },
    { type: "差异化卖点", content: "四分钟快速上妆、油皮适配", count: "各 1 次", compliance: "符合场景植入要求" },
  ],
};

// ─── 图文笔记：Brief ──────────────────────────────────────

export const mockGraphicBrief: VideoBrief = {
  confirmedParams: [
    { label: "商品名称", value: "花漾柔光持妆气垫" },
    { label: "价格", value: "¥129（日常价¥169）" },
    { label: "品类", value: "美妆 · 底妆" },
    { label: "目标平台", value: "小红书" },
    { label: "图片数量", value: "6 张" },
    { label: "笔记风格", value: "真实测评型" },
    { label: "特殊要求", value: "需要对比图" },
  ],
  sellingPoints: {
    core: ["控油持妆 12 小时", "微米级粉体不卡粉", "SPF50+ 高倍防晒"],
    secondary: ["玻尿酸保湿不拔干", "烟酰胺提亮肤色"],
    differentiated: ["四分钟快速上妆", "油皮亲妈", "附赠 15g 替换芯"],
  },
  audience: {
    age: "18-30 岁",
    identity: "大学生 / 职场新人，关注美妆护肤，活跃于小红书",
    painPoints: "底妆午后脱妆、卡粉浮粉、选气垫踩雷",
    preference: "看真实测评和对比图，偏好性价比高的国货",
  },
  directions: [
    {
      title: "真实测评型",
      storyType: "实测对比",
      overview: "12 小时真实跟妆实测，配前后对比图和 T 区特写，用数据说话",
      hook: "油皮亲妈！花漾气垫 12 小时实测，下午 5 点 T 区居然还在！",
    },
    {
      title: "日常分享型",
      storyType: "生活记录",
      overview: "以日常上班化妆场景切入，自然安利产品，有生活感",
      hook: "上班族的 4 分钟底妆，这个气垫我已经回购第三盒了",
    },
    {
      title: "成分党科普型",
      storyType: "知识科普",
      overview: "从微米级粉体、玻尿酸成分切入，讲清楚为什么好用",
      hook: "为什么这款气垫能做到 12 小时不脱妆？一个美妆博主的成分分析",
    },
  ],
  recommendIndex: 0,
};

// ─── 图文笔记：完整笔记数据 ──────────────────────────────

export interface NoteImagePlan {
  order: string;
  content: string;
  shootingTip: string;
}

export interface GraphicNoteData {
  title: string;
  subtitle: string;
  style: string;
  body: { section: string; content: string }[];
  images: NoteImagePlan[];
  tags: string[];
  sellingPointChecks: SellingPointCheck[];
}

export const mockGraphicNote: GraphicNoteData = {
  title: "油皮亲妈！花漾气垫12小时实测，下午5点T区居然还在！",
  subtitle: "油皮翻身！",
  style: "真实测评型",
  body: [
    {
      section: "开头 · Hook",
      content: "姐妹们我真的要疯了！！！\n作为一个大油田，这辈子最大的痛苦就是早上化完妆，中午照镜子就想哭——T区浮粉、鼻翼卡粉、底妆斑驳得像面具\n直到我闺蜜硬塞给我这个花漾柔光持妆气垫，说能持妆12小时？？？\n我当时：骗鬼呢！\n结果......",
    },
    {
      section: "中段 · 产品体验",
      content: "先说上脸感受：微米级粉体是真的细腻！用粉扑轻拍，完全不卡粉不假面，皮肤马上有那种自然的柔光感\n\n重点来了：\n· 控油持妆12小时 — 我早上8点上妆，下午5点拍了对比图（看图3），T区居然还是清爽的！！\n· SPF50+防晒 — 早上涂了这个就不用额外涂防晒，懒人福音\n· 玻尿酸+烟酰胺 — 控油但不拔干，还悄悄提亮了肤色\n\n四分钟就能搞定全脸底妆，赶时间的姐妹真的懂！",
    },
    {
      section: "收尾 · CTA",
      content: "总结：\n这是我用过的气垫里，对油皮最友好的，没有之一。现在活动价只要129元，还送15g替换芯，等于两盒的量！日常价169，真的别犹豫了。\n\n链接放评论区了，姐妹们冲！",
    },
  ],
  images: [
    { order: "封面", content: "左右对比：旧气垫脱妆 vs 花漾 12 小时后", shootingTip: "自然光，怼脸拍，左右分屏" },
    { order: "图2", content: "花漾气垫开盖特写 + 粉扑质感", shootingTip: "45° 俯拍，浅色背景" },
    { order: "图3", content: "12 小时对比图：早 8 点 vs 下午 5 点 T 区特写", shootingTip: "同角度同光线拍摄" },
    { order: "图4", content: "上妆过程：粉扑拍打全脸", shootingTip: "镜前自拍，展示手法" },
    { order: "图5", content: "纸巾按压 T 区验证 — 无浮粉无油迹", shootingTip: "特写纸巾 + 脸部" },
    { order: "图6", content: "正装 + 替换芯套装 + 价格标注", shootingTip: "平铺摆拍，标注到手价" },
  ],
  tags: ["#花漾气垫", "#油皮气垫推荐", "#持妆测试", "#底妆推荐", "#国货气垫", "#花知晓", "#控油持妆", "#油皮亲妈"],
  sellingPointChecks: [
    { type: "核心卖点 1", content: "控油持妆 12 小时", count: "3 次", compliance: "符合≥2 处呈现要求" },
    { type: "核心卖点 2", content: "微米级粉体不卡粉", count: "2 次", compliance: "符合≥2 处呈现要求" },
    { type: "核心卖点 3", content: "SPF50+ 高倍防晒", count: "1 次", compliance: "符合≥1 处呈现要求" },
    { type: "次要卖点", content: "玻尿酸保湿、烟酰胺提亮", count: "各 1 次", compliance: "符合≤1 处呈现要求" },
    { type: "差异化卖点", content: "四分钟快速上妆、油皮适配", count: "各 1 次", compliance: "符合场景植入要求" },
  ],
};
