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
    prompt: "收到产品信息！我分析了这款隐形蓝牙耳机的核心卖点。你觉得视频最该主打哪个方向？",
    cards: [
      {
        text: "极致隐形 · 视觉冲击：开场用普通耳机 vs 隐形耳机的强对比，让观众第一秒就被「看不见的耳机」震撼。核心画面：耳朵特写，观众找不到耳机在哪。",
        keywords: ["隐形", "对比", "视觉冲击", "耳朵特写"],
      },
      {
        text: "防水硬核测试：直接把耳机放水龙头下冲，从泳池里捞出来还能用。用真实测试画面制造「不可能」的感觉，评论区会疯狂讨论。",
        keywords: ["防水", "测试", "硬核", "讨论度"],
      },
      {
        text: "生活场景覆盖：健身、通勤、睡觉、做饭…展示耳机融入日常每个瞬间。观众看完觉得「每个场景我都需要」，降低决策门槛。",
        keywords: ["场景", "日常", "覆盖", "需求感"],
      },
    ],
    adjustPrompt: "选得好！想微调吗？比如「多加防水测试」「突出性价比」，随便说～",
  },
  {
    prompt: "方向定了！视频的内容风格你更偏好哪种？",
    cards: [
      {
        text: "UGC真人出镜：一个人对着镜头自然分享，手持产品边说边演。像朋友推荐一样亲切，TikTok/抖音完播率最高的形式。适合30-60秒。",
        keywords: ["UGC", "真人", "自然", "高完播"],
      },
      {
        text: "产品特写+旁白：全程产品微距特写+画面切换，旁白解说卖点。画面质感高、制作精良。适合品牌调性强的投放，45-90秒。",
        keywords: ["特写", "旁白", "质感", "品牌"],
      },
      {
        text: "剧情反转型：短剧情 + 产品植入。「朋友嘲笑我的耳机太丑→亮出隐形耳机→全员真香」。有故事性，适合传播和二次创作，60秒左右。",
        keywords: ["剧情", "反转", "真香", "传播"],
      },
    ],
    adjustPrompt: "想调整什么？比如「时长短一点」「加个开箱环节」，没有就跳过～",
  },
  {
    prompt: "最后确认一下转化策略和钩子设计：",
    cards: [
      {
        text: "价格锚定型：先展示同类产品均价$49-79，再亮出本品$29.99。配合「Today only」限时感，制造「不买就亏了」的冲动。结尾强引导点击链接。",
        keywords: ["价格", "锚定", "限时", "冲动"],
      },
      {
        text: "功能叠加型：每5秒揭露一个新功能（隐形→防水→降噪→长续航→舒适），层层递进，观众一直有「还有？！」的惊喜感。最后一句「And it's only $29.99」。",
        keywords: ["功能", "叠加", "惊喜", "递进"],
      },
      {
        text: "社会证明型：穿插真实评论截图/用户反馈/销量数据。「Already sold 100K+ units」「4.8 stars with 10K reviews」。用数据建立信任，降低购买焦虑。",
        keywords: ["社会证明", "评论", "数据", "信任"],
      },
    ],
    adjustPrompt: "最后还想补充什么？比如「结尾加紧迫感」「强调多色可选」，没有的话我开始整理视频策略了～",
  },
];

// ─── 设定确认卡片（视频策略Brief） ──────────────────────

export const marketingMockSettings: Record<string, { label: string; value: string }[]> = {
  "产品信息": [
    { label: "产品名称", value: "Wireless Bluetooth Headset · 隐形蓝牙耳机" },
    { label: "核心卖点", value: "极致隐形 · IPX5防水 · 主动降噪 · 36H续航" },
    { label: "价格", value: "$29.99（竞品均价$49-79）" },
    { label: "目标人群", value: "18-35岁，追求便携和性价比的年轻用户" },
  ],
  "视频策略": [
    { label: "时长", value: "40秒" },
    { label: "风格", value: "UGC真人出镜 · 自然分享" },
    { label: "平台", value: "TikTok" },
    { label: "语言", value: "英文口语" },
  ],
  "角色与转化": [
    { label: "出镜角色", value: "Jimmy · 20-30岁男性 · 休闲穿搭" },
    { label: "开篇策略", value: "视觉对比 · 普通耳机 vs 隐形耳机" },
    { label: "转化策略", value: "功能叠加 + 价格锚定" },
    { label: "CTA", value: "Link in bio · 限时优惠" },
  ],
};

