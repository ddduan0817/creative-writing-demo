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
    { label: "商品名称", value: "隐形蓝牙耳机 Pro" },
    { label: "价格", value: "¥199（日常价¥399）" },
    { label: "品类", value: "数码3C · 蓝牙耳机" },
    { label: "目标平台", value: "抖音" },
    { label: "视频时长", value: "60s" },
    { label: "视频风格", value: "反转型" },
    { label: "目标人群", value: "18-35岁年轻用户，追求便携和性价比" },
  ],
  sellingPoints: {
    core: ["极致隐形（仅3.8g，佩戴后几乎不可见）", "IPX5级防水（水龙头冲洗不损坏）", "主动降噪（环境音一键屏蔽）"],
    secondary: ["36小时超长续航", "蓝牙5.3低延迟", "3色可选（白/黑/蓝）", "佩戴舒适不硌耳"],
    differentiated: ["豆状造型——市面最小的主动降噪耳机", "199元价位唯一同时具备防水+降噪+隐形三大特性"],
  },
  audience: {
    age: "18-35岁",
    identity: "通勤族 / 运动爱好者 / 学生，日常需要长时间佩戴耳机",
    painPoints: "传统耳机太大太显眼、运动时容易掉落、睡觉硌耳朵、下雨/出汗担心损坏",
    preference: "追求高性价比、看重真实使用效果、易被场景化内容种草",
  },
  directions: [
    {
      title: "方向1：日常翻车逆袭型",
      storyType: "场景反转",
      overview: "主人公展示普通耳机的各种尴尬瞬间（太大、掉落、硌耳朵），一句「Until I found this…」转折亮出隐形耳机，逐一演示隐形、防水、降噪功能，最后价格揭晓制造惊喜。",
      hook: "「你还在戴这种耳机？难怪别人一直看你」",
    },
    {
      title: "方向2：极限测试打脸型",
      storyType: "硬核对比反转",
      overview: "开头声称「这耳机能防水？我不信」，然后进行一系列极限测试——水龙头冲洗、跑步机狂甩、侧躺压耳。每次测试后耳机完好，主人公表情从怀疑到震惊到真香。",
      hook: "「我赌100块这耳机扛不住水龙头」",
    },
    {
      title: "方向3：朋友安利反转型",
      storyType: "社交互动反转",
      overview: "朋友吐槽主人公的耳机又大又丑，拿出隐形耳机现场安利。主人公从嫌弃到试戴后「看不见？？」的惊讶，再到了解价格后秒下单。全程自然对话，像真实安利。",
      hook: "「你这耳机也太丑了吧——看看我这个」",
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
  title: "花知晓柔光持妆气垫 · 短视频脚本",
  duration: "60s",
  style: "反转型 · 真人出镜",
  characters: [
    { name: "女主", description: "25 岁职场白领，油皮，日常赶时间化妆，对持妆效果有高要求，自带「吐槽体质」" },
  ],
  scenePlans: [
    { sceneNo: 1, location: "卧室", timeSpace: "日 / 内", purpose: "早上赶时间化妆，展示旧气垫翻车效果" },
    { sceneNo: 2, location: "办公室", timeSpace: "日 / 内", purpose: "下午工作场景，展示花知晓气垫 12 小时持妆效果" },
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
      productExposure: "花知晓柔光持妆气垫（镜头扫过）",
      visual: "女主看到桌上的花知晓气垫，拿起晃了晃，满脸怀疑",
      dialogue: "\"直到我闺蜜硬塞给我这个花知晓气垫，说能持妆 12 小时？我才不信，今天就测给你们看！\"",
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
      productExposure: "花知晓气垫（补妆过程）",
      visual: "女主掏出花知晓气垫，快速拍打全脸，微米级粉体均匀覆盖卡粉处，皮肤呈现自然柔光质感",
      dialogue: "\"再看看花知晓的，微米级粉体，上脸完全不卡粉，还带 SPF50+ 高倍防晒，早上涂了都不用额外涂防晒！\"",
      sellingPoint: "核心卖点②：微米级粉体不卡粉 + 核心卖点③：SPF50+",
    },
    {
      act: 5,
      heading: "5 办公室 日 内",
      characters: ["女主"],
      duration: "40-50s",
      productExposure: "花知晓气垫（12 小时持妆效果）",
      visual: "女主展示 12 小时后的底妆，T 区依然清爽无脱妆，皮肤透亮，用纸巾按压 T 区无油迹",
      dialogue: "\"现在已经 12 小时了！你看，还是这么服帖，控油持妆真的绝，玻尿酸保湿也不拔干，烟酰胺还能悄悄提亮肤色！\"",
      sellingPoint: "次要卖点：玻尿酸保湿 + 烟酰胺提亮",
    },
    {
      act: 6,
      heading: "6 办公室 日 内",
      characters: ["女主"],
      duration: "50-60s",
      productExposure: "花知晓气垫（正装 + 替换芯）、价格弹窗",
      visual: "女主拿着花知晓气垫，旁边展示正装 + 15g 替换芯，屏幕弹出价格：「到手价 129 元（日常价 169 元）」",
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
  title: "花知晓柔光持妆气垫 · 分镜表",
  targetDuration: 60,
  totalDuration: 60,
  shots: [
    { shotNo: 1, act: 1, shotSize: "特写", cameraMove: "推镜", visual: "女主手指沾着旧气垫粉膏，T区卡粉结块的皮肤纹理清晰可见", audioDialogue: "女主：\"说真的，所有气垫都逃不过下午脱妆，我已经放弃了...\"\n音效：无奈叹气声", duration: 5, productExposure: "旧气垫（部分）" },
    { shotNo: 2, act: 2, shotSize: "近景", cameraMove: "固定", visual: "女主拿起桌上的花知晓气垫，镜头聚焦气垫外壳的品牌logo，女主满脸怀疑地挑眉", audioDialogue: "女主：\"直到我闺蜜硬塞给我这个花知晓气垫，说能持妆12小时？我才不信，今天就测给你们看！\"\n音效：疑惑语气词\"嗯？\"", duration: 10, productExposure: "花知晓柔光持妆气垫（完整）" },
    { shotNo: 3, act: 3, shotSize: "特写", cameraMove: "固定", visual: "手机前置摄像头画面，女主T区斑驳脱妆，鼻翼卡粉结块，手指蹭下浮粉", audioDialogue: "女主：\"你看，这才3小时，旧气垫已经成这样了，斑驳到能当面具！\"\n音效：嫌弃的\"啧\"声", duration: 8, productExposure: "旧气垫脱妆效果（无产品露出）" },
    { shotNo: 4, act: 4, shotSize: "中景", cameraMove: "跟拍", visual: "女主快速打开花知晓气垫，粉扑沾取粉体，镜头特写微米级细腻粉质", audioDialogue: "旁白：\"微米级粉体，上脸完全不卡粉！\"\n音效：粉扑拍打皮肤的轻响", duration: 7, productExposure: "花知晓气垫（粉芯+粉扑）" },
    { shotNo: 5, act: 4, shotSize: "近景", cameraMove: "固定", visual: "女主用粉扑快速拍打全脸，卡粉处被均匀覆盖，皮肤呈现自然柔光质感", audioDialogue: "女主：\"还带SPF50+高倍防晒，早上涂了都不用额外涂防晒！\"\n音效：轻快的背景音起", duration: 6, productExposure: "花知晓气垫（手持）" },
    { shotNo: 6, act: 5, shotSize: "特写", cameraMove: "固定", visual: "女主展示12小时后的底妆，T区清爽无油光，纸巾按压T区后无明显粉迹", audioDialogue: "女主：\"现在已经12小时了！你看，还是这么服帖，控油持妆真的绝！\"\n音效：惊讶的\"哇\"声", duration: 8, productExposure: "花知晓气垫（放置在桌面）" },
    { shotNo: 7, act: 5, shotSize: "近景", cameraMove: "拉镜", visual: "女主侧脸展示透亮底妆，镜头拉远露出桌上的花知晓气垫", audioDialogue: "女主：\"玻尿酸保湿不拔干，烟酰胺还能悄悄提亮肤色！\"", duration: 6, productExposure: "花知晓气垫（完整）" },
    { shotNo: 8, act: 6, shotSize: "中景", cameraMove: "固定", visual: "女主双手举着花知晓气垫，旁边特写正装+15g替换芯的套装，屏幕弹出价格弹窗", audioDialogue: "女主：\"现在到手价只要129元，还送15g替换芯，四分钟搞定全脸，油皮姐妹真的可以冲！点击下方小黄车购买！\"\n音效：急促的下单提示音", duration: 10, productExposure: "花知晓气垫（正装+替换芯）、价格弹窗" },
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
    { label: "商品名称", value: "花知晓柔光持妆气垫" },
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
  title: "花知晓柔光持妆气垫 · 直播台本",
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
      script: "家人们今天不废话！直接上我最近用空了两盒的气垫，花知晓柔光持妆气垫！我跟你们说，油皮姐妹今天一定要蹲住！",
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
      script: "我之前也是这样，试了好多气垫都不行，一到下午就脱妆。直到我闺蜜硬塞给我这个花知晓的气垫——说实话当时我也不信，12小时持妆？骗鬼呢！结果用了一次就真香了。",
      interaction: "「你们猜我用了多久被圈粉的？扣时间」",
      productExposure: "花知晓气垫出镜（手持展示）",
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
    { label: "商品名称", value: "花知晓柔光持妆气垫" },
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
      hook: "油皮亲妈！花知晓气垫 12 小时实测，下午 5 点 T 区居然还在！",
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
  title: "油皮亲妈！花知晓气垫12小时实测，下午5点T区居然还在！",
  subtitle: "油皮翻身！",
  style: "真实测评型",
  body: [
    {
      section: "开头 · Hook",
      content: "姐妹们我真的要疯了！！！\n作为一个大油田，这辈子最大的痛苦就是早上化完妆，中午照镜子就想哭——T区浮粉、鼻翼卡粉、底妆斑驳得像面具\n直到我闺蜜硬塞给我这个花知晓柔光持妆气垫，说能持妆12小时？？？\n我当时：骗鬼呢！\n结果......",
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
    { order: "封面", content: "左右对比：旧气垫脱妆 vs 花知晓 12 小时后", shootingTip: "自然光，怼脸拍，左右分屏" },
    { order: "图2", content: "花知晓气垫开盖特写 + 粉扑质感", shootingTip: "45° 俯拍，浅色背景" },
    { order: "图3", content: "12 小时对比图：早 8 点 vs 下午 5 点 T 区特写", shootingTip: "同角度同光线拍摄" },
    { order: "图4", content: "上妆过程：粉扑拍打全脸", shootingTip: "镜前自拍，展示手法" },
    { order: "图5", content: "纸巾按压 T 区验证 — 无浮粉无油迹", shootingTip: "特写纸巾 + 脸部" },
    { order: "图6", content: "正装 + 替换芯套装 + 价格标注", shootingTip: "平铺摆拍，标注到手价" },
  ],
  tags: ["#花知晓气垫", "#油皮气垫推荐", "#持妆测试", "#底妆推荐", "#国货气垫", "#花知晓", "#控油持妆", "#油皮亲妈"],
  sellingPointChecks: [
    { type: "核心卖点 1", content: "控油持妆 12 小时", count: "3 次", compliance: "符合≥2 处呈现要求" },
    { type: "核心卖点 2", content: "微米级粉体不卡粉", count: "2 次", compliance: "符合≥2 处呈现要求" },
    { type: "核心卖点 3", content: "SPF50+ 高倍防晒", count: "1 次", compliance: "符合≥1 处呈现要求" },
    { type: "次要卖点", content: "玻尿酸保湿、烟酰胺提亮", count: "各 1 次", compliance: "符合≤1 处呈现要求" },
    { type: "差异化卖点", content: "四分钟快速上妆、油皮适配", count: "各 1 次", compliance: "符合场景植入要求" },
  ],
};