// ─── 世界观轮次（故事线设计） ──────────────────────────

export const marketingWorldbuildingRounds: InspirationRound[] = [
  {
    prompt: "视频策略确认！接下来设计故事线。开篇你希望用什么钩子抓住观众？",
    cards: [
      {
        text: "产品对比开场：第一个画面左手普通耳机、右手隐形耳机，一句「Normal earbud, invisible earbud」直接点题。3秒内建立核心认知。",
        keywords: ["对比", "点题", "3秒", "认知"],
      },
      {
        text: "痛点场景开场：主人公戴着大耳机跑步掉落/睡觉硌耳朵/打电话被人看到，然后「Until I found this…」转折亮出产品。",
        keywords: ["痛点", "场景", "转折", "代入"],
      },
      {
        text: "结果前置开场：直接展示耳机戴上后「看不见」的效果，观众一头雾水：「Wait, where's the earbud?」然后揭秘产品。好奇心驱动完播。",
        keywords: ["结果前置", "悬念", "好奇心", "完播"],
      },
    ],
    adjustPrompt: "钩子想调整吗？比如「再短一点」「加个文字弹幕」，或者跳过～",
  },
  {
    prompt: "钩子定了！中间核心演示环节你想怎么安排？",
    cards: [
      {
        text: "功能逐个击破：隐形→防水→降噪→舒适度，每个功能一个画面，节奏紧凑。字幕同步标注每个卖点，静音也能看懂。",
        keywords: ["逐个击破", "紧凑", "字幕", "卖点"],
      },
      {
        text: "场景串联型：健身房（防汗）→ 地铁（降噪）→ 床上（舒适）→ 淋浴（防水）。用场景代替纯功能介绍，更有画面感和代入感。",
        keywords: ["场景串联", "画面感", "代入", "多场景"],
      },
      {
        text: "极限测试型：把防水做成「挑战」——水龙头冲10秒、扔进水杯、跑步机上狂甩。「I can't believe it still works」制造惊叹感。",
        keywords: ["极限", "挑战", "惊叹", "测试"],
      },
    ],
    adjustPrompt: "演示方式想调整什么？比如「加入降噪对比音效」「场景再多一个」，没有就跳过～",
  },
  {
    prompt: "核心演示很有看点！最后确认结尾的转化收口：",
    cards: [
      {
        text: "价格揭晓+紧迫感：「And guess what? It's not $50, not $40… it's only $29.99. But only for today.」配合价格字幕动画和倒计时。",
        keywords: ["价格揭晓", "紧迫感", "倒计时", "字幕"],
      },
      {
        text: "多色展示+引导：展示3种颜色选择，「Pick your color」，然后「Link in my bio, grab yours before it's gone」。视觉丰富+明确CTA。",
        keywords: ["多色", "CTA", "视觉", "引导"],
      },
      {
        text: "用户评价收口：切入3-4条真实评价截图，「10K+ five star reviews can't be wrong」。社会证明收尾，最后「Link in bio」。",
        keywords: ["评价", "社会证明", "五星", "信任"],
      },
    ],
    adjustPrompt: "转化收口还想调什么？比如「加个赠品信息」「再强调一下价格」，没有的话我开始生成故事线了～",
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
  summary: "40秒UGC风格TikTok带货视频。真人出镜对比开场，功能逐个击破，价格锚定+多色展示收口。目标：3秒抓住注意力，30秒建立信任，最后10秒促成转化。",
  timeline: "0-5s 对比钩子 → 5-14s 痛点+隐形演示 → 14-18s 防水测试 → 18-27s 降噪+舒适度 → 27-32s 多色展示 → 32-40s 价格揭晓+CTA",
  scenes: [
    { name: "开场 · 对比钩子", description: "左手普通耳机右手隐形耳机，一句话点题。灰色卫衣，光线自然，家居背景。" },
    { name: "痛点 · 共鸣", description: "展示普通耳机的问题（大、显眼、不舒服），表情略不满，制造「我也是」的认同感。" },
    { name: "防水 · 硬核演示", description: "水龙头下冲洗耳机，特写水流，抬头惊喜表情：「It still works!」" },
    { name: "降噪 · 场景展示", description: "地铁/咖啡厅嘈杂环境，戴上耳机世界安静。用音效对比表现降噪效果。" },
    { name: "舒适 · 侧躺演示", description: "侧躺在床上，展示耳机不硌耳朵。轻松自然的表情，「Even while sleeping」。" },
    { name: "收口 · 价格+CTA", description: "展示3种颜色，价格字幕动画弹出，「Link in bio」手指向下指。" },
  ],
  socialEcology: [
    "TikTok算法偏好：前3秒高停留 + 完播率 + 互动（评论问链接）",
    "评论区预埋策略：安排3-5条「Link?」「Where to buy?」「Just ordered!」",
    "发布时间建议：美东时间 7-9AM 或 7-10PM",
    "话题标签：#invisibleearbuds #tiktokmademebuyit #techreview #amazonfinds",
  ],
  hiddenClues: [
    "对比开场的3秒完播率决定了整条视频的流量级别",
    "防水测试环节是评论区讨论度最高的部分，会带来自然互动",
    "价格揭晓要放在功能叠加之后，观众已认可价值再看价格 = 超值感",
    "多色展示不只是展示颜色，更是在暗示「选一个」的行动指令",
  ],
};

// ─── 角色轮次（出镜角色设定） ──────────────────────────

export const marketingCharacterRounds: InspirationRound[] = [
  {
    prompt: "故事线完成！接下来确定出镜角色。你希望主出镜者是什么样的？",
    cards: [
      {
        text: "邻家男生型 · Jimmy：20-25岁，灰色卫衣+牛仔裤，干净短发。说话自然不做作，像在跟朋友分享好物。TikTok最受欢迎的UGC风格。",
        keywords: ["邻家", "自然", "20s", "UGC风格"],
      },
      {
        text: "科技博主型 · Alex：25-30岁，黑色简约穿搭，戴眼镜。表达专业有条理，会用数据和对比说服人。适合测评向内容，转化率高。",
        keywords: ["科技", "专业", "数据", "测评"],
      },
      {
        text: "运动达人型 · Ryan：22-28岁，运动装，身材健硕。在健身房/户外场景中展示产品，自带活力感。适合强调防水防汗和运动场景。",
        keywords: ["运动", "活力", "健身", "户外"],
      },
    ],
    adjustPrompt: "想调整出镜人设吗？比如「换成女性角色」「再年轻一点」，或者跳过～",
  },
  {
    prompt: "角色定了！表演风格和台词怎么设计？",
    cards: [
      {
        text: "口语自然型：像跟朋友FaceTime一样说话。会用「Honestly」「What shocked me」「You guys need this」等TikTok高频表达。不读稿，有自然停顿和表情变化。",
        keywords: ["口语", "自然", "TikTok", "不读稿"],
      },
      {
        text: "快节奏激情型：语速1.3倍，每句话都在传递信息。「Listen. This earbud? Invisible. Waterproof. Noise cancelling. AND only $30.」短句轰炸，信息密度高。",
        keywords: ["快节奏", "短句", "信息密", "激情"],
      },
      {
        text: "故事叙述型：用第一人称讲述发现产品的过程。「I've been looking for the perfect earbud for years…」有情感弧线，观众跟着一起经历从痛点到解决的旅程。",
        keywords: ["叙述", "第一人称", "情感", "旅程"],
      },
    ],
    adjustPrompt: "表演风格想调整什么？比如「加点幽默」「语速再快一点」，或者跳过～",
  },
  {
    prompt: "很有画面感！最后确认辅助元素：",
    cards: [
      {
        text: "字幕强化型：每个卖点都有大字幕弹出（Invisible ✓ / Waterproof ✓ / Only $29.99）。TikTok 80%用户静音观看，字幕是必须的。",
        keywords: ["字幕", "弹出", "静音", "必须"],
      },
      {
        text: "画中画型：主画面出镜+角落小窗展示产品特写/测试画面。信息量翻倍，观众同时看到人和产品，不需要频繁切镜。",
        keywords: ["画中画", "双视角", "信息量", "特写"],
      },
      {
        text: "极简纯净型：不加额外特效，只有人+产品+自然光。让产品本身说话，「少即是多」。适合高端定位或追求真实感的内容。",
        keywords: ["极简", "纯净", "真实", "高端"],
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
    name: "出镜者 · Jimmy",
    identity: "20-25岁男性，普通大学生/年轻上班族形象",
    appearance: "灰色卫衣+牛仔裤，干净短发，不化妆。整体就是「屏幕里的朋友」",
    personality: "自然不做作，像在跟朋友分享好物。会用TikTok高频口语表达，有适度的惊喜感和真诚感",
    background: "说到关键卖点时会不自觉凑近镜头，展示产品时手势自然。核心策略：不是在「卖货」，而是在「分享一个自己真心喜欢的东西」",
  },
  maleLead: {
    name: "产品 · 隐形蓝牙耳机",
    identity: "Wireless Bluetooth Headset · 核心SKU",
    appearance: "纯白/纯黑/深蓝三色可选，豆状造型，光泽感好。在自然光下质感最佳",
    personality: "科技感+极致小巧，每次出场都要让观众惊叹「这么小？」",
    background: "每次出场都配合慢动作或特写，强调「隐形」和「精致」。产品在画面中的占比要小——越小越能强调「隐形」卖点",
  },
  supporting: [
    { name: "字幕系统", role: "信息传达", desc: "每个核心卖点用白色粗体弹出，价格用黄色/红色突出。确保静音观看也能获取80%信息" },
    { name: "BGM", role: "节奏引导", desc: "选择TikTok热门轻快BGM，节拍与切镜节奏同步。音量控制在口播的30%-40%" },
    { name: "场景/道具", role: "可信度", desc: "家居背景（真实感）、水龙头（防水测试）、普通耳机（对比道具）。所有道具为展示功能服务" },
  ],
  relationships: "Jimmy × 产品：真实用户的自然推荐关系\n字幕 × 口播：互补关系，口播讲感受，字幕强化数据\nBGM × 节奏：踩点切镜，音乐驱动观看节奏",
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
  structure: "钩子→痛点→功能演示×3→转化收口",
  totalChapters: 6,
  estimatedWords: "40秒 · 6个分幕",
  chapters: [
    { title: "分幕1 · 开篇钩子与对比", summary: "左手普通耳机，右手隐形耳机。「Normal earbud, invisible earbud. See the difference?」表情从平淡到自信。", keyEvent: "0-5s · 视觉对比吸引注意力" },
    { title: "分幕2 · 痛点触达", summary: "展示普通耳机的问题：大、显眼、运动容易掉。「Honestly, the biggest difference isn't just the size…」表情不满→转折。", keyEvent: "5-14s · 制造共鸣引发焦虑" },
    { title: "分幕3 · 防水演示", summary: "水龙头下冲洗耳机特写。拿起来塞入耳朵，音乐响起。「What shocked me was… fully waterproof.」", keyEvent: "14-18s · 硬核测试制造惊叹" },
    { title: "分幕4 · 降噪与保护", summary: "嘈杂场景→戴上耳机→世界安静。展示降噪效果，手势比划音量下降。「Fully noise cancelling, protect your hearing.」", keyEvent: "18-27s · 场景演示功能价值" },
    { title: "分幕5 · 舒适度与设计", summary: "侧躺在沙发上，展示耳机不硌。手指触碰耳机几乎看不到。「You can even wear these while laying down.」", keyEvent: "27-32s · 舒适卖点+隐形再强调" },
    { title: "分幕6 · 转化号召", summary: "展示三种颜色，价格字幕弹出。「Three colors, $29.99, and trust me — you NEED this. Link in bio.」", keyEvent: "32-40s · 多色+价格+强CTA" },
  ],
};

// ─── 正文 mock（分幕脚本详细） ──────────────────────────

export const marketingMockChapterTexts: Record<number, string> = {
  0: `【分幕1 · 开篇钩子与对比】0-5s

场景：室内，自然光，简洁背景
镜头：中景，Jimmy面对镜头

画面描述：
Jimmy穿灰色卫衣，左手举起普通白色有线耳机，右手举起隐形蓝牙耳机。
表情从随意→自信微笑。

台词（英文口语）：
"Normal earbud—"（举左手）
"Invisible earbud."（举右手，停顿0.5秒）
"See the difference?"（微笑，挑眉）

字幕：Normal earbud 🎧 → Invisible earbud 👀
BGM：轻快电子节拍起，音量30%
技巧标注：对比修辞 + 反问钩子，3秒内建立核心概念`,

  1: `【分幕2 · 痛点触达】5-14s

场景：同一环境，镜头略推近
镜头：中近景→特写

画面描述：
Jimmy拿着普通耳机，表情略显不满。
展示：耳机线缠绕、运动时滑落（模拟动作）、在耳朵上很明显。
然后拿起隐形耳机，表情转变。

台词（英文口语）：
"Honestly, the biggest difference isn't just the size."
（拿起隐形耳机放到耳朵里）
"It's that nobody can even tell you're wearing one."
（转头展示侧面，耳机几乎不可见）

字幕：Nobody can tell you're wearing one 👀
技巧标注：痛点共鸣→解决方案，情绪由负转正`,

  2: `【分幕3 · 防水演示】14-18s

场景：浴室/厨房水龙头前
镜头：特写→中景

画面描述：
打开水龙头，将耳机直接放在水流下冲洗3秒。
慢动作特写水花飞溅。
拿起耳机甩掉水，塞入耳朵，手指点击播放。

台词（英文口语）：
"What shocked me was—"
（水龙头下冲洗，抬头看镜头）
"Fully waterproof. Like, actually waterproof."

字幕：IPX5 Waterproof 💦 Actually waterproof.
技巧标注：实际测试 > 口头承诺，视觉证明建立信任`,

  3: `【分幕4 · 降噪与保护】18-27s

场景：嘈杂环境（模拟街道/咖啡厅声音）→安静
镜头：中景→侧面特写

画面描述：
背景有模拟的嘈杂声（画面可加波纹特效）。
Jimmy戴上耳机，环境音瞬间消失（音效处理）。
Jimmy闭眼享受安静，然后微笑面对镜头。

台词（英文口语）：
"And it's also fully noise cancelling."
（戴上耳机的瞬间，背景音消失）
"Like the world just... goes quiet."
（手势比划安静）
"Protects your hearing too."

字幕：Noise Cancelling 🔇 World goes quiet.
技巧标注：声音对比制造感官体验，功能→情感价值升级`,

  4: `【分幕5 · 舒适度与设计】27-32s

场景：沙发/床上
镜头：侧面中景

画面描述：
Jimmy侧躺在沙发上，展示耳机贴合耳朵不突出。
手指触碰耳朵位置，几乎看不到耳机。
轻松自然的表情。

台词（英文口语）：
"You can even wear these while laying down."
（侧躺，指向耳朵）
"Zero pressure. Can't even feel it."

字幕：Sleep friendly 😴 Zero pressure
技巧标注：生活场景+舒适体验，消除「硌耳朵」顾虑`,

  5: `【分幕6 · 转化号召】32-40s

场景：回到开场环境，光线明亮
镜头：中景，产品特写穿插

画面描述：
展示三种颜色的耳机排列（白/黑/蓝）。
价格字幕动画弹出：$49→划掉→$29.99（红色放大）。
Jimmy微笑，手指向下指（指向Bio链接）。

台词（英文口语）：
"There's also three different color options."
（展示三色）
"And right now? It's only $29.99."
（价格字幕弹出）
"Trust me, you need this. Link in my bio."
（手指向下，坚定微笑）

字幕：🔥 Only $29.99 (Was $49.99) → Link in Bio 👇
技巧标注：多色=选择感（不是买不买，而是买哪色），价格锚定+紧迫感+明确CTA`,
};

// ─── 新流程：商品信息卡片 ──────────────────────────────────

export const marketingProductInfoCard: Record<string, { label: string; value: string }[]> = {
  "商品信息": [
    { label: "商品名称", value: "隐形蓝牙耳机 Pro" },
    { label: "价格", value: "¥199（日常价¥399）" },
    { label: "品类", value: "数码3C · 蓝牙耳机" },
    { label: "商品简介", value: "仅重3.8g的豆状隐形蓝牙耳机，佩戴后几乎看不到。IPX5防水、主动降噪、36小时超长续航，支持蓝牙5.3。" },
    { label: "目标用户", value: "18-35岁年轻用户，注重颜值和性价比，日常通勤、运动、睡眠场景使用" },
    { label: "核心卖点", value: "极致隐形（仅3.8g）· IPX5级防水 · 主动降噪 · 36H续航 · 蓝牙5.3" },
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
    title: "「隐形到底有多隐形」挑战测评",
    duration: "45秒",
    overview: "40秒UGC风格TikTok带货视频。真人出镜对比开场，功能逐个击破，价格锚定+多色展示收口。目标：3秒抓住注意力，30秒建立信任，最后10秒促成转化。",
    timeline: "0-5s 对比钩子 → 5-14s 痛点+隐形演示 → 14-18s 防水测试 → 18-27s 降噪+舒适度 → 27-32s 多色展示 → 32-40s 价格揭晓+CTA",
    structure: "钩子→痛点→卖点演示×3→价格揭晓→CTA",
    sections: [
      { title: "开篇钩子", desc: "街头随机测试：「猜猜我现在戴着耳机吗？」路人猜错→揭晓，制造悬念和互动感", duration: "0-5s" },
      { title: "痛点共鸣", desc: "快速展示普通耳机的三大痛点：太大太丑、运动掉落、睡觉硌耳朵", duration: "5-12s" },
      { title: "核心卖点演示", desc: "隐形演示（侧脸特写）→ 防水测试（水龙头冲洗）→ 降噪对比（街头→安静）", duration: "12-30s" },
      { title: "价格+促单", desc: "「原价399，今天直接199」价格字幕弹出 + 评论区置顶链接引导", duration: "30-40s" },
      { title: "结尾互动", desc: "「你觉得值吗？评论区告诉我」引导互动提升推荐权重", duration: "40-45s" },
    ],
  },
  live_script: {
    type: "live_script",
    typeLabel: "直播台本",
    title: "「爆款返场」隐形耳机专场话术",
    duration: "5分钟一轮",
    overview: "5分钟一轮的直播带货话术，真人出镜互动式讲解。以留人话术开场，逐步建立信任，逐一演示六大卖点，最后以限时限量促单收尾。目标：留住观众→建立信任→促成下单。",
    timeline: "0-30s 留人开场 → 30s-1min 建立信任 → 1-3min 产品讲解演示 → 3-4min 促单话术 → 4-5min 逼单收尾",
    structure: "留人→建信→说品→促单→逼单",
    sections: [
      { title: "留人话术", desc: "「刚进来的家人们先别走！这款耳机上次3000单10分钟抢光了，今天返场价比上次还低，先点个关注不迷路」" },
      { title: "建立信任", desc: "「我自己用了三个月，健身、通勤、睡觉全靠它。给你们看我的使用痕迹——这个磨损就是真实用出来的」" },
      { title: "产品讲解", desc: "逐一演示六大卖点：隐形佩戴（对镜头展示）、防水（现场倒水）、降噪（播放对比音频）、续航、蓝牙5.3、佩戴舒适度" },
      { title: "促单话术", desc: "「今天直播间专属价199，再送一个替换耳帽套装。库存只备了500单，卖完恢复399。点下面小黄车第一个链接」" },
      { title: "逼单话术", desc: "「已经300多单了，库存在掉。犹豫的家人们想想，少喝两杯奶茶就能用三年。3、2、1，上链接！」" },
    ],
  },
  graphic_note: {
    type: "graphic_note",
    typeLabel: "图文笔记",
    title: "「找了两年终于找到」真实安利帖",
    duration: "6张图+正文",
    overview: "小红书图文种草笔记，以真实用户分享口吻撰写。封面+产品展示+场景体验+对比测评+正文+购买引导，6图配长文，打造「素人真实安利」的可信感。目标：吸引点击→建立共鸣→引导购买。",
    timeline: "封面标题（吸引点击）→ 产品展示（视觉种草）→ 场景体验×3（代入感）→ 对比测评（理性决策）→ 正文（情感共鸣）→ 购买引导（转化收口）",
    structure: "封面标题→产品展示→场景体验→对比测评→价格信息→购买引导",
    sections: [
      { title: "封面图+标题", desc: "封面：耳朵侧脸特写（看不到耳机）\n标题：「找了两年的隐形耳机终于被我找到了！戴上真的看不见」\n标签：#隐形耳机 #蓝牙耳机推荐 #数码好物" },
      { title: "产品展示图", desc: "耳机开箱摆拍 + 手掌对比大小（突出小巧）+ 三色展示" },
      { title: "场景体验图", desc: "三张场景图：通勤地铁上（降噪）、跑步（防水防汗）、侧躺看手机（舒适不硌）" },
      { title: "对比图", desc: "与AirPods/其他热门耳机的大小、价格、功能对比表格" },
      { title: "正文文案", desc: "以第一人称「种草体」写作：入手原因→真实使用一周体验→优缺点坦诚分享→适合人群总结" },
      { title: "购买引导", desc: "「链接放评论区了！现在199还送耳帽，真的可以冲」+ 评论区置顶链接" },
    ],
  },
};
