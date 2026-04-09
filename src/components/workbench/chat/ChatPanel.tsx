"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useEditorStore } from "@/stores/editorStore";
import {
  Send,
  Mic,
  Plus,
  FileUp,
  ImageIcon,
  AudioLines,
  Video,
  Star,
  Clock,
  RefreshCw,
  Heart,
  MessageSquare,
  ListChecks,
} from "lucide-react";
import {
  screenplayInspirationRounds,
  screenplayMockSettings,
  screenplayWorldbuildingRounds,
  screenplayMockWorldbuilding,
  screenplayCharacterRounds,
  screenplayMockCharacterCard,
  screenplayMockOutlineCard,
  screenplayMockChapterTexts,
} from "./screenplayMockData";
import {
  marketingInspirationRounds,
  marketingMockSettings,
  marketingWorldbuildingRounds,
  marketingMockWorldbuilding,
  marketingCharacterRounds,
  marketingMockCharacterCard,
  marketingMockOutlineCard,
  marketingMockChapterTexts,
  marketingProductInfoCard,
  marketingPlatforms,
  marketingContentByType,
} from "./marketingMockData";
import {
  knowledgeInspirationRounds,
  knowledgeMockSettings,
  knowledgeWorldbuildingRounds,
  knowledgeMockWorldbuilding,
  knowledgeCharacterRounds,
  knowledgeMockCharacterCard,
  knowledgeMockOutlineCard,
  knowledgeMockChapterTexts,
} from "./knowledgeMockData";

// ─── Mock Data ───────────────────────────────────────────────

interface InspirationCard {
  text: string;
  keywords: string[];
}

interface InspirationRound {
  prompt: string;
  cards: InspirationCard[];
  adjustPrompt: string;
}

const inspirationRounds: InspirationRound[] = [
  {
    prompt: "基于你的故事概念，我提炼了几个时空背景方向，你觉得哪个最适合这个故事？",
    cards: [
      {
        text: "南方古镇：依山傍水的千年古镇，青石板路、白墙黑瓦。手机信号时有时无，年轻人大多外出，留下老人和几个「不愿离开的怪人」。慢节奏治愈感十足。",
        keywords: ["现代", "言情", "治愈", "慢热"],
      },
      {
        text: "东南沿海小岛：与世隔绝的海边渔村，靠一条轮渡连接外界。海风、灯塔、渔船是日常背景，适合写孤独与陪伴的故事。",
        keywords: ["现代", "言情", "暗恋", "家庭"],
      },
      {
        text: "西南边陲小城：云雾缭绕的山间小城，少数民族文化交融。集市热闹、夜晚寂静，适合写文化碰撞与自我寻找的故事。",
        keywords: ["现代", "都市", "励志", "探险"],
      },
    ],
    adjustPrompt: "想微调什么？比如「换成北方小镇」「加入民国元素」之类的，或者直接跳过～",
  },
  {
    prompt: "时空确定了！再看看故事基调和情感节奏，你更想要哪种体验？",
    cards: [
      {
        text: "日常甜宠 · 慢热型：大量生活细节和温暖日常，从互相看不顺眼到每天偷偷给对方留饭。全镇居民看在眼里急在心里，结局HE高甜。",
        keywords: ["甜宠", "慢热", "欢喜冤家", "HE"],
      },
      {
        text: "治愈悬疑 · 双线型：明线是温暖的小镇生活和感情发展，暗线是失忆真相和过去的秘密。每几章一个反转，甜中带悬念。",
        keywords: ["治愈", "悬疑", "反转", "失忆"],
      },
      {
        text: "先虐后甜 · 情感型：前半段温暖日常铺垫感情，中段真相浮现信任崩塌，后段和解重逢。情感浓度高，虐完之后加倍甜。",
        keywords: ["虐恋", "反转", "青梅竹马", "HE"],
      },
    ],
    adjustPrompt: "如果想调整风格也可以说，比如「再轻松一点」「悬疑感强一些」，或者直接跳过～",
  },
  {
    prompt: "最后一步，关于核心冲突和故事驱动力：",
    cards: [
      {
        text: "失忆真相 × 身份秘密：失忆的真相不是意外，而是有人刻意为之。当主角想起一切，要在复仇和眼前的平静幸福之间做选择。",
        keywords: ["失忆", "复仇", "娱乐圈", "强弱"],
      },
      {
        text: "新旧生活的拉扯：过去的世界（名利场）不断入侵当下的平静。经纪人、旧爱、媒体轮番找上门，每次都考验主角的决心。",
        keywords: ["娱乐圈", "职场", "逆袭", "双强"],
      },
      {
        text: "守护与成全：男主早就知道女主的真实身份却选择沉默守护。当真相揭开，「善意的隐瞒」反而成了最大的信任危机。",
        keywords: ["暗恋", "家庭", "治愈", "开放式"],
      },
    ],
    adjustPrompt: "最后还想补充什么？比如「加入复仇线」「结局要开放式」，没有的话我来更新设定～",
  },
];

const inspirationRoundsAlt: InspirationRound[] = [
  {
    prompt: "基于你的故事概念，我提炼了几个时空背景方向，你觉得哪个最适合？",
    cards: [
      {
        text: "东南沿海渔镇：靠海的老渔镇，每天的海不一样。赶海、鱼市、海风咸涩，适合写味觉和感情一起复苏的故事。",
        keywords: ["现代", "言情", "治愈", "家庭"],
      },
      {
        text: "江南水乡古镇：小桥流水、乌篷船、梧桐巷弄。适合写安静细腻的治愈故事，烟雨朦胧中重新发现生活的美好。",
        keywords: ["现代", "言情", "慢热", "轻松"],
      },
      {
        text: "云南边陲小城：四季如春的高原小城，鲜花饼和过桥米线。适合写异域风情中的味觉觉醒和自我疗愈。",
        keywords: ["现代", "都市", "治愈", "探险"],
      },
    ],
    adjustPrompt: "想微调什么？比如「换成北方海港」「加入异国背景」之类的，或者直接跳过～",
  },
  {
    prompt: "方向不错！再看看故事基调和情感风格：",
    cards: [
      {
        text: "治愈日常 · 美食线：每一道甜品对应一段客人的往事，女主在帮别人找回「记忆中的味道」时，也在拼凑自己的过去。温暖治愈，结局HE。",
        keywords: ["治愈", "甜宠", "家庭", "HE"],
      },
      {
        text: "悬疑暗线 · 味觉谜题：味觉失灵不是意外——每恢复一种味道就揭开一层真相。明线甜品店日常，暗线步步逼近一个不愿面对的答案。",
        keywords: ["悬疑", "反转", "失忆", "烧脑"],
      },
      {
        text: "文艺抒情 · 双线叙事：现在时和回忆交替，海边和城市两条线逐渐交汇。用味道串联过去与现在，结局温暖但带一丝遗憾的释然。",
        keywords: ["暗恋", "慢热", "治愈", "开放式"],
      },
    ],
    adjustPrompt: "如果想调整也可以说，比如「更悬疑一些」「纯甜不虐」，或者直接跳过～",
  },
  {
    prompt: "最后确认核心冲突：",
    cards: [
      {
        text: "味觉背后的阴谋：失去味觉不是意外，而是有人下手。追查真相的过程会动摇女主对过去所有人际关系的信任。",
        keywords: ["复仇", "悬疑", "职场", "宿敌"],
      },
      {
        text: "留下还是回去：当味觉恢复、真相大白，米其林的世界重新向她敞开。是回到巅峰还是留在海边？两个世界不能兼得。",
        keywords: ["逆袭", "职场", "双强", "HE"],
      },
      {
        text: "平行治愈线：每位来店的客人都映射女主自己的困境。在治愈别人的过程中不知不觉也治愈了自己，核心冲突是「与自己和解」。",
        keywords: ["治愈", "励志", "家人", "HE"],
      },
    ],
    adjustPrompt: "还想补充什么？比如「加入职场竞争」「多一条复仇线」，没有的话我来更新设定～",
  },
];

// ─── Mock Settings Data (based on round selections) ─────────

const mockSettings: Record<string, { label: string; value: string }[]> = {
  "故事概念": [
    { label: "核心设定", value: "一位当红影后在事业巅峰突然失忆，被迫隐居南方小镇。没有聚光灯的日子里，她发现这里藏着她遗忘的童年和一段未完的缘分。" },
    { label: "故事基调", value: "甜宠日常，慢节奏温暖治愈。主角在小镇开了一家面馆，与隔壁沉默寡言的馆主从互相看不顺眼到每天给对方留饭，小镇居民看在眼里急在心里。" },
    { label: "故事走向", value: "明线甜恋暗线揭秘。当主角终于想起一切，要在复仇和眼前的幸福之间做选择。最终选择放下执念，用新的方式重新定义成功。" },
    { label: "核心冲突", value: "失忆真相 × 新旧生活的抉择 × 过去的伤害与当下的温暖" },
  ],
  "写作要素": [
    { label: "受众", value: "女频" },
    { label: "题材", value: "言情 · 都市" },
    { label: "时空", value: "现代" },
    { label: "剧情元素", value: "失忆 · 娱乐圈 · 治愈 · 美食" },
    { label: "人物关系", value: "欢喜冤家 · 青梅竹马" },
    { label: "风格调性", value: "甜宠 · 治愈 · 慢热" },
    { label: "结局", value: "HE" },
  ],
  "写作方式": [
    { label: "叙事视角", value: "第三人称" },
    { label: "叙事结构", value: "线性叙事（穿插记忆闪回）" },
    { label: "文风", value: "文艺抒情" },
    { label: "篇幅", value: "中长篇（8-15万字）" },
  ],
};

const mockSettingsAlt: Record<string, { label: string; value: string }[]> = {
  "故事概念": [
    { label: "核心设定", value: "天才甜点师因一场意外失去味觉，离开米其林餐厅后来到东南沿海小镇，开了一家只卖「记忆中的味道」的甜品店。" },
    { label: "故事基调", value: "悬疑治愈交织。每位来店的客人都带着往事，女主在帮别人找回味觉记忆的同时，也在拼凑自己失去的时光。" },
    { label: "故事走向", value: "双线叙事。味觉逐渐恢复的过程中发现失去味觉并非意外，而是有人刻意为之。最终在海边小镇找到真相与爱情。" },
    { label: "核心冲突", value: "味觉恢复 × 真相揭露 × 留在小镇还是重返巅峰 × 信任与背叛" },
  ],
  "写作要素": [
    { label: "受众", value: "女频" },
    { label: "题材", value: "言情 · 美食" },
    { label: "时空", value: "现代" },
    { label: "剧情元素", value: "美食 · 悬疑 · 治愈 · 海边" },
    { label: "人物关系", value: "日久生情 · 互相治愈" },
    { label: "风格调性", value: "文艺 · 悬疑 · 温暖" },
    { label: "结局", value: "HE" },
  ],
  "写作方式": [
    { label: "叙事视角", value: "第一人称" },
    { label: "叙事结构", value: "双线叙事（现实+味觉记忆闪回）" },
    { label: "文风", value: "细腻感性" },
    { label: "篇幅", value: "中篇（8-12万字）" },
  ],
};

// ─── Mock Worldbuilding Rounds ───────────────────────────────

const worldbuildingRounds: InspirationRound[] = [
  {
    prompt: "来完善世界观的细节吧！首先，故事发生的主要场景你更偏好哪种？",
    cards: [
      {
        text: "南方水乡古镇：依山傍水、青石板路、白墙黑瓦。手机信号时有时无，留下的都是老人和几个不愿离开的「怪人」。慢节奏，烟火气十足。",
        keywords: ["现代", "言情", "治愈", "轻松"],
      },
      {
        text: "山间避世小镇：四面环山的盆地小镇，常年云雾缭绕，只有一条公路通往外界。有天然温泉和百年茶园，像被时间遗忘的地方。",
        keywords: ["古代", "悬疑", "慢热", "架空"],
      },
      {
        text: "海边渔港小镇：东南沿海的老渔港，咸湿的海风、斑驳的灯塔、清晨出海的渔船。旺季会有零星的游客，淡季只剩自家人。",
        keywords: ["现代", "都市", "治愈", "探险"],
      },
    ],
    adjustPrompt: "想微调什么？比如「加个竹林」「镇上要有集市」之类的，或者跳过继续～",
  },
  {
    prompt: "很有画面感！核心活动场所你更喜欢哪种组合？",
    cards: [
      {
        text: "烟火美食线：女主的面馆「一碗春」+ 男主的中医馆「济世堂」+ 镇中心的百年古戏台。面香和药香隔墙混在一起，古戏台是全镇社交中心。",
        keywords: ["甜宠", "家庭", "青梅竹马", "HE"],
      },
      {
        text: "文艺慢生活：女主的旧书咖啡馆 + 男主的陶艺工作室 + 镇尾的老电影院。文艺气息浓厚，日常细节丰富，适合慢热叙事。",
        keywords: ["慢热", "暗恋", "治愈", "文艺抒情"],
      },
      {
        text: "自然治愈线：女主的山脚花店 + 男主的竹林茶舍 + 湖边的废弃小木屋。大量自然描写，四季轮转推动情节发展。",
        keywords: ["治愈", "种田", "轻松", "第三人称"],
      },
    ],
    adjustPrompt: "场景还想加什么？比如「后山要有个秘密基地」「再加一个赶集场景」，没有就跳过～",
  },
  {
    prompt: "最后确认一下小镇的人文氛围和暗线方向：",
    cards: [
      {
        text: "温暖人情味：热心的王婶当非官方媒人、每周日赶集全镇出动、「三巨头」聊天团八卦一切。暗线是女主童年曾在此生活，有人认出她但选择守护她的平静。",
        keywords: ["甜宠", "欢喜冤家", "搞笑", "线性叙事"],
      },
      {
        text: "表面平静暗流涌动：镇上每个人都有不为人知的过去，老一辈之间有未解的恩怨。失忆真相与十五年前一场事故有关，线索散落各处。",
        keywords: ["悬疑", "反转", "烧脑", "多线并行"],
      },
      {
        text: "世外桃源渐被打破：小镇像时间胶囊般宁静，直到外界的人（经纪人、记者）开始闯入。宁静与喧嚣的碰撞推动故事走向高潮。",
        keywords: ["逆袭", "复仇", "反套路", "倒叙"],
      },
    ],
    adjustPrompt: "还想补充什么？比如「隐藏线索再多一条」「氛围再温暖一点」，没有的话我来更新世界观～",
  },
];

// ─── Mock Worldbuilding Data ─────────────────────────────────

interface WorldbuildingScene {
  name: string;
  description: string;
}

interface WorldbuildingData {
  summary: string;
  timeline: string;
  scenes: WorldbuildingScene[];
  socialEcology: string[];
  hiddenClues: string[];
}

const mockWorldbuilding: WorldbuildingData = {
  summary: "当代中国南方小镇「清岚镇」——一个依山傍水的千年古镇，青石板路、白墙黑瓦，手机信号时有时无。年轻人大多外出谋生，留下的都是老人和几个「不愿离开的怪人」。",
  timeline: "故事跨越一年四季，从盛夏到次年初夏。四季变化推动情感发展：夏天相遇→秋天暧昧→冬天误会→春天和解→初夏告白。",
  scenes: [
    { name: "清岚镇·主街", description: "唯一的主街，两侧是各种老字号店铺。早上有赶早市的吆喝声，傍晚有归家的炊烟。街尾是一棵三百年的老榕树，树下有石桌石凳，是全镇的八卦中心。" },
    { name: "一碗春面馆", description: "女主盘下的老面馆，前店后院。院子里有棵百年老桂花树，秋天整条街都能闻到香气。面馆只卖六种面，每天限量，卖完就关门。" },
    { name: "济世堂中医馆", description: "男主经营的祖传中医馆，就在面馆隔壁。一墙之隔，药香和面香混在一起。男主话少但医术高明，半个镇子的人都找他看病。" },
    { name: "古戏台", description: "镇中心的百年老戏台，逢年过节唱戏。后来成了女主组织文艺汇演的舞台，也是两人关系转折的重要场所。戏台背后有一间废弃的化妆间，藏着女主童年的秘密。" },
    { name: "后山竹林", description: "镇子背后的大片竹林，有一条隐秘的小路通向山顶的废弃凉亭。这里是男主独处的地方，也是两人第一次敞开心扉的场所。" },
  ],
  socialEcology: [
    "镇上人际关系极其紧密，任何新鲜事半小时内全镇皆知",
    "每周日早上有赶集，是全镇最热闹的时候，也是获取信息的重要渠道",
    "镇长王婶是个爱管闲事的热心肠，暗中撮合各种姻缘，是推动主线的关键配角",
    "镇上有个「三巨头」聊天团：王婶、杂货店老张、茶馆陈老，他们的对话是读者了解小镇的窗口",
  ],
  hiddenClues: [
    "女主小时候在清岚镇生活过三年，镇上有人认出了她但选择沉默守护",
    "失忆的真相与一场十五年前的车祸有关，肇事者与女主的经纪人有关联",
    "男主的爷爷曾经是女主母亲的主治医生，两家有一段未了的恩情",
    "面馆的院子里埋着一个时间胶囊，是女主童年时亲手埋下的",
  ],
};

const mockWorldbuildingAlt: WorldbuildingData = {
  summary: "东南沿海的「潮音镇」——一个被遗忘的老渔港。咸湿的海风、斑驳的灯塔、清晨出海的渔船。年轻人走了大半，留下的老人们守着祖辈的船和海。镇上唯一的新东西，是海堤尽头那家突然开起来的甜品店。",
  timeline: "故事跨越半年，从深秋到次年春天。海的四季推动情感节奏：秋天初遇→冬天靠近→年关真相浮现→春天重新开始。",
  scenes: [
    { name: "潮音镇·海堤", description: "长长的石砌海堤，清晨有渔船归来，傍晚有老人垂钓。海堤尽头是废弃灯塔，被女主改成了甜品店的仓库。" },
    { name: "「一勺海」甜品店", description: "女主盘下的海边老屋，面朝大海。店名取自她仅存的一段味觉记忆——小时候偷吃的一勺海盐焦糖。" },
    { name: "渔港码头", description: "小镇的心脏，每天凌晨四点最先醒来。男主的渔船「归潮」号停在最里侧的泊位。" },
    { name: "灯塔旧址", description: "已停用三十年的老灯塔，内部保留着上世纪的航海记录和照片。是解开真相的关键场所。" },
  ],
  socialEcology: [
    "渔民之间有不成文的互助规矩，谁家有事全镇出动",
    "每月十五赶海市，是小镇难得热闹的日子",
    "码头旁的陈嫂鱼粥摊是情报中心，什么消息都能在这里听到",
    "镇上有个「灯塔守望会」的老人团体，成员都是退休渔民",
  ],
  hiddenClues: [
    "女主失去味觉的那场「意外」与一批有问题的食材有关",
    "男主三年前从远洋货轮辞职回乡捕鱼，镇上人都觉得奇怪",
    "灯塔里的航海记录中有一页被人撕掉了",
    "女主小时候来过这个镇，在灯塔里藏过一个玻璃瓶",
  ],
};

// ─── Mock Character Rounds ───────────────────────────────────

const characterRounds: InspirationRound[] = [
  {
    prompt: "来完善角色的细节吧！首先，女主角的性格倾向你更偏好哪种？",
    cards: [
      {
        text: "外柔内刚型：表面温柔随和，实则内心坚韧。失忆前在娱乐圈养成了察言观色的本能，失忆后反而展现出天然的亲和力。做面时专注认真，面馆被她经营得有声有色。",
        keywords: [],
      },
      {
        text: "毒舌傲娇型：嘴硬心软，失忆后依然保留了犀利和高标准。面馆经营得一丝不苟，对男主嘴上不饶人，行动却很诚实。生气时会多做一碗面摔在桌上。",
        keywords: [],
      },
      {
        text: "元气治愈型：失忆后像换了个人，开朗热情、对一切充满好奇。把面馆变成了小镇的社交中心，用美食治愈所有人。笑起来像清晨的阳光，但偶尔会在深夜突然安静下来。",
        keywords: [],
      },
    ],
    adjustPrompt: "想微调女主性格吗？比如「再强势一点」「加点文艺气质」，或者跳过继续～",
  },
  {
    prompt: "很有魅力！接下来看看男主角的人设方向：",
    cards: [
      {
        text: "沉默守护型：话少但行动力强，默默照顾女主却从不邀功。中医馆里严肃认真，面对女主时语气会不自觉变软。有一段不愿提起的过去，深夜独自在后山竹林练八段锦。",
        keywords: [],
      },
      {
        text: "毒舌闷骚型：表面冷漠毒舌，实则闷骚到不行。和女主的日常拌嘴是全镇的连续剧。会在深夜偷偷给面馆留一把新鲜草药，附纸条写「多的，别浪费」。",
        keywords: [],
      },
      {
        text: "温润如玉型：温和有礼，医者仁心。对所有人都很好，但对女主有明显的不同——会记住她喝什么茶、哪天该换药。在女主失忆发作时永远第一个出现。",
        keywords: [],
      },
    ],
    adjustPrompt: "想调整男主什么？比如「再高冷一点」「加点反派感」，或者跳过继续～",
  },
  {
    prompt: "最后确认一下关键配角和人物关系：",
    cards: [
      {
        text: "热闹烟火型配角：王婶（热心媒人，全镇姻缘操碎心）、老张（杂货店话痨，情报中心）、陈老（茶馆智者，偶尔一句点醒所有人）、小鱼（16岁面馆学徒，萌系担当）。",
        keywords: [],
      },
      {
        text: "暗线关联型配角：男主的青梅竹马（温柔表象下暗藏心机）、女主的前经纪人（掌握失忆真相）、神秘的镇长奶奶（知道所有人的秘密但从不主动开口）。每个人都是谜题的一块拼图。",
        keywords: [],
      },
      {
        text: "成长陪伴型配角：小鱼（面馆学徒，治愈萌物）、花姐（隔壁花店老板娘，恋爱军师）、中医馆的老猫阿福（灵性十足，只亲近女主）。温馨日常为主，配角各有成长线。",
        keywords: [],
      },
    ],
    adjustPrompt: "配角还想加谁？比如「加个反派」「闺蜜要更有存在感」，没有的话我来更新角色～",
  },
];

// ─── Mock Character Card Data ────────────────────────────────

interface CharacterProfile {
  name: string;
  identity: string;
  appearance: string;
  personality: string;
  background: string;
}

interface CharacterCardData {
  femaleLead: CharacterProfile;
  maleLead: CharacterProfile;
  supporting: { name: string; role: string; desc: string }[];
  relationships: string;
}

const mockCharacterCard: CharacterCardData = {
  femaleLead: {
    name: "苏念（小名念念）",
    identity: "前当红影后，现清岚镇「一碗春」面馆老板娘",
    appearance: "杏眼桃腮，常扎麻花辫，最爱穿素色棉麻围裙",
    personality: "外柔内刚，失忆后展现出天然的亲和力和不服输的韧劲",
    background: "曾是当红影后，因车祸失忆后独自来到清岚镇，盘下面馆重新开始。随身带着一枚旧铜钥匙，做面时会无意识哼歌——那是她失忆前拍戏时的插曲。",
  },
  maleLead: {
    name: "陆知行",
    identity: "济世堂第四代传人，清岚镇唯一的中医",
    appearance: "清瘦高挑，常穿白衬衫，手指修长带着淡淡药香",
    personality: "沉默寡言但行动力强，面对苏念时语气会不自觉变软",
    background: "自幼跟随祖父学医，独自经营祖传中医馆。认出了苏念的真实身份，但选择沉默守护她的平静生活。深夜常在后山竹林独处。",
  },
  supporting: [
    { name: "王婶", role: "镇长 / 非官方媒人", desc: "热心到让人招架不住，全镇姻缘她操了一半的心。口头禅：'我看你俩啊…'" },
    { name: "老张", role: "杂货店老板", desc: "话痨担当，消息灵通，是小镇的情报中心。什么事都瞒不过他的八卦雷达" },
    { name: "陈老", role: "茶馆掌柜", desc: "看似糊涂的智者，泡茶时偶尔一句话就能点醒所有人" },
    { name: "小鱼", role: "面馆学徒", desc: "16岁留守少年，把苏念当亲姐姐。是日常线的萌点担当，也是情感催化剂" },
  ],
  relationships: "苏念 × 陆知行：欢喜冤家 → 暗生情愫 → 互相守护\n王婶 → 全镇：操心一切，推动主线发展\n小鱼 → 苏念：姐弟情深，治愈线担当\n陈老 → 陆知行：亦师亦友，关键时刻点拨",
};

const mockCharacterCardAlt: CharacterCardData = {
  femaleLead: {
    name: "沈鹿（小名鹿鹿）",
    identity: "前米其林二星甜点主厨，现潮音镇「一勺海」甜品店老板",
    appearance: "短发利落，总戴着围裙，指尖常沾着面粉或糖霜",
    personality: "外表文静内里倔强，失去味觉后从不抱怨，坚信能找回来",
    background: "曾是上海米其林二星甜点主厨，因一场「意外」失去味觉。离开餐厅后来到潮音镇，每天清晨去海边收集海盐，说「每天的海味道都不一样」。失去味觉前最后尝到的味道是海盐焦糖。",
  },
  maleLead: {
    name: "顾北洲",
    identity: "远洋渔民，「归潮」号船长，潮音镇最年轻的讨海人",
    appearance: "肤色黝黑，手掌粗糙有力，笑起来眼角有细纹",
    personality: "沉默寡言，海上的硬汉，上岸后对人却温柔得笨拙",
    background: "三年前从远洋货轮辞职回乡捕鱼，镇上人都觉得奇怪。每次出海回来会在女主店门口放一袋最新鲜的海货。三年前在远洋货轮上目睹了一件事，那件事和女主失去味觉有关。",
  },
  supporting: [
    { name: "陈嫂", role: "鱼粥摊老板", desc: "镇上的情报中心和知心大姐，嘴快心热，对女主像亲闺女" },
    { name: "老周", role: "灯塔守望会会长", desc: "七十岁退休船长，话不多但每句都是人生智慧" },
    { name: "小满", role: "甜品店帮工", desc: "镇上唯一没走的年轻人，女主的第一个员工和忠实粉丝" },
  ],
  relationships: "沈鹿 × 顾北洲：陌生人 → 互相好奇 → 靠近 → 真相牵绊\n陈嫂 → 沈鹿：照顾者，也是暗中观察者\n老周 → 顾北洲：亦师亦父，关键时刻点拨\n小满 → 沈鹿：崇拜者+助手",
};

// ─── Mock Outline Card Data ──────────────────────────────────

interface OutlineChapter {
  title: string;
  summary: string;
  keyEvent: string;
}

interface OutlineCardData {
  structure: string;
  totalChapters: number;
  estimatedWords: string;
  chapters: OutlineChapter[];
}

const mockOutlineCard: OutlineCardData = {
  structure: "四季章回 · 甜中带虐",
  totalChapters: 16,
  estimatedWords: "约12万字",
  chapters: [
    { title: "第一章 盛夏来客", summary: "苏念失忆后独自来到清岚镇，盘下破旧的面馆「一碗春」。第一次见到隔壁中医馆的陆知行，两人因为排水管道问题大吵一架。", keyEvent: "女主到达小镇 · 男女主初遇" },
    { title: "第二章 面馆开张", summary: "苏念改造面馆，只卖六种面。开张当天只来了三个客人，但做出的面让全镇轰动。王婶成了第一个常客。", keyEvent: "面馆立足 · 王婶登场" },
    { title: "第三章 隔墙药香", summary: "面馆和中医馆只隔一面墙。苏念发现陆知行会在深夜默默把治跌打的药膏放在她门口。两人的关系从敌对变成了别扭的邻居。", keyEvent: "关系破冰 · 日常拌嘴开始" },
    { title: "第四章 赶集日", summary: "苏念第一次参加清岚镇赶集，被小镇的烟火气治愈。在集市上意外看到一张旧照片，上面的小女孩像极了自己。", keyEvent: "融入小镇 · 第一条线索出现" },
    { title: "第五章 秋天的桂花", summary: "院子里的百年桂花树开了，整条街都是香气。苏念用桂花入面，创出新品爆款。陆知行第一次主动来面馆吃面。", keyEvent: "暧昧萌芽 · 秋季开始" },
    { title: "第六章 古戏台", summary: "王婶筹划中秋文艺汇演，苏念被推举为总导演。排练中发现古戏台后面的废弃化妆间，触发一段模糊的记忆闪回。", keyEvent: "记忆碎片 · 古戏台线索" },
    { title: "第七章 竹林月色", summary: "苏念失眠夜游，撞见在后山竹林练八段锦的陆知行。两人在月下第一次敞开心扉，聊了很多。", keyEvent: "感情升温 · 互相了解" },
    { title: "第八章 汇演之夜", summary: "中秋文艺汇演大成功，全镇出动。苏念在舞台上的光芒让陆知行确认了她的身份，但他选择沉默。演出结束后两人在古戏台对视。", keyEvent: "高光时刻 · 陆知行确认身份" },
    { title: "第九章 冬日来信", summary: "一封从北京寄来的信打破了平静——苏念的前经纪人找到了她。陆知行变得沉默寡言，苏念感觉到异样。", keyEvent: "外界入侵 · 冬季转折" },
    { title: "第十章 真相碎片", summary: "经纪人来到小镇，试图带苏念回去。在争执中透露了失忆的部分真相：那场'意外'并不简单。陆知行挺身而出。", keyEvent: "真相浮现 · 冲突升级" },
    { title: "第十一章 信任裂痕", summary: "苏念发现陆知行早就知道她的身份却一直隐瞒。愤怒和被背叛的感觉让她关上了面馆的门。", keyEvent: "信任危机 · 低谷" },
    { title: "第十二章 小鱼的眼泪", summary: "小鱼偷偷跑去中医馆质问陆知行，陈老用一个故事化解了误会的一部分。苏念在面馆院子里发现了时间胶囊。", keyEvent: "催化剂 · 时间胶囊" },
    { title: "第十三章 春暖花开", summary: "打开时间胶囊，苏念终于想起了一切——她小时候在清岚镇度过的三年，和一个叫'小行'的男孩的约定。", keyEvent: "记忆恢复 · 真相大白" },
    { title: "第十四章 重逢与抉择", summary: "苏念面临选择：回到娱乐圈复仇，还是留在清岚镇。她选择先面对过去，用自己的方式解决问题。", keyEvent: "核心抉择 · 成长" },
    { title: "第十五章 一碗春再开张", summary: "苏念以真实身份重新开张面馆。外界的关注带来了纷扰，但小镇的人们站在了她身边。", keyEvent: "回归 · 新的开始" },
    { title: "第十六章 初夏的约定", summary: "一年轮回，又是盛夏。面馆门口多了一块新招牌：'一碗春·念念不忘'。陆知行在桂花树下说出了那句迟到的告白。", keyEvent: "告白 · HE" },
  ],
};

const mockOutlineCardAlt: OutlineCardData = {
  structure: "海潮叙事 · 悬疑治愈",
  totalChapters: 12,
  estimatedWords: "约10万字",
  chapters: [
    { title: "第一章 失味之人", summary: "沈鹿来到潮音镇，盘下海边老屋，开了「一勺海」甜品店。第一天只有陈嫂来捧场，但海盐焦糖布丁让陈嫂红了眼眶。", keyEvent: "女主到达 · 甜品店开张" },
    { title: "第二章 归潮号", summary: "顾北洲的渔船在暴风雨后归港。沈鹿第一次见到这个沉默的渔民，他在她店门口放了一袋最新鲜的海虾就走了。", keyEvent: "男女主初遇 · 海虾" },
    { title: "第三章 每天的海不一样", summary: "沈鹿开始每天清晨去海边收集海盐，试图唤醒味觉。顾北洲主动带她去了一个只有渔民知道的盐田。", keyEvent: "关系破冰 · 盐田" },
    { title: "第四章 赶海市", summary: "全镇出动的赶海市上，沈鹿用海盐系列甜品惊艳了所有人。在灯塔旧址，她发现了一个很眼熟的玻璃瓶。", keyEvent: "融入小镇 · 第一条线索" },
    { title: "第五章 冬天的海", summary: "入冬后两人有了更多相处时间，沈鹿教他做甜品，他教她辨认风向。", keyEvent: "感情升温 · 互相教学" },
    { title: "第六章 灯塔的秘密", summary: "沈鹿在灯塔里发现了更多线索——一张她小时候在这里的照片。", keyEvent: "记忆碎片 · 灯塔线索" },
    { title: "第七章 风暴夜", summary: "一场大风暴，全镇守在码头等待。沈鹿在焦急中味觉第一次回应——她尝到了眼泪的咸。", keyEvent: "情感爆发 · 味觉松动" },
    { title: "第八章 那年的海盐焦糖", summary: "做出失去味觉后第一个能尝到味道的甜品——海盐焦糖。随之而来的是汹涌的记忆。", keyEvent: "记忆回流 · 真相浮现" },
    { title: "第九章 被撕掉的那一页", summary: "发现失去味觉并非意外，当年供货商掩盖食材问题。顾北洲三年前正好目睹了这一切。", keyEvent: "真相大白 · 信任考验" },
    { title: "第十章 出海", summary: "顾北洲带她出海，在大海中央她想起了一切——包括小时候在灯塔里的那个夏天。", keyEvent: "记忆完整 · 核心抉择" },
    { title: "第十一章 一勺海的真正含义", summary: "沈鹿选择留在潮音镇，用法律解决了食安问题。味觉完全恢复的那天，做了一份海盐焦糖。", keyEvent: "回归 · 和解" },
    { title: "第十二章 春潮", summary: "春天到了，「归潮」号重新出海。船头多了一面写着「一勺海」的小旗。", keyEvent: "告白 · HE" },
  ],
};

// ─── Mock: chapter text content ──────────────────────────────

const mockChapterTexts: Record<number, string> = {
  0: `七月的清岚镇热得像一口蒸笼，连知了都懒得叫了。

苏念拖着一只旧行李箱，站在镇口那棵三百年老榕树下，看着眼前这条窄窄的青石板路，觉得自己大概是疯了。

一个月前，她还在北京最好的医院里，对着天花板数格子。医生说她因为车祸失去了大部分记忆，但身体已经恢复得差不多，可以出院了。出院去哪儿呢？她不记得自己住在哪里，不记得自己是谁，口袋里只有一把旧铜钥匙和一张写着"清岚镇"三个字的纸条。

于是她来了。

"让一让嘞！让一让！"一辆三轮车载着满满的青菜从她身边呼啸而过，溅起的水花打在她白色连衣裙上，留下好几个泥点子。

苏念低头看了看裙子，又抬头看了看这条热气蒸腾的老街，突然就笑了。反正什么都不记得了，那就从头开始好了。

她顺着主街往里走，两边是各种老字号店铺——李记杂货、王婶豆腐坊、济世堂中医馆。走到街中段的时候，她看到一间关着门的铺面，门上贴着褪了色的"转让"两个字。

透过落满灰的玻璃往里看，是一间小面馆的格局。前面是堂食的位置，后面应该是厨房，再后面隐约能看到一个小院子。

苏念的心突然跳了一下。她说不清为什么，但她觉得这个地方她认识。那种感觉就像——你忘了一首歌的名字，但旋律一响起来，身体比脑子先记住了。

"看什么看呢？这铺子空了三年了，没人愿意接。"

一个清冷的男声从旁边传来。苏念转头，看见隔壁"济世堂"的门口站着一个高瘦的年轻人，穿着白衬衫，袖口挽到小臂。他手里端着一杯凉茶，表情淡淡的，看她的眼神像在看一个不太聪明的游客。

"我不是在看，"苏念不知道哪来的脾气，"我在想要不要盘下来。"

年轻人挑了挑眉，喝了一口凉茶，转身进了中医馆。走到门口的时候，他头也不回地丢下一句：

"劝你别，这条街的排水管是通的，你炒菜的油烟会飘到我店里。"

苏念站在原地，看着他的背影消失在药柜后面，气得想笑。

她低头看了看手里的旧铜钥匙，又看了看面馆紧闭的门。钥匙孔的形状，好像和这扇门上的锁，有点像。

她把钥匙插了进去。

咔嗒一声，门开了。`,
  1: `面馆的盘下手续比苏念想象的简单得多。

镇上的房东是个八十多岁的老爷子，耳朵不太好，苏念说了三遍"我要租这个铺子"，他才听清楚。然后老爷子激动地拍了拍桌子："好好好！三年了终于有人要了！房租随便给，你别让它空着就行！"

随便给的意思是，一个月八百块。在北京，这个价格大概能租一个储物柜。

接下来的两周，苏念把面馆从里到外翻新了一遍。她不知道自己为什么会刷墙、会修水管、会给灶台砌砖——这些技能就像呼吸一样自然，好像她上辈子就是个装修工。

王婶是第一个来串门的。

"哎呀！新来的姑娘！你一个人弄这些啊？"五十多岁的王婶围着围裙，端着一碗豆花就进来了，"来来来，先吃点东西，饿着肚子怎么干活！"

苏念接过碗，豆花上面浇了一层红油，撒了花生碎和葱花。她尝了一口，眼睛就亮了——不是因为多好吃，而是因为这个味道她好像吃过。

"好吃吗？"王婶期待地看着她。

"好吃。"苏念点头，然后问了一句自己都没想到的话，"王婶，你这豆花的配方是不是变过？以前应该还放了一点点花椒油。"

王婶愣住了。

"你怎么知道的？十几年前确实放花椒油，后来老张说太麻了我就去掉了……你以前来过清岚镇？"

苏念摇头："我不记得了。"

王婶看了她好一会儿，眼神变得有些复杂，但很快又笑了起来："管它呢！能吃出花椒油的，都是有口福的人！你这面馆打算什么时候开张啊？"

"下周吧。"苏念看着已经初具雏形的店面，"我只卖六种面，每天限量，卖完就关门。"

"六种面？"王婶数了数手指，"够吗？"

"够了。"苏念拿出一张手写的菜单，上面的字迹清秀工整：

阳春面、雪菜肉丝面、番茄鸡蛋面、红烧牛肉面、三鲜馄饨面、桂花酒酿圆子面。

"最后一个是什么？桂花酒酿圆子面？"王婶念着念着笑了，"这名字倒是好听，从来没见过这种搭配。"

"我也不知道为什么会做这个，"苏念望向院子里那棵光秃秃的桂花树，"可能要等秋天桂花开了，才能做出正宗的味道吧。"

开张那天是个周六，苏念在门口挂上了新招牌——"一碗春"。

上午十点开门，到中午十二点，总共来了三个客人。一个是王婶（第一个冲进来的），一个是杂货店的老张（被王婶拉来的），还有一个是路过的快递小哥。

但三个人吃完之后的反应都一样——愣了几秒，然后开始狂吃。

"你这面……"老张嘴里塞满了红烧牛肉面，含含糊糊地说，"有鬼啊！怎么能这么好吃！"

消息在半小时内传遍了全镇。`,
  2: `苏念很快发现了一个问题——隔壁。

准确地说，是隔壁那面墙。

"一碗春"和"济世堂"之间只隔了一面老砖墙，据说是民国时候砌的，砖缝里都是岁月的味道。问题是这面墙的隔音效果约等于零，隔味效果更是负数。

每天早上苏念和面的时候，中药味就从墙缝里钻过来，跟她的面汤打架。到了下午陆知行熬药的时候，面馆这边的油烟又翻墙过去，在药罐子上面盘旋。

"苏老板，"陆知行站在两家之间的巷子里，脸上挂着一种礼貌而克制的不悦，"能不能在抽油烟机出风口加一个导流板？你的油烟已经第三次飘到我的药柜上了。"

苏念正蹲在门口摘菜，抬头看了他一眼："陆大夫，我倒想问问，你那个砂锅熬的是什么药？从早上六点就开始飘，我今天的面汤差点变成十全大补汤。"

两个人对视了三秒。

"你先加导流板。"
"你先换个密封砂锅。"

又对视了三秒。苏念先收回了视线，嘟囔了一句"算了我先做饭了"就转身进去了。

王婶在对面的豆腐坊里看完了全程，跟老张说："你看你看，又吵上了！但你发现没有，小陆说话的时候声音又轻了。"

老张正在算账，头也不抬："人家那是有教养。"

"放屁！他跟我说话可没这么轻！"

那天晚上苏念关了面馆准备睡觉，打开后门去院子里浇花的时候，发现门口的台阶上放着一个小纸包。

打开一看，是一罐药膏。乳白色的，带着淡淡的凉意，闻起来有薄荷和什么草药的气息。

旁边压着一张小纸条，字迹清瘦好看：

"厨房烫伤用的。注意你左手虎口。"

苏念低头看了看自己的左手——虎口那里确实有一个小水泡，是中午炒浇头的时候溅的油。她自己都没在意，他怎么看到的？

她拿着那罐药膏站在月光下，突然觉得这个人很矛盾。

白天寸步不让，晚上偷偷送药。说话的时候冷冰冰的，做的事情却热乎乎的。

苏念往隔壁墙上看了一眼。二楼的窗户黑着，但窗台上放着一杯没喝完的茶，茶杯旁边是一盏还亮着的小灯。

她收回目光，把药膏打开，仔细地抹在了虎口上。

凉凉的，很舒服。

之后的日子就变成了一种奇怪的模式：白天互相嫌弃，晚上互相照顾。

苏念会在收摊之后多做一碗面放在后门台阶上，不说是给谁的。第二天碗总是干干净净地放回来，偶尔碗底会压一张纸条：

"面不错，汤咸了一点。"
"这次刚好。"
"番茄不够酸，试试加半个柠檬。"

苏念对着最后那张纸条翻了个白眼，但第二天的番茄鸡蛋面汤底还是多了半个柠檬。

小鱼是唯一一个戳破这层窗户纸的人。

"念姐，你做的那碗面到底是给谁的呀？"十六岁的少年蹲在门口剥蒜，一脸无辜地问。

"多的。"苏念面不改色，"卖不完浪费。"

"可是我们今天中午就卖完了呀。"

"……那是我晚上又做的。"

"专门做一碗？"

"你蒜剥完了没有？没有就别说话。"

小鱼低头继续剥蒜，嘴角翘得能挂一串糖葫芦。`,
  3: `清岚镇每周日有赶集。

这件事苏念是从王婶嘴里知道的。准确地说，是王婶在周六晚上激动地冲进面馆，拍着桌子通知她的。

"明天赶集！你一定要来！全镇最热闹的时候！你那个面摊可以摆到集市上去，保证卖疯！"

苏念本来想说"我就不去了"，但架不住王婶的热情——这种热情不是普通的热情，是那种"如果你不去我就搬到你面馆住"的热情。

周日一大早，整个清岚镇就活了过来。

主街两边摆满了摊位：张婶的腌菜、老李头的草编、刘家的山货、河对岸周师傅的竹器……空气里混着各种味道——新鲜蔬菜的泥土气、糖炒栗子的焦甜香、卤肉铺子的浓油赤酱。

苏念搬了一口锅、一袋面粉和几样浇头，在老榕树下支了个小摊。她本来没抱什么期望，但等她把第一碗阳春面煮出来的时候，队就排到了卤肉铺子那边。

"让我先来！我来最早的！"
"你插什么队！我六点就在这了！"
"苏老板，我要三碗红烧牛肉面！打包！给我儿子也带一碗！"

苏念手忙脚乱地煮面，小鱼在旁边帮忙收钱，两个人忙得脚不沾地。

正忙着的时候，一个声音从人群后面传来：

"阳春面一碗。"

苏念抬头，看见陆知行站在队伍最后面。他今天难得没穿白衬衫，换了一件灰蓝色的棉麻外套，看起来没那么严肃了。

"排队。"苏念低头继续煮面。

"我在排。"

"排好。"

"……我说了我在排。"

小鱼在旁边偷笑，被苏念用眼神瞪了回去。

等到中午，面卖完了，人群渐渐散去。苏念收了摊，打算在集市上转转。她从来没赶过集——至少在她能记住的人生里没有。

集市的尽头是一个旧书摊，摊主是个戴老花镜的大爷，面前铺了一块蓝布，上面摆满了泛黄的旧书和老照片。

苏念蹲下来随手翻看。大多是上世纪八九十年代的老照片——有集体合照、有风景明信片、还有一些褪色的黑白人像。

她翻到一张的时候，手突然停住了。

那是一张彩色照片，拍的是清岚镇的老榕树。树下站着一群孩子，都是五六岁的模样，穿着花花绿绿的衣服对着镜头笑。照片右下角写着"2003年夏 清岚镇幼儿班"。

苏念死死盯着照片中间的一个小女孩。

扎两个羊角辫，穿一条碎花裙子，左手拉着旁边一个男孩的衣角，笑得眼睛弯成月牙。

那个小女孩，长得像极了她自己。

"大爷，这照片……是哪来的？"

"哦，这个啊，"旧书摊大爷推了推老花镜，"前些年镇上翻修学校的时候清出来的，我看扔了可惜就收着了。"

"我能买走吗？"

"拿去拿去，不要钱。"

苏念把照片翻过来，背面有人用铅笔写了一行字，大部分已经模糊了，只能隐约辨认出几个："……小念……小行……最好的朋友……"

小念。

她的名字叫苏念。小名念念。

心跳得很快，不是激动，是一种说不清的感觉——像是站在一扇紧闭的门前面，知道推开门就是答案，但手却伸不过去。

苏念把照片小心地夹在手帐里，深吸了一口气。

回面馆的路上，她路过济世堂门口，陆知行正站在门口给一个老奶奶把脉。他看见她的时候微微点了下头，目光在她手上的手帐上多停留了一秒。

苏念没说话，走进了面馆。

那天晚上她把照片拿出来看了很久，特别是那个拉着小女孩衣角的男孩。男孩瘦瘦高高的，站得很直，看镜头的样子有点拘谨，但握着女孩衣角的手很紧。

"小行。"苏念自言自语地念了一下这个名字。

没有任何记忆浮上来。但她的手不自觉地摸到了口袋里那把旧铜钥匙。`,
  4: `九月中旬的某一天，苏念推开面馆后门的时候，被一阵香气击中了。

那不是普通的香。是金桂的香——浓郁、甜腻、又带一点点清冷的底调，像是有人把蜂蜜和露水搅在一起，再用秋天的风吹散开来。

她抬头一看，院子里那棵百年老桂花树，不知道什么时候开了。

密密麻麻的金色小花挤满了每一根枝条，像是一夜之间有人在树上洒了一把碎金子。花瓣小得几乎看不见，但香气却铺天盖地，隔着一条街都闻得到。

"开了开了！"王婶第一个冲过来，在院子门口探头探脑，"每年就等这几天！你这棵树是清岚镇最老的桂花树，前几年没人打理差点死了，没想到今年又活过来了。"

苏念站在树下，仰头看着那些金色的花簇。秋天的阳光透过桂花枝叶落在她脸上，光斑随着风一晃一晃的。

一个念头冒了出来。

"王婶，你觉得——桂花能入面吗？"

王婶愣了一下："桂花入面？没听说过啊。"

"我想试试。"

接下来三天，苏念几乎没出过厨房。

她试了桂花卤、桂花油、糖渍桂花、盐渍桂花，又尝试了各种面底——清汤、浓汤、干拌、冷面。每一种排列组合她都做了至少两遍。

小鱼被叫来当试吃员，到第三天已经吃得满嘴桂花香，看到面就想跑。

"念姐，我真的吃不下了……"

"最后一碗，试试这个——桂花酒酿圆子面。"

小鱼哀怨地看了她一眼，端起碗。

先是酒酿的微酸，然后是圆子的软糯，接着桂花的甜香像一阵风一样扫过舌尖，最后面条的麦香兜住了所有味道，余韵悠长。

小鱼放下碗，眼睛亮了。

"就是这个。"

开卖那天是周五，苏念在门口的小黑板上多写了一行字："本周限定·桂花酒酿圆子面。"

全镇来了。

不是夸张。真的是全镇。

王婶带了一家老小五口人，老张叫上了茶馆的陈老和棋友，连住在镇子最里面、平时从不出门的刘奶奶都拄着拐杖来了。

"这面一闻就不得了！"老张吸溜了一大口，"苏老板，你这手艺是祖传的吧？"

苏念笑了笑："不知道。也许吧。"

她是真的不知道。做这碗面的过程中，有好几个瞬间她的手像是被什么东西牵引着——放多少桂花、酒酿熬多久、圆子搓多大，这些比例她根本不需要思考，手比脑子先动。

就像这些东西原本就刻在她的身体里。

中午快收摊的时候，一个人走了进来。

苏念正在厨房里擦灶台，听到小鱼的声音："欢迎光临……啊，陆大夫！"

她探头出去看了一眼——陆知行坐在靠窗的位置，这是他第一次走进"一碗春"。

他穿着惯常的白衬衫，袖口挽到小臂。面前是一只空碗和一双筷子，坐姿端正得像在上课。

苏念擦了擦手，走出来。

"吃什么？"

"桂花面。"

"卖完了。"

陆知行看了她一眼，没说话。

苏念也看了他一眼。

沉默了大约五秒钟。

"……我去给你做。"

苏念转身进了厨房，重新起锅烧水。她也不知道自己为什么要多做这一碗——明明说好了每天限量卖完就关门。

但她就是做了。

十分钟后，一碗桂花酒酿圆子面端到了陆知行面前。面汤澄澈，表面飘着几朵金色的糖渍桂花，两个白胖的小圆子靠在碗边，面条细而匀称，在桂花汤里微微泛着暖光。

陆知行拿起筷子，先喝了一口汤。

然后他的表情变了。

那种变化很细微——眉心松了一下，嘴角动了一下，眼睛里有什么东西闪了一下又消失了。如果不仔细看，根本看不出来。

但苏念看到了。

他一口一口地吃完了整碗面，把汤也喝干净了。然后放下筷子，安静了几秒钟。

"多少钱？"

"十八。"

他放了二十块在桌上，站起来。走到门口的时候停了一下，没有回头。

"桂花放得刚好。"

苏念站在厨房门口，看着他的背影消失在巷子里。晚秋的阳光从窗户照进来，照在空碗上，碗底还残留着一两朵桂花。

她把碗收了，碗底压着的二十块钱下面，多了一张小纸条：

"这个味道，很像一个人做的。"

什么人？

苏念想问，但人已经走了。

那天晚上她坐在院子里的桂花树下，把纸条翻来覆去地看了好几遍。月光打在桂花上，整个院子像被浸在了金色的蜜里。

隔壁二楼的窗户亮了一会儿，又暗了。

"像一个人做的。"她喃喃地重复这句话。

是谁呢？`,
};

const mockChapterTextsAlt: Record<number, string> = {
  0: `十月末的潮音镇，风里已经有了凉意。

沈鹿站在海堤尽头，看着面前这间空了不知道多久的老屋，心想自己大概是疯了。

三个月前她还是上海那家米其林二星餐厅的甜点主厨，每天经手的食材价值抵得上普通人一个月工资。现在她站在一个连导航都找不到的渔港小镇，准备盘下一间漏雨的海边老屋，开一家甜品店。

关键是——她尝不出任何味道。

那场"意外"之后，她的味觉就像被人按下了静音键。甜、酸、苦、咸，全部消失了。对一个甜点师来说，这比断了手还残忍。

"姑娘，你真要租这个？"房东陈嫂端着一碗鱼粥从隔壁码头走过来，脸上写满了难以置信，"这房子空了五年了，台风季漏得跟筛子似的。"

"我要的。"沈鹿摸了摸口袋里那个玻璃小瓶，里面装着一撮灰白色的海盐，"多少钱？"

"你先尝尝我这鱼粥再说。"陈嫂把碗塞到她手里，"在我们潮音镇，吃饱了才谈正事。"

沈鹿接过碗，热气扑面而来。她闻不到香味，但身体记得那个动作——低头，吹一吹，小口喝。

鱼粥入口的瞬间，什么都没有。温热的液体滑过舌头，像喝白开水。

但她还是把整碗都喝完了。

"好喝吗？"陈嫂眼巴巴地看着她。

沈鹿笑了笑："谢谢陈嫂。"她没有回答好不好喝，因为她真的不知道。

租下老屋的手续比想象中简单。房租一个月六百块，陈嫂还主动减了一百——"你把那个漏雨的地方修好，就算你帮我省了修缮费。"

接下来两周，沈鹿一个人翻修了整间屋子。她把面朝大海的那面墙开了一扇大窗，窗台正好可以当出餐台。院子里那棵被海风吹歪的老松树，她在树下放了两把旧藤椅。

店名她想了很久，最后写在一块漂流木上挂在门口——"一勺海"。

陈嫂看了半天："一勺海？什么意思？"

"小时候偷吃过一勺海盐焦糖，"沈鹿说，"那是我现在唯一还记得的味道。"

那不是舌头上的记忆，是身体深处某个地方的记忆。焦糖的甜裹着海盐的咸，像一个温暖的拥抱里藏着一点点泪水。

开张那天是个周六，十一月的第一个晴天。

沈鹿在出餐台上摆了三样东西：海盐焦糖布丁、柠檬海盐磅蛋糕、热可可配手工棉花糖。

整个上午，只有陈嫂来了。

"怎么就我一个人？"陈嫂环顾四周，有点尴尬。

"没关系，"沈鹿把布丁推到她面前，"你是第一位客人，这份请你。"

陈嫂舀了一勺布丁放进嘴里。

然后她愣住了。

"这……"陈嫂的眼眶突然红了，"这个味道，怎么像小时候我奶奶做的那个……她用灶台熬焦糖，最后总要撒一点点海盐……"

沈鹿看着陈嫂的表情，心里有一个地方轻轻动了一下。

她做不出自己能尝到的甜品，但也许她能做出别人能想起来的味道。`,
  1: `沈鹿第一次见到顾北洲，是在一个暴风雨的夜里。

那天下午天色就不对，乌云压得极低，海面变成了铅灰色。陈嫂从码头跑过来，围裙都来不及解，脸色发白。

"归潮号还没回来。"

沈鹿不知道"归潮号"是什么，但她看见整个码头的人都出来了——老周叼着没点的烟站在堤坝上，几个渔嫂抱着孩子在避风亭里张望。连平时最懒的杂货店老刘都关了店门，拎着手电筒往码头跑。

"归潮号是北洲的船，"陈嫂看她不明白，急急地解释，"顾北洲，全镇最年轻的讨海人。就他一个还在跑远洋，每次出海全镇都提心吊胆……"

风越来越大，雨点开始砸下来，打在海面上像密集的鼓点。

沈鹿站在甜品店的窗前，看着码头上那些在风雨中等待的人，突然觉得自己应该做点什么。

她烧了一大锅热可可，又做了一批棉花糖，装在保温壶里提到了码头。

"来，喝一口暖暖。"她给每个等待的人倒了一杯。

老周接过杯子，看了她一眼："你是新来那个开甜品店的？"

"嗯。"

"做得不错。"老周喝了一口，望向漆黑的海面，"他会回来的，那小子命硬。"

等到凌晨两点，所有人都快撑不住的时候，海面上终于出现了一点灯光。

"回来了！归潮号回来了！"

码头一下子炸开了。渔嫂们哭着往前跑，老周扔掉烟冲到缆绳旁边。沈鹿被人群裹挟着向前，看见一艘不大的渔船在风浪中摇晃着靠近。

船头站着一个人。

看不清长相，只能看见一个高瘦的轮廓，黝黑的皮肤上全是海水。他一手抓着缆绳，一手稳稳地操着舵，像是在和大海搏斗了一整夜之后终于赢了一局。

船靠岸的那一刻，所有人都涌上去了。

"北洲！你个臭小子！"陈嫂一巴掌拍在他肩上，眼泪啪嗒往下掉，"再不回来我明天就把你家房子改成鱼粥摊！"

顾北洲被拍得往后退了一步。他没什么表情，只是沙哑地说了句："嫂子，鱼带回来了。"

然后他的目光越过人群，落在沈鹿身上。

准确地说，是落在她手里那个保温壶上。

"那是什么？"

"热可可。"沈鹿把最后一杯倒给他，"加了棉花糖。"

顾北洲接过杯子，低头喝了一口。凌晨两点的码头上，所有人都在欢呼庆祝归航，只有他安静地站在角落里，喝着一杯加了棉花糖的热可可。

喝完之后他把杯子还给她，说了句沈鹿没想到的话：

"棉花糖放多了。应该再加一点点盐。"

沈鹿愣住了。

这是三个月以来，第一个对她的甜品提出具体口味意见的人。

她追着问了一句："你怎么知道要加盐？"

但顾北洲已经转身走了。他拎着一袋鱼，走到甜品店门口，把袋子放在台阶上。

"今天的。"他头也没回。

然后消失在凌晨的黑暗里。

第二天早上，沈鹿打开店门，看见台阶上那袋鱼旁边多了一张纸条，字迹很潦草：

"海盐焦糖加海虾粉，你试试。"`,
  2: `沈鹿养成了一个习惯——每天清晨五点半，去海边收集海盐。

不是从超市买的那种精制盐。是海水蒸发后留在礁石上的薄薄一层白色结晶，要趁日出前的露水还没蒸干、海风还带着凉意的时候，用小刮刀一点一点刮下来。

"每天的海不一样，"她跟小满解释，"温度不同、风向不同、潮汐不同，析出的盐结晶也不同。今天的盐比昨天多一点矿物味，可能是因为昨晚涨潮的时候海水裹了深层的泥沙上来。"

小满听得一愣一愣的："可是……你不是尝不出味道吗？"

沈鹿停下刮盐的动作，看了看手里那一小撮灰白色的晶体。

"对，我尝不出。但我可以看、可以闻、可以摸。盐的结晶形状不一样，溶解速度不一样，放在皮肤上的触感也不一样。"她把盐放进一个标注了日期的玻璃小瓶里，"味觉只是认识食材的一种方式，不是唯一的方式。"

小满崇拜地看着她："鹿姐你真的好厉害。"

"不是厉害，是没有办法。"沈鹿笑了笑，笑容有一点苦。

她已经收集了三十多瓶不同日期的海盐，每一瓶都做了详细的记录：日期、天气、潮汐时间、结晶颗粒大小、溶解速度。像一个失去听力的音乐家在用眼睛读乐谱。

这天早上她照常去海边，却发现礁石那片被提前"占"了。

顾北洲蹲在礁石边上，旁边放着两个铁桶，正在往里倒海水。他穿着一件洗得发白的深蓝色工装，裤腿卷到膝盖，脚踩在潮湿的礁石上。

"你在干什么？"沈鹿问。

"收海水。"

"……我看到了。为什么？"

顾北洲站起来，拎着两桶海水，看了她一眼。那种看法不像打量，更像在斟酌要不要说下一句话。

最后他说了。

"跟我来。"

沈鹿犹豫了三秒钟，然后跟上了。

他带她沿着海堤走了将近半小时，绕过一片芦苇丛，翻过一道低矮的石坡。然后眼前突然开阔了。

是一片盐田。

不大，大概两个篮球场的面积，由几十个浅浅的方形池子组成。池子里是薄薄一层海水，在晨光下泛着粉白色的光。池子边沿有白色的结晶带，像是被大自然画上去的边框。

"这是我爷爷辈留下来的。"顾北洲放下铁桶，"以前潮音镇靠晒盐为生，后来工业盐便宜了就没人做了。我偶尔来维护一下。"

沈鹿蹲在一个池子边上，用指尖碰了一下结晶。粗糙、温热、颗粒比礁石上的大很多。

"这个盐和礁石上的不一样。"她说。

"当然不一样。"顾北洲也蹲下来，"盐田的水浅，蒸发慢，结晶时间长，颗粒更大、更纯。礁石上的盐掺了太多杂质——海藻、矿物、沙子。"

他说话的时候看着盐田，不看她。但语气比平时多了一些东西，像是在说一件他在乎的事情。

"不同池子的盐也不一样。靠海那边的咸度高，靠山那边的矿物多。最里面那个池子的盐最好——我爷爷说那是'头道盐'，以前专门留给镇上做喜事的人家用。"

沈鹿站起来，环顾这片被遗忘的盐田。风从海上吹来，带着咸湿的气息。池子里的海水在风中微微荡漾，像是在呼吸。

"我能经常来吗？"她问。

顾北洲愣了一下。然后他伸手从最近的池子边上掰下来一块盐结晶，递给她。

"钥匙在入口那块石头底下。"

这算是答应了。

从那天开始，沈鹿的日程多了一项：每周三和周六去盐田收盐。顾北洲不是每次都在，但他在的时候会帮她把铁桶提到池子边，有时候会顺手指一下："今天东边池子的盐好。"

两个人之间的对话不多，但沈鹿发现，安静也可以是一种相处方式。他在旁边修池子的堤坝，她在池子里收盐，海风从两个人中间穿过。偶尔抬头对视一下，又各自低下头继续手里的事。

小满有一次跟着去了盐田，回来之后在甜品店里宣布了自己的观察报告：

"鹿姐，你知道顾大哥今天帮你提了几次桶吗？四次。他自己才提了一次。"

沈鹿剥柠檬皮的手停了一下："他就是顺手。"

"哦——那他为什么每次提桶的时候都先看你一眼，确认你没在看他，才提的？"

"……你柠檬皮剥完了没？"

"剥完了。鹿姐你耳朵红了。"

"出去。"`,
  3: `十一月十五，赶海市。

潮音镇每月十五有赶海市，这是沈鹿来了之后赶上的第一个。

前一天晚上陈嫂就在码头喊了一圈："明天赶海市！一勺海的沈老板要出摊！大家都来捧场啊！"

沈鹿本来没计划出摊，但陈嫂的通知已经发出去了，收不回来。

赶海市的热闹远超她的想象。

整个码头被改造成了一个临时集市。渔船靠岸的地方变成了海鲜区，一筐筐刚打上来的鱼虾蟹贝堆得像小山；海堤两边摆满了小摊——有卖渔绳编织手链的、有卖贝壳风铃的、有卖海草凉粉的。空气里全是海腥味和炭烤味混在一起的气息。

沈鹿在海堤中段支了一张折叠桌，上面摆了三样东西：海盐焦糖布丁、盐田海盐曲奇、还有一款新品——海盐柠檬塔。

柠檬塔的底是用盐田头道盐调的咸酥皮，上面是柠檬凝乳，顶上撒了一点点烟熏海盐。她是用那天从盐田东边池子收的盐做的，颗粒感特别明显。

一开始没什么人来。赶海市上大家更关心新鲜的海货和渔具，一个甜品摊显得有点格格不入。

直到老周经过。

七十岁的退休船长在折叠桌前停下来，眯着眼睛看了看那些精致的小甜品。

"这是什么？"

"海盐柠檬塔，用你们潮音镇盐田的盐做的。"

"盐田？"老周的表情变了，"盐田的盐还能做这个？"

"您试试。"

老周拿起一小块柠檬塔，咬了一口。

他嚼了两下，突然不动了。

"这个盐……是头道盐。"老周的声音有些发颤，"我年轻的时候，我爹做的鱼干就是用头道盐腌的。四十年了，没人再用这个盐了……"

他放下柠檬塔，摘了眼镜擦了擦眼睛，假装是海风吹的。

"给我来十块。"

"十块？"

"嗯，灯塔守望会的老伙计们每人一块。他们都是盐田长大的孩子。"

消息传开之后，折叠桌前排起了队。不是年轻人——是镇上的老人们，一个接一个来，每个人吃一口都是同一个反应：先愣住，然后眼眶红了。

"这是我们小时候的味道。"一个白发苍苍的阿婆握着沈鹿的手，说不出话来。

沈鹿站在海堤上，看着这些被一块盐唤醒了记忆的老人们，心里那个地方又动了一下。

她做不出自己能尝到的甜品。但她能做出别人能想起来的味道。

这可能就是"一勺海"存在的意义。

下午人群渐渐散去，沈鹿收了摊，决定去海堤尽头的灯塔旧址看看。她之前一直想去，但总是被各种事情耽搁。

灯塔不高，三层楼的样子，外墙斑驳得看不出原来的颜色，铁门虚掩着。推开门进去，里面比想象中保存得好——旋转楼梯还算完整，墙上挂着发黄的航海图。

一楼是一个小房间，靠墙有一排铁皮柜子，里面装满了航海记录本。沈鹿随手翻了翻，大多是上世纪七八十年代的出航日志——日期、潮汐、风向、捕获量，字迹工整得像印刷品。

她爬上二楼。二楼是一个环形观景台，窗户上全是盐渍和水痕，但还能看到外面的大海。阳光从西面照进来，在地板上投下金色的光斑。

光斑照到了一个东西。

角落里，靠着墙根，有一个玻璃瓶。

不是普通的瓶子。是那种小时候装糖果的老式玻璃罐，瓶口用蜡封住了，里面好像有东西。

沈鹿蹲下来捡起瓶子，翻过来看。

瓶子很旧了，玻璃上有岁月留下的毛玻璃质感。透过模糊的瓶壁，她隐约能看到里面有一张卷起来的纸条和一些碎碎的东西——好像是贝壳。

瓶底有人用指甲刻了几个歪歪扭扭的字。沈鹿把瓶子举到光线下辨认了好一会儿：

"鹿鹿的海"

她的手开始发抖。

鹿鹿。

她的小名。

沈鹿站在灯塔二楼，握着那个玻璃瓶，阳光从背后照过来把她的影子投在了墙上。

她来过这里。

她小时候来过这里。

瓶子上的蜡封很紧，她没有工具打开。但她不着急。这个瓶子在这里等了不知道多少年，不差这一会儿。

走出灯塔的时候天快黑了，码头上的赶海市已经收摊了。海堤上只剩下几个垂钓的老人和一条趴在石墩上打盹的黄狗。

沈鹿路过码头，看见顾北洲的"归潮号"安静地停在最里侧的泊位。船上没有人，但甲板上放着一箱分好的鱼，旁边贴了一张纸条：

"今天东边的黄花鱼好。给一勺海。"

沈鹿把纸条揭下来，和灯塔里的玻璃瓶一起装进了帆布包。

一个是不知道多少年前的自己留下的秘密。
一个是今天刚刚发生的温暖。

她走在回甜品店的路上，海风从身后追上来，把她的短发吹得乱七八糟。

远处，灯塔的轮廓在暮色里变成了一个剪影。`,
};

// ─── Mock: free-input guided flow ────────────────────────────

// ─── Tooltip wrapper ─────────────────────────────────────────
// Usage: add data-tip="tooltip text" to any element
// Styled via global CSS below
const tipStyles = `
[data-tip] {
  position: relative;
}
[data-tip]::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  background: #1f2937;
  color: #fff;
  font-size: 12px;
  line-height: 1.4;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 10;
}
[data-tip]:hover::after {
  opacity: 1;
}
`;

// ─── Types ───────────────────────────────────────────────────

type Message =
  | { id: string; sender: "model"; type: "inspiration"; prompt: string; cards: InspirationCard[]; round: number }
  | { id: string; sender: "model"; type: "thinking" }
  | { id: string; sender: "model"; type: "text"; content: string }
  | { id: string; sender: "model"; type: "settings-card"; prompt: string; settings: Record<string, { label: string; value: string }[]> }
  | { id: string; sender: "model"; type: "worldbuilding-card"; prompt: string; data: WorldbuildingData }
  | { id: string; sender: "model"; type: "character-card"; prompt: string; data: CharacterCardData }
  | { id: string; sender: "model"; type: "outline-card"; prompt: string; data: OutlineCardData }
  | { id: string; sender: "model"; type: "welcome"; prompt: string }
  | { id: string; sender: "model"; type: "stage-intro"; prompt: string; stage: "worldbuilding" | "characters" | "outline" }
  | { id: string; sender: "model"; type: "guide"; prompt: string }
  | { id: string; sender: "model"; type: "length-select"; prompt: string }
  | { id: string; sender: "model"; type: "micro-adjust"; prompt: string; round: number }
  | { id: string; sender: "model"; type: "subtype-select"; prompt: string }
  | { id: string; sender: "model"; type: "platform-select"; prompt: string }
  | { id: string; sender: "model"; type: "content-structure"; prompt: string; scenarios: import("./marketingMockData").ContentScenario[] }
  | { id: string; sender: "user"; type: "card-selection"; content: string }
  | { id: string; sender: "user"; type: "text"; content: string };

// ─── Component ───────────────────────────────────────────────

export default function ChatPanel() {
  const setCreationStage = useEditorStore((s) => s.setCreationStage);
  const setStageProgress = useEditorStore((s) => s.setStageProgress);
  const setAutoTitle = useEditorStore((s) => s.setAutoTitle);
  const setAgentStageData = useEditorStore((s) => s.setAgentStageData);
  const initNovelChapters = useEditorStore((s) => s.initNovelChapters);
  const setNovelChapterStatus = useEditorStore((s) => s.setNovelChapterStatus);
  const setNovelChapterContent = useEditorStore((s) => s.setNovelChapterContent);
  const setCurrentNovelChapter = useEditorStore((s) => s.setCurrentNovelChapter);
  const setScrollToChapter = useEditorStore((s) => s.setScrollToChapter);
  const novelChapters = useEditorStore((s) => s.novelChapters);
  const workMode = useEditorStore((s) => s.workMode);
  const setWorkMode = useEditorStore((s) => s.setWorkMode);
  const scene = useEditorStore((s) => s.scene);
  const isScreenplay = scene === "screenplay";
  const isMarketing = scene === "marketing";
  const isKnowledge = scene === "knowledge";

  // Scene-aware mock data selectors
  const sceneInspirationRounds = useMemo(() => {
    if (isScreenplay) return screenplayInspirationRounds;
    if (isMarketing) return marketingInspirationRounds;
    if (isKnowledge) return knowledgeInspirationRounds;
    return inspirationRounds;
  }, [isScreenplay, isMarketing, isKnowledge]);
  const sceneSettingsCard = useMemo(() => {
    if (isScreenplay) return screenplayMockSettings;
    if (isMarketing) return marketingMockSettings;
    if (isKnowledge) return knowledgeMockSettings;
    return mockSettings;
  }, [isScreenplay, isMarketing, isKnowledge]);
  const sceneWorldbuildingRounds = useMemo(() => {
    if (isScreenplay) return screenplayWorldbuildingRounds;
    if (isMarketing) return marketingWorldbuildingRounds;
    if (isKnowledge) return knowledgeWorldbuildingRounds;
    return worldbuildingRounds;
  }, [isScreenplay, isMarketing, isKnowledge]);
  const sceneWorldbuilding = useMemo(() => {
    if (isScreenplay) return screenplayMockWorldbuilding;
    if (isMarketing) return marketingMockWorldbuilding;
    if (isKnowledge) return knowledgeMockWorldbuilding;
    return mockWorldbuilding;
  }, [isScreenplay, isMarketing, isKnowledge]);
  const sceneCharacterRounds = useMemo(() => {
    if (isScreenplay) return screenplayCharacterRounds;
    if (isMarketing) return marketingCharacterRounds;
    if (isKnowledge) return knowledgeCharacterRounds;
    return characterRounds;
  }, [isScreenplay, isMarketing, isKnowledge]);
  const sceneCharacterCard = useMemo(() => {
    if (isScreenplay) return screenplayMockCharacterCard;
    if (isMarketing) return marketingMockCharacterCard;
    if (isKnowledge) return knowledgeMockCharacterCard;
    return mockCharacterCard;
  }, [isScreenplay, isMarketing, isKnowledge]);
  const sceneOutlineCard = useMemo(() => {
    if (isScreenplay) return screenplayMockOutlineCard;
    if (isMarketing) return marketingMockOutlineCard;
    if (isKnowledge) return knowledgeMockOutlineCard;
    return mockOutlineCard;
  }, [isScreenplay, isMarketing, isKnowledge]);
  const sceneChapterTexts = useMemo(() => {
    if (isScreenplay) return screenplayMockChapterTexts;
    if (isMarketing) return marketingMockChapterTexts;
    if (isKnowledge) return knowledgeMockChapterTexts;
    return mockChapterTexts;
  }, [isScreenplay, isMarketing, isKnowledge]);
  const sceneTitle = useMemo(() => {
    if (isScreenplay) return "雨夜追凶";
    if (isMarketing) return "焕颜精华";
    if (isKnowledge) return "AI效率局";
    return "一碗春";
  }, [isScreenplay, isMarketing, isKnowledge]);
  const sceneWelcome = useMemo(() => {
    if (isScreenplay) return "你好！欢迎来到剧本创作工作台\n\n描述一下你想创作的剧本——一句话、一个画面、甚至几个关键词就够了。\n我会帮你快速生成一版完整设定，然后我们一起调整打磨。\n\n没有想法也没关系，点击下方按钮我来帮你构思一个。";
    if (isMarketing) return "你好！欢迎来到电商内容创作工作台\n\n告诉我你要推广什么商品，以及你的目标投放平台。\n比如：「一款隐形蓝牙耳机，主打极致隐形和防水，想在抖音投放」\n\n我会帮你整理商品信息，然后根据平台特点生成内容结构。";
    if (isKnowledge) return "你好！欢迎来到深度解读工作台\n\n告诉我你想拆解哪本书？书名、文件、核心问题都可以——比如「帮我拆解《诡秘之主》的力量体系」。\n我来帮你快速生成分析框架，然后一起深入。\n\n没有想法也没关系，点击下方按钮我来帮你构思一个。";
    return "你好！欢迎来到小说创作工作台\n\n描述一下你想写的故事——一句话、一个画面、甚至几个关键词就够了。\n我会帮你快速生成一版创作设定，然后我们一起调整打磨。\n\n没有想法也没关系，点击下方按钮我来帮你构思一个。";
  }, [isScreenplay, isMarketing, isKnowledge]);

  const dataRef = useRef({
    sceneInspirationRounds, sceneSettingsCard, sceneWorldbuildingRounds, sceneWorldbuilding,
    sceneCharacterRounds, sceneCharacterCard, sceneOutlineCard, sceneChapterTexts, sceneTitle, sceneWelcome,
    isMarketing, isKnowledge, isScreenplay, novelLength: null as "short" | "medium" | "long" | null,
  });
  useEffect(() => {
    // When novelVariantRef is 1 (alt) and scene is novel, use alt data for all stages
    const isAlt = novelVariantRef.current === 1 && !isScreenplay && !isMarketing && !isKnowledge;
    dataRef.current = {
      sceneWorldbuildingRounds, sceneCharacterRounds, sceneWelcome,
      isMarketing, isKnowledge, isScreenplay,
      sceneInspirationRounds: isAlt ? inspirationRoundsAlt : sceneInspirationRounds,
      sceneSettingsCard: isAlt ? mockSettingsAlt : sceneSettingsCard,
      sceneWorldbuilding: isAlt ? mockWorldbuildingAlt : sceneWorldbuilding,
      sceneCharacterCard: isAlt ? mockCharacterCardAlt : sceneCharacterCard,
      sceneOutlineCard: isAlt ? mockOutlineCardAlt : sceneOutlineCard,
      sceneChapterTexts: isAlt ? mockChapterTextsAlt : sceneChapterTexts,
      sceneTitle: isAlt ? "一勺海" : sceneTitle,
      novelLength,
    };
  });

  // Generate a brief summary from settings data for the prompt
  const getSettingsSummary = useCallback(() => {
    const s = dataRef.current.sceneSettingsCard;
    if (dataRef.current.isMarketing) {
      const concept = s["商品信息"] || s["产品信息"] || s["视频策略"];
      const core = concept?.[0]?.value || "";
      return core ? `商品：${core}` : "";
    }
    if (dataRef.current.isKnowledge) {
      const concept = s["书籍信息"] || s["分析配置"];
      const core = concept?.[0]?.value || "";
      return core ? `分析对象：${core}` : "";
    }
    // Novel / Screenplay — build a natural sentence
    const concept = s["故事概念"];
    const elements = s["写作要素"];
    const coreSetting = concept?.[0]?.value || "";
    const genre = elements?.find((e: { label: string; value: string }) => e.label === "题材")?.value || "";
    const style = elements?.find((e: { label: string; value: string }) => e.label === "风格调性")?.value || "";
    const ending = elements?.find((e: { label: string; value: string }) => e.label === "结局")?.value || "";
    // Compose natural sentence: "一个都市言情故事，甜宠治愈风，HE结局——核心设定..."
    const parts: string[] = [];
    if (genre) parts.push(genre.replace(" · ", ""));
    if (style) parts.push(`${style.replace(/ · /g, "")}风格`);
    if (ending) parts.push(`${ending}结局`);
    const prefix = parts.length > 0 ? `一个${parts.join("、")}的故事` : "";
    if (prefix && coreSetting) return `${prefix}——${coreSetting}`;
    return coreSetting || prefix;
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);
  const [selections, setSelections] = useState<Record<number, number>>({}); // round → selected card index
  const [currentRound, setCurrentRound] = useState(0); // 0=welcome, 1-3=inspiration, 4=confirm stage
  const [flowMode, setFlowMode] = useState<"none" | "inspiration" | "freeform">("none");
  const [awaitingAdjust, setAwaitingAdjust] = useState(false); // waiting for user micro-adjust
  const [adjustRound, setAdjustRound] = useState(0); // which round is awaiting adjust
  const [favKeywords, setFavKeywords] = useState<Set<string>>(new Set());
  const [writingChapter, setWritingChapter] = useState(-1); // -1 = not writing, 0+ = generating chapter index
  const [screenplaySubtype, setScreenplaySubtype] = useState<"short_drama" | "comic_drama" | null>(null);
  const [novelLength, setNovelLength] = useState<"short" | "medium" | "long" | null>(null); // 短篇/中篇/长篇
  const [input, setInput] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const attachRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);
  const novelVariantRef = useRef(0); // 0 = original (清岚镇), 1 = alt (潮音镇)
  const marketingPlatformRef = useRef<string | null>(null); // 电商选中的内容平台

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Click outside attach menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) {
        setShowAttachMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Track sub-progress within each stage for the progress bar line fill
  useEffect(() => {
    // Map currentRound to stageProgress (0-1) for the NEXT line to fill
    // Stage 0→1 (设定): rounds 0-4, line fills during inspiration rounds
    // Stage 1→2 (篇幅): round 5, quick selection
    // Stage 2→3 (角色): rounds 9-12, line fills during character rounds
    // Stage 3→4 (大纲): rounds 12-13, line fills during outline generation
    const progressMap: Record<number, number> = {
      0: 0,     // welcome
      1: 0.25,  // inspiration round 1
      2: 0.50,  // inspiration round 2
      3: 0.75,  // inspiration round 3
      4: 0,     // settings confirmed, reset for next line
      5: 0,     // length selection
      9: 0.25,  // character round 1
      10: 0.50, // character round 2
      11: 0.75, // character round 3
      12: 0,    // characters confirmed, reset
      13: 0,    // outline confirmed, reset
      14: 0,    // writing mode
    };
    setStageProgress(progressMap[currentRound] ?? 0);
  }, [currentRound, setStageProgress]);

  // Scene card entry: model sends welcome message
  useEffect(() => {
    if (hasInit.current) return;
    // Don't init messages until mode is selected for novel/screenplay
    if ((scene === "novel" || scene === "screenplay") && workMode === null) return;
    hasInit.current = true;

    if (isScreenplay) {
      // Screenplay: show thinking then subtype selection
      const thinkingId = `thinking-init`;
      setMessages([{ id: thinkingId, sender: "model", type: "thinking" }]);

      setTimeout(() => {
        setMessages([
          {
            id: "model-subtype",
            sender: "model",
            type: "subtype-select",
            prompt: "你好！欢迎来到剧本创作工作台。你想创作哪种类型？",
          },
        ]);
      }, 1200);
    } else {
      // Novel / Marketing / Knowledge: start empty, show background guide
      setMessages([]);
    }
  }, [scene, workMode]);

  // Toggle keyword favorite
  const toggleKeyword = useCallback((kw: string) => {
    setFavKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(kw)) next.delete(kw);
      else next.add(kw);
      return next;
    });
  }, []);

  // Handle mode selection (Agent / Workflow)
  const handleModeSelect = useCallback((mode: "agent" | "workflow") => {
    setWorkMode(mode);
    // Agent: useEffect will detect workMode change and init welcome message
    // Workflow: WorkbenchLayout will switch to 3-column layout
  }, [setWorkMode]);

  // Handle screenplay subtype selection (短剧 / 漫剧)
  const handleSubtypeSelect = useCallback((subtype: "short_drama" | "comic_drama") => {
    setScreenplaySubtype(subtype);
    const label = subtype === "short_drama" ? "短剧" : "漫剧";

    // Add user selection message
    setMessages((prev) => [
      ...prev,
      { id: `user-subtype`, sender: "user", type: "card-selection", content: `我想创作${label}` },
    ]);

    // Show thinking then welcome message
    const thinkingId = `thinking-welcome`;
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
    }, 300);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingId),
        {
          id: "model-welcome",
          sender: "model",
          type: "welcome",
          prompt: subtype === "short_drama"
            ? "好的，我们来创作一部短剧！\n\n你可以让我帮你找灵感，也可以直接描述你的剧本构思——一段梗概、一个场景、甚至一句「我想写一部关于__的短剧」都可以，我们一起把它变成完整的剧本。"
            : "好的，我们来创作一部漫剧！\n\n你可以让我帮你找灵感，也可以直接描述你的剧本构思——一段梗概、一个画面、甚至一句「我想做一部关于__的漫剧」都可以，我们一起把它变成完整的分镜剧本。",
        },
      ]);
    }, 1500);
  }, []);

  // Handle novel length selection (now happens after settings confirm)
  const handleLengthSelect = useCallback((length: "short" | "medium" | "long") => {
    setNovelLength(length);
    const labels: Record<string, string> = { short: "短篇", medium: "中篇", long: "长篇" };

    setMessages((prev) => [
      ...prev,
      { id: `user-length`, sender: "user", type: "card-selection", content: `我想写${labels[length]}` },
    ]);

    // After length selection, directly generate characters
    const thinkingId = `thinking-auto-char-after-length`;
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
    }, 300);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingId),
        {
          id: "model-characters",
          sender: "model",
          type: "character-card",
          prompt: `好的，${labels[length]}！以下是角色档案，看看感觉怎么样？`,
          data: dataRef.current.sceneCharacterCard,
        },
      ]);
      setCurrentRound(12);
      setCreationStage(3);
      setAgentStageData("characters", dataRef.current.sceneCharacterCard);
    }, 2500);
  }, [setCreationStage, setAgentStageData]);

  // Proceed to next round (after adjust or skip)
  // Rounds 1-3: inspiration → settings card at end
  // Rounds 5-7: worldbuilding → worldbuilding card at end
  const proceedToNextRound = useCallback(
    (fromRound: number) => {
      setAwaitingAdjust(false);

      // Inspiration rounds (1-3)
      if (fromRound >= 1 && fromRound < 3) {
        const thinkingId = `thinking-r${fromRound + 1}`;
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);

        setTimeout(() => {
          const nextRound = dataRef.current.sceneInspirationRounds[fromRound];
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-r${fromRound + 1}`,
              sender: "model",
              type: "inspiration",
              prompt: nextRound.prompt,
              cards: nextRound.cards,
              round: fromRound + 1,
            },
          ]);
          setCurrentRound(fromRound + 1);
        }, 1500);
        return;
      }

      // Inspiration round 3 done → generate settings card
      if (fromRound === 3) {
        const thinkingId = `thinking-settings`;
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);

        setTimeout(() => {
          const isRefinement = flowMode === "inspiration";
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-settings",
              sender: "model",
              type: "settings-card",
              prompt: dataRef.current.isMarketing
                ? isRefinement
                  ? "根据你的灵感偏好，我重新整理了视频策略Brief。看看现在怎么样？"
                  : "收到！我为你整理了视频策略Brief。确认无误就可以开始设计故事线了，有需要调整的随时告诉我。"
                : dataRef.current.isKnowledge
                ? isRefinement
                  ? "根据你的灵感偏好，我重新整理了分析配置。看看现在怎么样？"
                  : "已读取完毕！以下是书籍总览和分析配置。确认无误就可以开始深入分析了，有需要调整的随时告诉我。"
                : isRefinement
                  ? "根据你的灵感偏好，我更新了创作设定。看看现在怎么样？"
                  : "根据你的灵感方向，我为你整理了以下创作设定。确认无误就可以选择篇幅了，你也可以告诉我需要调整的地方。",
              settings: dataRef.current.sceneSettingsCard,
            },
          ]);
          setCurrentRound(4);
          setCreationStage(1);
          setAgentStageData("settings", dataRef.current.sceneSettingsCard);
        }, 2500);
        return;
      }

      // Worldbuilding rounds (5-7)
      if (fromRound >= 5 && fromRound < 7) {
        const thinkingId = `thinking-r${fromRound + 1}`;
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);

        setTimeout(() => {
          const nextWb = dataRef.current.sceneWorldbuildingRounds[fromRound - 5 + 1];
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-r${fromRound + 1}`,
              sender: "model",
              type: "inspiration",
              prompt: nextWb.prompt,
              cards: nextWb.cards,
              round: fromRound + 1,
            },
          ]);
          setCurrentRound(fromRound + 1);
        }, 1500);
        return;
      }

      // Worldbuilding round 7 done → generate worldbuilding card
      if (fromRound === 7) {
        const thinkingId = `thinking-wb-card`;
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-worldbuilding",
              sender: "model",
              type: "worldbuilding-card",
              prompt: flowMode === "inspiration"
                ? "根据你的灵感偏好，我更新了世界观。看看现在怎么样？"
                : "世界观构建完成！你可以在编辑区查看完整内容，觉得没问题就可以开始创建角色了，有想调整的也可以直接告诉我。",
              data: dataRef.current.sceneWorldbuilding,
            },
          ]);
          setCurrentRound(8);
          setCreationStage(2);
          setAgentStageData("worldbuilding", dataRef.current.sceneWorldbuilding);
        }, 2500);
        return;
      }

      // Character rounds (9-11)
      if (fromRound >= 9 && fromRound < 11) {
        const thinkingId = `thinking-r${fromRound + 1}`;
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);

        setTimeout(() => {
          const nextChar = dataRef.current.sceneCharacterRounds[fromRound - 9 + 1];
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-r${fromRound + 1}`,
              sender: "model",
              type: "inspiration",
              prompt: nextChar.prompt,
              cards: nextChar.cards,
              round: fromRound + 1,
            },
          ]);
          setCurrentRound(fromRound + 1);
        }, 1500);
        return;
      }

      // Character round 11 done → generate character card
      if (fromRound === 11) {
        const thinkingId = `thinking-char-card`;
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-characters",
              sender: "model",
              type: "character-card",
              prompt: flowMode === "inspiration"
                ? "根据你的灵感偏好，我更新了角色档案。看看现在怎么样？"
                : "角色创建完成！你可以在编辑区查看完整的角色档案，觉得没问题就可以开始生成大纲了，想调整随时告诉我。",
              data: dataRef.current.sceneCharacterCard,
            },
          ]);
          setCurrentRound(12);
          setCreationStage(3);
          setAgentStageData("characters", dataRef.current.sceneCharacterCard);
        }, 2500);
        return;
      }
    },
    [setCreationStage, flowMode, setAgentStageData]
  );

  // Handle card selection → show micro-adjust prompt
  const handleCardSelect = useCallback(
    (round: number, cardIndex: number) => {
      if (selections[round] !== undefined) return;

      // Get card data from the right source
      const isWb = round >= 5 && round <= 7;
      const isChar = round >= 9 && round <= 11;
      const roundData = isChar
        ? dataRef.current.sceneCharacterRounds[round - 9]
        : isWb
        ? dataRef.current.sceneWorldbuildingRounds[round - 5]
        : dataRef.current.sceneInspirationRounds[round - 1];
      const cardText = roundData.cards[cardIndex].text;

      setSelections((prev) => ({ ...prev, [round]: cardIndex }));

      setMessages((prev) => [
        ...prev,
        { id: `user-r${round}`, sender: "user", type: "card-selection", content: cardText },
      ]);

      // Show thinking, then micro-adjust prompt
      const thinkingId = `thinking-adj-${round}`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: `model-adj-${round}`,
            sender: "model",
            type: "micro-adjust",
            prompt: roundData.adjustPrompt,
            round,
          },
        ]);
        setAwaitingAdjust(true);
        setAdjustRound(round);
      }, 1500);
    },
    [selections]
  );

  // Handle "就这样" skip
  const handleSkipAdjust = useCallback(() => {
    setMessages((prev) => [...prev, { id: `user-skip-adj-${adjustRound}`, sender: "user" as const, type: "text" as const, content: "跳过" }]);
    setAwaitingAdjust(false);
    proceedToNextRound(adjustRound);
  }, [adjustRound, proceedToNextRound]);

  // Handle "跳过，直接生成" — skip remaining inspiration rounds, jump to card generation
  const handleSkipToGenerate = useCallback(() => {
    setMessages((prev) => [...prev, { id: `user-skip-gen-${currentRound}`, sender: "user" as const, type: "text" as const, content: "跳过，直接生成" }]);
    setAwaitingAdjust(false);
    // Determine which final round to call based on currentRound
    if (currentRound >= 1 && currentRound <= 3) {
      // Inspiration phase → jump to settings card (as if round 3 done)
      proceedToNextRound(3);
    } else if (currentRound >= 5 && currentRound <= 7) {
      // Worldbuilding phase → jump to worldbuilding card (as if round 7 done)
      proceedToNextRound(7);
    } else if (currentRound >= 9 && currentRound <= 11) {
      // Character phase → jump to character card (as if round 11 done)
      proceedToNextRound(11);
    }
  }, [currentRound, proceedToNextRound]);

  // Handle refresh
  // Mock generate a chapter with streaming effect
  const generateChapter = useCallback(
    (chapterIndex: number) => {
      setNovelChapterStatus(chapterIndex, "generating");
      setCurrentNovelChapter(chapterIndex);
      if (chapterIndex > 0) setScrollToChapter(chapterIndex);

      const fullText = dataRef.current.sceneChapterTexts[chapterIndex] || `这是第${chapterIndex + 1}集的正文内容。\n\n（mock内容）故事在这里继续展开...`;

      // Simulate streaming: add text chunk by chunk
      const chars = fullText.split("");
      let current = "";
      const chunkSize = 3;
      let i = 0;

      const streamInterval = setInterval(() => {
        if (i >= chars.length) {
          clearInterval(streamInterval);
          setNovelChapterStatus(chapterIndex, "done");
          setNovelChapterContent(chapterIndex, fullText);
          // Update the existing "正在生成" message instead of appending a new one
          const isShort = dataRef.current.novelLength === "short";
          const totalChapters = isShort ? 1 : dataRef.current.sceneOutlineCard.chapters.length;
          const isSingleChapter = totalChapters <= 1;
          const chTitle = isSingleChapter
            ? (dataRef.current.sceneTitle || "正文")
            : (dataRef.current.sceneOutlineCard.chapters[chapterIndex]?.title || `第${chapterIndex + 1}章`);
          const doneContent = isSingleChapter
            ? `角色档案完成！短篇不需要大纲，直接开始写正文。\n\n《${chTitle}》生成完毕！你可以在编辑区查看。\n\n想调整哪里直接告诉我，比如「开头节奏太慢」「对话再自然一些」。`
            : chapterIndex < totalChapters - 1
            ? `「${chTitle}」生成完毕！你可以在编辑区查看。\n\n想调整直接告诉我，满意就说「继续」写下一章。`
            : `「${chTitle}」生成完毕！全部 ${totalChapters} 章已完成。\n\n想调整任何章节直接告诉我，比如「第三章结尾再加点悬念」。`;
          // Find and update the "正在生成" message for this chapter
          const genMsgId = chapterIndex === 0 ? "model-write-start" : `model-gen-ch-${chapterIndex}`;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === genMsgId ? { ...m, content: doneContent } : m
            )
          );
          // Update progress bar for 正文 stage
          const doneCount = chapterIndex + 1;
          const total = Math.max(totalChapters, 1);
          setStageProgress(doneCount / total);
          return;
        }
        current += chars.slice(i, i + chunkSize).join("");
        i += chunkSize;
        setNovelChapterContent(chapterIndex, current);
      }, 30);
    },
    [setNovelChapterStatus, setNovelChapterContent, setCurrentNovelChapter, setScrollToChapter, setStageProgress]
  );

  const handleRefresh = useCallback(() => {
    // Mock: no-op
  }, []);

  // Handle send
  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: "user", type: "text", content: text },
    ]);

    // If awaiting micro-adjust, user typed adjustment → proceed
    if (awaitingAdjust) {
      const thinkingId = `thinking-adj-ack-${adjustRound}`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: `model-adj-ack-${adjustRound}`,
            sender: "model",
            type: "text",
            content: "收到，已记录你的偏好！",
          },
        ]);
        setTimeout(() => proceedToNextRound(adjustRound), 500);
      }, 1200);
      return;
    }

    // If user types at a card/preview stage, check if it's a confirm or a modification
    const isConfirmIntent = /确认|下一步|方向不错|没问题|生成设定|帮我生成|直接生成|开始写|开始生成/.test(text);

    // Modification request (not a confirm)
    if (!isConfirmIntent && (currentRound === 4 || currentRound === 8 || currentRound === 12 || currentRound === 13)) {
      const thinkingId = `thinking-modify-${Date.now()}`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        if (currentRound === 4) {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-settings-${Date.now()}`,
              sender: "model" as const,
              type: "settings-card" as const,
              prompt: "好的，已根据你的要求调整了设定。看看现在怎么样？",
              settings: dataRef.current.sceneSettingsCard,
            },
          ]);
        } else if (currentRound === 8) {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-worldbuilding-${Date.now()}`,
              sender: "model" as const,
              type: "worldbuilding-card" as const,
              prompt: "好的，已根据你的要求调整了世界观。看看现在怎么样？",
              data: dataRef.current.sceneWorldbuilding,
            },
          ]);
        } else if (currentRound === 12) {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-characters-${Date.now()}`,
              sender: "model" as const,
              type: "character-card" as const,
              prompt: "好的，已根据你的要求调整了角色。看看现在怎么样？",
              data: dataRef.current.sceneCharacterCard,
            },
          ]);
        } else if (currentRound === 13) {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-outline-${Date.now()}`,
              sender: "model" as const,
              type: "outline-card" as const,
              prompt: "好的，已根据你的要求调整了大纲。看看现在怎么样？",
              data: dataRef.current.sceneOutlineCard,
            },
          ]);
        }
      }, 2000);
      return;
    }

    // If at confirm stage (after settings card shown), user confirmed → next step
    if (currentRound === 4) {
      // ── Marketing: show content structure based on platform ──
      if (dataRef.current.isMarketing) {
        const platform = marketingPlatformRef.current || "抖音";
        const platformInfo = marketingPlatforms.find((p) => p.label === platform);
        const contentTypes = platformInfo?.contentTypes || ["short_video"];
        const scenarios = contentTypes
          .map((t) => marketingContentByType[t])
          .filter(Boolean);

        setAutoTitle(dataRef.current.sceneTitle);
        const thinkingId = `thinking-mkt-content`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-content-structure",
              sender: "model",
              type: "content-structure",
              prompt: `商品信息确认！根据「${platform}」平台特点，为你生成了${scenarios.length}套内容结构方案：`,
              scenarios,
            },
          ]);
          setCurrentRound(8);
          setCreationStage(2);
          setAgentStageData("contentStructure", { platform, scenarios });
        }, 2500);
        return;
      }

      // ── Non-marketing: show length selection (novel) or auto-generate worldbuilding (knowledge) ──
      setAutoTitle(dataRef.current.sceneTitle);

      if (scene === "novel") {
        // Novel: show length selection after settings confirm
        const thinkingId = `thinking-length-select`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-length",
              sender: "model",
              type: "length-select",
              prompt: `设定确认！故事暂定为《${dataRef.current.sceneTitle}》（可随时在顶部修改）。\n\n接下来选一下篇幅：`,
            },
          ]);
          setCurrentRound(5); // awaiting length selection
          setCreationStage(2);
        }, 2000);
        return;
      }

      // Knowledge: auto-generate worldbuilding (keep existing behavior)
      const thinkingId = `thinking-auto-wb`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-worldbuilding",
            sender: "model",
            type: "worldbuilding-card",
            prompt: `配置确认！项目暂定为《${dataRef.current.sceneTitle}》。以下是设定体系分析，看看感觉怎么样？`,
            data: dataRef.current.sceneWorldbuilding,
          },
        ]);
        setCurrentRound(8);
        setCreationStage(2);
        setAgentStageData("worldbuilding", dataRef.current.sceneWorldbuilding);
      }, 2500);
      return;
    }

    // If at worldbuilding confirm stage, user confirmed → auto-generate characters
    if (currentRound === 8) {
      const thinkingId = `thinking-auto-char`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-characters",
            sender: "model",
            type: "character-card",
            prompt: dataRef.current.isMarketing
              ? "世界观确认！以下是出镜角色设计，看看感觉怎么样？"
              : dataRef.current.isKnowledge
              ? "设定体系确认！以下是核心角色分析，看看感觉怎么样？"
              : "以下是角色档案，看看感觉怎么样？",
            data: dataRef.current.sceneCharacterCard,
          },
        ]);
        setCurrentRound(12);
        setCreationStage(3);
        setAgentStageData("characters", dataRef.current.sceneCharacterCard);
      }, 2500);
      return;
    }

    // If at character confirm stage, user confirmed
    if (currentRound === 12) {
      // Short story: skip outline, directly generate full text
      if (novelLength === "short") {
        const thinkingId = `thinking-short-write`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);

        setTimeout(() => {
          // Init as single "chapter" with the novel title
          const title = dataRef.current.sceneTitle || "正文";
          initNovelChapters([title]);
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-write-start",
              sender: "model",
              type: "text",
              content: `角色档案完成！短篇不需要大纲，直接开始写正文。\n\n正在为你生成《${title}》...`,
            },
          ]);
          setCurrentRound(14);
          setCreationStage(5);
          setWritingChapter(0);
          generateChapter(0);
        }, 2000);
        return;
      }

      // Medium/Long: auto-generate outline
      const thinkingId = `thinking-auto-outline`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-outline",
            sender: "model",
            type: "outline-card",
            prompt: dataRef.current.isMarketing
              ? "角色确认！以下是分幕脚本，看看感觉怎么样？确认后就可以开始生成详细内容了。"
              : dataRef.current.isKnowledge
              ? "角色确认！以下是结构化分析大纲，确认后就可以开始生成详细报告了。"
              : "角色确认！以下是故事大纲，看看感觉怎么样？确认后就可以开始写正文了。",
            data: dataRef.current.sceneOutlineCard,
          },
        ]);
        setCurrentRound(13);
        setCreationStage(4);
        setAgentStageData("outline", dataRef.current.sceneOutlineCard);
      }, 2500);
      return;
    }

    // If at outline confirm stage, user confirmed → init chapters and wait for user to start
    if (currentRound === 13) {
      // Init novel chapters from outline
      const chapterTitles = dataRef.current.sceneOutlineCard.chapters.map((c) => c.title);
      initNovelChapters(chapterTitles);

      const thinkingId = `thinking-write-start`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-write-start",
            sender: "model",
            type: "text",
            content: dataRef.current.isMarketing
              ? `大纲确认！共 ${chapterTitles.length} 幕，正在生成「${chapterTitles[0]}」...`
              : dataRef.current.isKnowledge
              ? `大纲确认！共 ${chapterTitles.length} 篇，正在生成「${chapterTitles[0]}」...`
              : `大纲确认！共 ${chapterTitles.length} 章，正在生成「${chapterTitles[0]}」...`,
          },
        ]);
        setCurrentRound(14);
        setCreationStage(5);
        setWritingChapter(0);
        generateChapter(0);
      }, 2000);
      return;
    }

    // If in writing mode, user says "继续" or "开始写" → generate next chapter
    if (currentRound === 14) {
      const nextChapter = novelChapters.findIndex((c) => c.status === "pending");
      if (nextChapter >= 0) {
        const thinkingId = `thinking-ch-${nextChapter}`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);

        setTimeout(() => {
          const title = novelChapters[nextChapter]?.title || "";
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-gen-ch-${nextChapter}`,
              sender: "model",
              type: "text",
              content: `好的，正在生成「${title}」...`,
            },
          ]);
          setWritingChapter(nextChapter);
          generateChapter(nextChapter);
        }, 1500);
      } else {
        const thinkingId = `thinking-all-done`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-all-done",
              sender: "model",
              type: "text",
              content: "全部章节生成完毕！\n\n你可以在编辑区点击左上角的目录图标查看和切换章节，随时修改任何内容。如果需要我帮忙润色、改写或调整某一章，直接告诉我就好。",
            },
          ]);
        }, 1500);
      }
      return;
    }

    // Free-form input flow: user typed a description → directly generate settings
    if (flowMode === "none" || flowMode === "freeform") {
      setFlowMode("freeform");

      // ── Marketing: new flow — detect platform, then product info card ──
      if (dataRef.current.isMarketing) {
        const platformKeywords = marketingPlatforms.map((p) => p.label);
        const detectedPlatform = platformKeywords.find((kw) => text.includes(kw));

        // If user is replying to a platform-select question
        if (currentRound === -1) {
          // currentRound -1 = awaiting platform selection from text input
          const platform = detectedPlatform || "抖音";
          marketingPlatformRef.current = platform;
          const thinkingId = `thinking-mkt-product`;
          setTimeout(() => {
            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
          }, 300);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev.filter((m) => m.id !== thinkingId),
              {
                id: "model-settings",
                sender: "model",
                type: "settings-card",
                prompt: `好的，投放平台选择「${platform}」。\n\n以下是整理好的商品信息，确认无误后我会根据${platform}平台特点为你生成内容结构。`,
                settings: marketingProductInfoCard,
              },
            ]);
            setCurrentRound(4);
            setCreationStage(1);
            setAgentStageData("settings", marketingProductInfoCard);
          }, 2000);
          return;
        }

        // First input: check if platform is mentioned
        if (!detectedPlatform) {
          // No platform detected → ask for platform
          const thinkingId = `thinking-mkt-platform`;
          setTimeout(() => {
            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
          }, 300);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev.filter((m) => m.id !== thinkingId),
              {
                id: "model-platform-ask",
                sender: "model",
                type: "platform-select",
                prompt: "收到商品信息！在生成内容之前，请先确认你想投放的内容平台：",
              },
            ]);
            setCurrentRound(-1); // Mark: awaiting platform
          }, 1500);
          return;
        }

        // Platform detected in first input → directly show product info card
        marketingPlatformRef.current = detectedPlatform;
        const thinkingId = `thinking-mkt-product2`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-settings",
              sender: "model",
              type: "settings-card",
              prompt: `收到！投放平台为「${detectedPlatform}」。\n\n以下是整理好的商品信息，确认无误后我会根据${detectedPlatform}平台特点为你生成内容结构。`,
              settings: marketingProductInfoCard,
            },
          ]);
          setCurrentRound(4);
          setCreationStage(1);
          setAgentStageData("settings", marketingProductInfoCard);
        }, 2500);
        return;
      }

      // ── Non-marketing: guide user to fill in setting fields first ──

      // If already in guidance round (-2), user is providing more info → generate settings card
      if (currentRound === -2) {
        const thinkingId = `thinking-ff-settings`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-settings",
              sender: "model",
              type: "settings-card",
              prompt: dataRef.current.isKnowledge
                ? `根据你的描述，我帮你生成了一版分析配置——${getSettingsSummary()}\n\n看看感觉怎么样？确认后我会开始深入分析设定体系，你也可以告诉我想调整的地方。`
                : `根据你的描述，我帮你生成了一版创作设定——${getSettingsSummary()}\n\n看看感觉怎么样？确认后我会为你选择篇幅并创建角色，你也可以告诉我想调整的地方。`,
              settings: dataRef.current.sceneSettingsCard,
            },
          ]);
          setCurrentRound(4);
          setCreationStage(1);
          setAgentStageData("settings", dataRef.current.sceneSettingsCard);
        }, 2500);
        return;
      }

      // First input: analyze user's description and guide them
      const thinkingId = `thinking-ff-guide`;

      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        const guidePrompt = dataRef.current.isKnowledge
          ? `收到！我大概理解了你想分析的方向。\n\n为了生成更精准的分析配置，你可以再补充一些信息：\n· **分析维度** — 想从哪些角度切入？（世界观、角色体系、叙事结构……）\n· **关注重点** — 有特别想深挖的部分吗？\n· **分析深度** — 概览性梳理还是逐层拆解？\n\n当然，你也可以直接说「帮我生成」，我会根据已有信息先出一版。`
          : `收到！这个方向很有意思。\n\n为了生成更贴合你想法的设定，可以再聊聊：\n· **故事基调** — 整体偏什么风格？（轻松日常 / 热血燃向 / 悬疑烧脑 / 虐心催泪……）\n· **故事走向** — 大致的情节发展？（逆袭 / 探案 / 成长 / 复仇……）\n· **核心冲突** — 主角面临的最大矛盾是什么？\n\n想到什么说什么就行，或者直接说「帮我生成」，我先出一版设定。`;
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-guide",
            sender: "model",
            type: "guide",
            prompt: guidePrompt,
          },
        ]);
        setCurrentRound(-2);
      }, 2000);
    }
  }, [input, awaitingAdjust, adjustRound, currentRound, flowMode, writingChapter, novelChapters, novelLength, setCreationStage, setStageProgress, setAutoTitle, setAgentStageData, proceedToNextRound, initNovelChapters, generateChapter, getSettingsSummary]);

  // Quick confirm: set input text then trigger send on next render
  const pendingSend = useRef(false);
  const quickConfirm = useCallback((text: string) => {
    setInput(text);
    pendingSend.current = true;
  }, []);

  useEffect(() => {
    if (pendingSend.current && input.trim()) {
      pendingSend.current = false;
      handleSend();
    }
  }, [input, handleSend]);

  // Collect all keywords from all rounds for the "fav bar"

  // ── Mode Selection: floating overlay centered on page ──
  if ((scene === "novel" || scene === "screenplay") && workMode === null) {
    const sceneLabel = scene === "novel" ? "小说" : "剧本";
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-md w-full mx-4">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-1.5">选择创作模式</h2>
            <p className="text-sm text-gray-400">{sceneLabel}创作 · 选择适合你的方式开始</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleModeSelect("agent")}
              className="group flex-1 bg-white rounded-xl border-2 border-indigo-400 ring-2 ring-indigo-100 p-4 text-left shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mb-2.5">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">引导创作</h3>
              <p className="text-xs text-gray-500 leading-relaxed">自由对话，灵活探索</p>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">通过 AI 对话完成灵感→设定→角色→大纲→正文的创作流程</p>
            </button>

            <button
              onClick={() => handleModeSelect("workflow")}
              className="group flex-1 bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-indigo-300 hover:shadow-md transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mb-2.5 group-hover:bg-indigo-50 transition">
                <ListChecks className="w-4 h-4 text-gray-600 group-hover:text-indigo-500 transition" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">独立创作</h3>
              <p className="text-xs text-gray-500 leading-relaxed">自主配置，自由编辑</p>
              <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">在配置面板中设定参数，按步骤生成，每一步可精确调控</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      <style>{tipStyles}</style>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5" ref={scrollRef}>

        {/* Empty state: background guide */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center select-none">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-200/50">
              <span className="text-white text-lg font-bold">言</span>
            </div>
            <p className="text-base font-medium text-gray-700 mb-1">
              {isMarketing ? "嗨！我是你的带货创作助手" : isKnowledge ? "嗨！我是你的作品分析助手" : "嗨！我是你的创意写作助手"}
            </p>
            <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed">
              {isMarketing
                ? "我可以帮你策划带货脚本、优化卖点文案，随时向我提问吧！"
                : isKnowledge
                ? "我可以帮你拆解作品设定、分析角色体系，随时向我提问吧！"
                : "我可以帮你构思情节、打磨文笔、解答创作疑问，随时向我提问吧！"}
            </p>
          </div>
        )}
        {messages.map((msg, idx) => {
          // ── Thinking indicator ──
          if (msg.type === "thinking") {
            return (
              <div key={msg.id} className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            );
          }

          // ── Model: inspiration cards ──
          if (msg.sender === "model" && msg.type === "inspiration") {
            const isActive = currentRound === msg.round && selections[msg.round] === undefined;
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                {/* Cards */}
                <div className="pl-8 space-y-2">
                  {msg.cards.map((card, i) => {
                    const isSelected = selections[msg.round] === i;
                    const isOther = selections[msg.round] !== undefined && !isSelected;
                    return (
                      <div key={i}>
                        <button
                          onClick={() => isActive && handleCardSelect(msg.round, i)}
                          disabled={!isActive}
                          className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-indigo-400 bg-indigo-50/80 shadow-sm"
                              : isOther
                              ? "border-transparent bg-gray-50 opacity-40"
                              : "border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm cursor-pointer"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5 ${
                                isSelected
                                  ? "bg-indigo-500 text-white"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {i + 1}
                            </span>
                            <p className={`text-sm leading-relaxed ${isSelected ? "text-gray-800" : "text-gray-600"}`}>
                              {card.text}
                            </p>
                          </div>
                        </button>

                        {/* Keywords */}
                        {!isOther && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5 ml-8">
                            {card.keywords.map((kw) => {
                              const isFav = favKeywords.has(kw);
                              return (
                                <button
                                  key={kw}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleKeyword(kw);
                                  }}
                                  className={`px-2 py-0.5 text-[11px] rounded-full border transition-all duration-150 flex items-center gap-1 ${
                                    isFav
                                      ? "bg-pink-50 text-pink-500 border-pink-200"
                                      : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200 hover:text-gray-500"
                                  }`}
                                >
                                  <Heart className={`w-2.5 h-2.5 ${isFav ? "fill-pink-400" : ""}`} />
                                  {kw}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Refresh & Skip buttons */}
                  {isActive && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={handleSkipToGenerate}
                          data-tip={msg.round <= 3 ? "跳过剩余轮次，直接生成创作设定" : msg.round <= 7 ? "跳过剩余轮次，直接更新设定" : "跳过剩余轮次，直接生成角色档案"}
                          className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          跳过，直接生成
                        </button>
                        <button
                          onClick={() => handleRefresh()}
                          data-tip="重新生成本轮选项"
                          className="px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                          换一换
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // ── Model: micro-adjust prompt ──
          if (msg.sender === "model" && msg.type === "micro-adjust") {
            const isActive = awaitingAdjust && adjustRound === msg.round;
            return (
              <div key={msg.id} className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>
                {isActive && (
                  <div className="pl-8 space-y-2">
                    <button
                      onClick={handleSkipAdjust}
                      data-tip="跳过微调，进入下一轮选择"
                      className="px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                    >
                      跳过
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // ── Model: text message ──
          if (msg.sender === "model" && msg.type === "text") {
            const isChapterDone = msg.id.startsWith("model-ch-done-");
            const chapterIdx = isChapterDone ? parseInt(msg.id.replace("model-ch-done-", ""), 10) : -1;
            const hasNextChapter = isChapterDone && novelChapters.length > 1 && chapterIdx < novelChapters.length - 1;
            const isLastMessage = idx === messages.length - 1;
            return (
              <div key={msg.id} className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">{msg.content}</div>
                {hasNextChapter && isLastMessage && (
                  <div className="pl-8 mt-2">
                    <button
                      onClick={() => {
                        // Simulate user saying "继续"
                        setMessages((prev) => [
                          ...prev,
                          { id: `user-continue-${chapterIdx}`, sender: "user" as const, type: "text" as const, content: "继续" },
                        ]);
                        const nextCh = chapterIdx + 1;
                        const thinkingId = `thinking-ch-${nextCh}`;
                        setTimeout(() => {
                          setMessages((prev) => [...prev, { id: thinkingId, sender: "model" as const, type: "thinking" as const }]);
                        }, 300);
                        setTimeout(() => {
                          const title = novelChapters[nextCh]?.title || "";
                          setMessages((prev) => [
                            ...prev.filter((m) => m.id !== thinkingId),
                            { id: `model-gen-ch-${nextCh}`, sender: "model" as const, type: "text" as const, content: `好的，正在生成「${title}」...` },
                          ]);
                          setWritingChapter(nextCh);
                          generateChapter(nextCh);
                        }, 1500);
                      }}
                      className="px-4 py-2 text-gray-700 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                    >
                      ▶ 继续生成下一章
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // ── Model: screenplay subtype selection ──
          if (msg.sender === "model" && msg.type === "subtype-select") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                {!screenplaySubtype && (
                  <div className="pl-8 space-y-2">
                    <button
                      onClick={() => handleSubtypeSelect("short_drama")}
                      className="w-full text-left p-3.5 rounded-xl border-2 border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5 bg-gray-100 text-gray-400">1</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800 mb-1">短剧</p>
                          <p className="text-xs text-gray-500 leading-relaxed">真人出镜短视频剧本，强节奏、强钩子，单集60-120秒</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSubtypeSelect("comic_drama")}
                      className="w-full text-left p-3.5 rounded-xl border-2 border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5 bg-gray-100 text-gray-400">2</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800 mb-1">漫剧</p>
                          <p className="text-xs text-gray-500 leading-relaxed">动态漫画 / AI绘图剧本，分镜驱动，画面感优先</p>
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {screenplaySubtype && (
                  <div className="pl-8 space-y-2">
                    <div className="w-full text-left p-3.5 rounded-xl border-2 border-indigo-400 bg-indigo-50/80 shadow-sm">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5 bg-indigo-500 text-white">
                          {screenplaySubtype === "short_drama" ? "1" : "2"}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-800 mb-1">{screenplaySubtype === "short_drama" ? "短剧" : "漫剧"}</p>
                          <p className="text-xs text-gray-500 leading-relaxed">{screenplaySubtype === "short_drama" ? "真人出镜短视频剧本，强节奏、强钩子，单集60-120秒" : "动态漫画 / AI绘图剧本，分镜驱动，画面感优先"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // ── Model: length selection (novel) ──
          if (msg.sender === "model" && msg.type === "length-select") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">{msg.prompt}</div>

                {!novelLength && (
                  <div className="pl-8 space-y-2">
                    {([
                      { key: "short" as const, label: "短篇", desc: "1-3万字，一气呵成，无需分章" },
                      { key: "medium" as const, label: "中篇", desc: "3-10万字，完整起承转合" },
                      { key: "long" as const, label: "长篇", desc: "10万字以上，多线叙事，章节丰富" },
                    ]).map((opt, i) => (
                      <button
                        key={opt.key}
                        onClick={() => handleLengthSelect(opt.key)}
                        className="w-full text-left p-3.5 rounded-xl border-2 border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm cursor-pointer transition-all duration-200"
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5 bg-gray-100 text-gray-400">{i + 1}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-800 mb-0.5">{opt.label}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {novelLength && (
                  <div className="pl-8 space-y-2">
                    <div className="w-full text-left p-3.5 rounded-xl border-2 border-indigo-400 bg-indigo-50/80 shadow-sm">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5 bg-indigo-500 text-white">
                          {novelLength === "short" ? "1" : novelLength === "medium" ? "2" : "3"}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-gray-800 mb-0.5">
                            {novelLength === "short" ? "短篇" : novelLength === "medium" ? "中篇" : "长篇"}
                          </p>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {novelLength === "short" ? "1-3万字，一气呵成，无需分章" : novelLength === "medium" ? "3-10万字，完整起承转合" : "10万字以上，多线叙事，章节丰富"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          // ── Model: platform select (marketing) ──
          if (msg.sender === "model" && msg.type === "platform-select") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                {!marketingPlatformRef.current && (
                  <div className="pl-8 grid grid-cols-3 gap-2">
                    {marketingPlatforms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          marketingPlatformRef.current = p.label;
                          setMessages((prev) => [
                            ...prev,
                            { id: `user-platform-${Date.now()}`, sender: "user", type: "text", content: p.label },
                          ]);
                          const thinkingId = `thinking-mkt-pinfo`;
                          setTimeout(() => {
                            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                          }, 300);
                          setTimeout(() => {
                            setMessages((prev) => [
                              ...prev.filter((m) => m.id !== thinkingId),
                              {
                                id: "model-settings",
                                sender: "model",
                                type: "settings-card",
                                prompt: `好的，投放平台选择「${p.label}」。\n\n以下是整理好的商品信息，确认无误后我会根据${p.label}平台特点为你生成内容结构。`,
                                settings: marketingProductInfoCard,
                              },
                            ]);
                            setCurrentRound(4);
                            setCreationStage(1);
                            setAgentStageData("settings", marketingProductInfoCard);
                          }, 2000);
                        }}
                        className="p-3 rounded-xl border-2 border-gray-100 bg-white hover:border-indigo-200 hover:shadow-sm cursor-pointer transition-all text-center"
                      >
                        <p className="text-sm font-medium text-gray-800">{p.label}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                )}

                {marketingPlatformRef.current && (
                  <div className="pl-8">
                    <div className="inline-block px-4 py-2 rounded-xl border-2 border-indigo-400 bg-indigo-50/80 text-sm font-medium text-indigo-700">
                      {marketingPlatformRef.current}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          {/* ── Model: content structure (marketing) ── */}
          if (msg.sender === "model" && msg.type === "content-structure") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                <div className="pl-8 space-y-3">
                  {msg.scenarios.map((scenario, si) => (
                    <div
                      key={si}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer hover:border-indigo-200 transition"
                      onClick={() => {
                        setCreationStage(2);
                        setAgentStageData("contentStructure", { platform: marketingPlatformRef.current, scenarios: msg.scenarios });
                      }}
                    >
                      {/* Scenario header */}
                      <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={
                            "text-[10px] px-2 py-0.5 rounded font-medium " + (
                            scenario.type === "short_video" ? "bg-rose-50 text-rose-600" :
                            scenario.type === "live_script" ? "bg-amber-50 text-amber-600" :
                            "bg-emerald-50 text-emerald-600")
                          }>
                            {scenario.typeLabel}
                          </span>
                          <span className="text-sm font-medium text-gray-800">{scenario.title}</span>
                        </div>
                        <span className="text-[10px] text-gray-400">{scenario.duration}</span>
                      </div>

                      {/* Structure */}
                      <div className="px-4 py-2">
                        <p className="text-xs text-gray-500 mb-2">
                          <span className="text-gray-400">结构：</span>{scenario.structure}
                        </p>
                      </div>

                      {/* Sections */}
                      <div className="px-4 pb-3">
                        <div className="space-y-1.5">
                          {scenario.sections.map((sec, si2) => (
                            <div key={si2} className="flex items-start gap-2 text-xs">
                              <span className="text-gray-400 shrink-0 w-4 text-right">{si2 + 1}.</span>
                              <div>
                                <span className="font-medium text-gray-700">{sec.title}</span>
                                {sec.duration && <span className="text-gray-400 ml-1">{sec.duration}</span>}
                                <p className="text-gray-500 mt-0.5 leading-relaxed">{sec.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="pl-8 mt-2 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => quickConfirm("确认内容结构，开始生成")}
                      data-tip="确认内容结构，开始生成脚本"
                      className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                    >
                      确认内容结构，开始生成
                    </button>
                    <button
                      onClick={() => quickConfirm("换一换")}
                      data-tip="重新生成内容结构"
                      className="px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                      换一换
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // ── Model: welcome message ──
          if (msg.sender === "model" && msg.type === "welcome") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">{msg.prompt}</div>

                {/* Entry button */}
                {flowMode === "none" && (
                  <div className="pl-8 mt-2">
                    <button
                      onClick={() => {
                        setFlowMode("freeform");
                        setMessages((prev) => [...prev, { id: `user-help-me-${Date.now()}`, sender: "user", type: "text", content: dataRef.current.isMarketing ? "帮我想一个商品案例" : "帮我想一个" }]);
                        const thinkingId = `thinking-direct-settings`;
                        setTimeout(() => {
                          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                        }, 300);
                        setTimeout(() => {
                          if (dataRef.current.isMarketing) {
                            // Marketing: show sample product info card + default platform
                            marketingPlatformRef.current = "抖音";
                            setMessages((prev) => [
                              ...prev.filter((m) => m.id !== thinkingId),
                              {
                                id: "model-settings",
                                sender: "model",
                                type: "settings-card",
                                prompt: `我帮你生成了一个样例商品——隐形蓝牙耳机 Pro，默认投放平台为抖音。\n\n确认商品信息后，我会根据抖音平台特点为你生成内容结构。`,
                                settings: marketingProductInfoCard,
                              },
                            ]);
                          } else {
                            setMessages((prev) => [
                              ...prev.filter((m) => m.id !== thinkingId),
                              {
                                id: "model-settings",
                                sender: "model",
                                type: "settings-card",
                                prompt: dataRef.current.isKnowledge
                                  ? `我帮你生成了一版分析配置——${getSettingsSummary()}\n\n看看感觉怎么样？确认后我会开始深入分析设定体系，你也可以告诉我想调整的地方。`
                                  : `我帮你生成了一版创作设定——${getSettingsSummary()}\n\n看看感觉怎么样？确认后我会为你选择篇幅并创建角色，你也可以告诉我想调整的地方。`,
                                settings: dataRef.current.sceneSettingsCard,
                              },
                            ]);
                          }
                          setCurrentRound(4);
                          setCreationStage(1);
                          setAgentStageData("settings", dataRef.current.isMarketing ? marketingProductInfoCard : dataRef.current.sceneSettingsCard);
                        }, 2500);
                      }}
                      className="px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                    >
                      {isMarketing ? "用样例商品体验" : "帮我想一个"}
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // ── Model: stage intro ──
          if (msg.sender === "model" && msg.type === "stage-intro") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">{msg.prompt}</div>
              </div>
            );
          }

          // ── Model: guide (first-input analysis) ──
          if (msg.sender === "model" && msg.type === "guide") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.prompt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                {currentRound === -2 && (
                  <div className="pl-8 mt-1">
                    <button
                      onClick={() => {
                        setFlowMode("freeform");
                        setMessages((prev) => [...prev, { id: `user-gen-now-${Date.now()}`, sender: "user", type: "text", content: "帮我生成" }]);
                        const thinkingId = `thinking-ff-settings`;
                        setTimeout(() => {
                          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                        }, 300);
                        setTimeout(() => {
                          setMessages((prev) => [
                            ...prev.filter((m) => m.id !== thinkingId),
                            {
                              id: "model-settings",
                              sender: "model",
                              type: "settings-card",
                              prompt: dataRef.current.isKnowledge
                                ? `根据你的描述，我帮你生成了一版分析配置——${getSettingsSummary()}\n\n看看感觉怎么样？确认后我会开始深入分析设定体系，你也可以告诉我想调整的地方。`
                                : `根据你的描述，我帮你生成了一版创作设定——${getSettingsSummary()}\n\n看看感觉怎么样？确认后我会为你选择篇幅并创建角色，你也可以告诉我想调整的地方。`,
                              settings: dataRef.current.sceneSettingsCard,
                            },
                          ]);
                          setCurrentRound(4);
                          setCreationStage(1);
                          setAgentStageData("settings", dataRef.current.sceneSettingsCard);
                        }, 2500);
                      }}
                      data-tip="根据已有信息直接生成设定"
                      className="px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                    >
                      直接生成设定
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // ── User: card selection ──
          if (msg.sender === "user" && msg.type === "card-selection") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] shadow-sm">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          }

          // ── User: text message ──
          if (msg.sender === "user" && msg.type === "text") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] shadow-sm">
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            );
          }

          // ── Model: settings card ──
          if (msg.sender === "model" && msg.type === "settings-card") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                {/* Settings Card - click to expand/collapse */}
                <div className="pl-8">
                  <div
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative cursor-pointer hover:border-indigo-200 transition"
                    onClick={() => {
                      setCreationStage(1);
                      setAgentStageData("settings", msg.settings);
                    }}
                  >
                    <div className="max-h-[160px] overflow-hidden">
                      {Object.entries(msg.settings).map(([group, items], gi) => (
                        <div key={group}>
                          {gi > 0 && <div className="border-t border-gray-100" />}
                          <div className="px-4 py-3">
                            <h4 className="text-xs font-semibold text-gray-500 mb-2.5">{group}</h4>
                            <div className="space-y-2">
                              {items.map((item) => (
                                <div key={item.label} className="flex items-start gap-2">
                                  <span className="text-xs text-gray-400 w-16 shrink-0 pt-0.5">{item.label}</span>
                                  <div className="flex flex-wrap gap-1">
                                    {item.value.split(" · ").map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Gradient fade overlay */}
                    <div className="absolute bottom-8 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    <div className="relative px-4 py-2.5 text-center border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">点击在编辑区查看完整设定</span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  {currentRound === 4 && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => quickConfirm(isMarketing ? "确认商品信息，生成内容结构" : "确认设定，进入下一步")}
                          data-tip={isMarketing ? "确认进入内容生成" : "确认进入篇幅选择"}
                          className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          下一步
                        </button>
                        <button
                          onClick={() => {
                            setMessages((prev) => [...prev, { id: `user-regen-${Date.now()}`, sender: "user" as const, type: "text" as const, content: "换一换" }]);
                            if (isMarketing) {
                              const thinkingId = `thinking-regen-settings`;
                              setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                              setTimeout(() => {
                                setMessages((prev) => [
                                  ...prev.filter((m) => m.id !== thinkingId),
                                  { id: `model-settings-${Date.now()}`, sender: "model" as const, type: "settings-card" as const, prompt: "已重新整理商品信息，看看这个怎么样？", settings: marketingProductInfoCard },
                                ]);
                                setAgentStageData("settings", marketingProductInfoCard);
                              }, 2000);
                            } else {
                              novelVariantRef.current = novelVariantRef.current === 0 ? 1 : 0;
                              const altData = novelVariantRef.current === 1 ? mockSettingsAlt : mockSettings;
                              const thinkingId = `thinking-regen-settings`;
                              setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                              setTimeout(() => {
                                setMessages((prev) => [
                                  ...prev.filter((m) => m.id !== thinkingId),
                                  { id: `model-settings-${Date.now()}`, sender: "model" as const, type: "settings-card" as const, prompt: "已重新生成一版设定，看看这个怎么样？", settings: altData },
                                ]);
                                setAgentStageData("settings", altData);
                              }, 2000);
                            }
                          }}
                          data-tip="重新生成设定"
                          className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          换一换
                        </button>
                        {!isMarketing && (
                          <button
                            onClick={() => {
                              setMessages((prev) => [...prev, { id: `user-refine-settings-${Date.now()}`, sender: "user" as const, type: "text" as const, content: "继续完善" }]);
                              const thinkingId = `thinking-refine-insp`;
                              setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                              setTimeout(() => {
                                const r1 = dataRef.current.sceneInspirationRounds[0];
                                setMessages((prev) => [
                                  ...prev.filter((m) => m.id !== thinkingId),
                                  { id: "model-r1", sender: "model", type: "inspiration", prompt: "好的，让我们通过几个选择来完善细节吧！\n\n" + r1.prompt, cards: r1.cards, round: 1 },
                                ]);
                                setCurrentRound(1);
                                setFlowMode("inspiration");
                              }, 1500);
                            }}
                            data-tip="通过灵感卡片细化设定"
                            className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                          >
                            继续完善
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // ── Model: worldbuilding card ──
          if (msg.sender === "model" && msg.type === "worldbuilding-card") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                {/* Worldbuilding Card - click to expand/collapse */}
                <div className="pl-8">
                  <div
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative cursor-pointer hover:border-indigo-200 transition"
                    onClick={() => {
                      setCreationStage(2);
                      setAgentStageData("worldbuilding", msg.data);
                    }}
                  >
                    <div className="max-h-[200px] overflow-hidden">
                      {/* Summary */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">故事世界</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{msg.data.summary}</p>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Scenes */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">核心场景</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {msg.data.scenes.map((s) => (
                              <span key={s.name} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                                {s.name}
                              </span>
                            ))}
                          </div>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Timeline */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">时间线</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{msg.data.timeline}</p>
                      </div>
                    </div>
                    {/* Gradient fade */}
                    <div className="absolute bottom-8 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    <div className="relative px-4 py-2.5 text-center border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">点击在编辑区查看完整世界观</span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  {currentRound === 8 && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => quickConfirm("确认世界观，进入下一步")}
                          data-tip="确认进入角色设计"
                          className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          下一步
                        </button>
                        <button
                          onClick={() => {
                            setMessages((prev) => [...prev, { id: `user-regen-wb-${Date.now()}`, sender: "user" as const, type: "text" as const, content: "换一换" }]);
                            const thinkingId = `thinking-regen-wb`;
                            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                            setTimeout(() => {
                              setMessages((prev) => [
                                ...prev.filter((m) => m.id !== thinkingId),
                                { id: `model-wb-${Date.now()}`, sender: "model" as const, type: "worldbuilding-card" as const, prompt: "已重新生成一版世界观，看看这个怎么样？", data: dataRef.current.sceneWorldbuilding },
                              ]);
                              setAgentStageData("worldbuilding", dataRef.current.sceneWorldbuilding);
                            }, 2000);
                          }}
                          data-tip="重新生成世界观"
                          className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          换一换
                        </button>
                        <button
                          onClick={() => {
                            setMessages((prev) => [...prev, { id: `user-refine-wb-${Date.now()}`, sender: "user" as const, type: "text" as const, content: "继续完善" }]);
                            const thinkingId = `thinking-refine-wb`;
                            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                            setTimeout(() => {
                              const r1 = dataRef.current.sceneWorldbuildingRounds[0];
                              setMessages((prev) => [
                                ...prev.filter((m) => m.id !== thinkingId),
                                { id: "model-r5", sender: "model", type: "inspiration", prompt: "好的，让我们通过几个选择来完善世界观细节吧！" + r1.prompt, cards: r1.cards, round: 5 },
                              ]);
                              setCurrentRound(5);
                              setFlowMode("inspiration");
                            }, 1500);
                          }}
                          data-tip="通过灵感卡片细化世界观"
                          className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          继续完善
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // ── Model: character card ──
          if (msg.sender === "model" && msg.type === "character-card") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                {/* Character Card - click to expand/collapse */}
                <div className="pl-8">
                  <div
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative cursor-pointer hover:border-indigo-200 transition"
                    onClick={() => {
                      setCreationStage(3);
                      setAgentStageData("characters", msg.data);
                    }}
                  >
                    <div className="max-h-[200px] overflow-hidden">
                      {/* Female lead */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">女主角</h4>
                        <p className="text-sm font-medium text-indigo-600">{msg.data.femaleLead.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{msg.data.femaleLead.identity}</p>
                        <p className="text-xs text-gray-600 mt-1">{msg.data.femaleLead.appearance} · {msg.data.femaleLead.personality}</p>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Male lead */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">男主角</h4>
                        <p className="text-sm font-medium text-indigo-600">{msg.data.maleLead.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{msg.data.maleLead.identity}</p>
                        <p className="text-xs text-gray-600 mt-1">{msg.data.maleLead.appearance} · {msg.data.maleLead.personality}</p>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Supporting */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">关键配角</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {msg.data.supporting.map((c) => (
                              <span key={c.name} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full">
                                {c.name}
                              </span>
                            ))}
                          </div>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    <div className="relative px-4 py-2.5 text-center border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">点击在编辑区查看完整角色档案</span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  {currentRound === 12 && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => quickConfirm("确认角色，进入下一步")}
                          data-tip="确认进入大纲生成"
                          className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          下一步
                        </button>
                        <button
                          onClick={() => {
                            setMessages((prev) => [...prev, { id: `user-regen-char-${Date.now()}`, sender: "user" as const, type: "text" as const, content: "换一换" }]);
                            const thinkingId = `thinking-regen-char`;
                            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                            setTimeout(() => {
                              setMessages((prev) => [
                                ...prev.filter((m) => m.id !== thinkingId),
                                { id: `model-char-${Date.now()}`, sender: "model" as const, type: "character-card" as const, prompt: "已重新生成一版角色档案，看看这个怎么样？", data: dataRef.current.sceneCharacterCard },
                              ]);
                              setAgentStageData("characters", dataRef.current.sceneCharacterCard);
                            }, 2000);
                          }}
                          data-tip="重新生成角色档案"
                          className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          换一换
                        </button>
                        <button
                          onClick={() => {
                            setMessages((prev) => [...prev, { id: `user-refine-char-${Date.now()}`, sender: "user" as const, type: "text" as const, content: "继续完善" }]);
                            const thinkingId = `thinking-refine-char`;
                            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                            setTimeout(() => {
                              const r1 = dataRef.current.sceneCharacterRounds[0];
                              setMessages((prev) => [
                                ...prev.filter((m) => m.id !== thinkingId),
                                { id: "model-r9", sender: "model", type: "inspiration", prompt: "好的，让我们通过几个选择来完善角色细节吧！" + r1.prompt, cards: r1.cards, round: 9 },
                              ]);
                              setCurrentRound(9);
                              setFlowMode("inspiration");
                            }, 1500);
                          }}
                          data-tip="通过灵感卡片细化角色"
                          className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          继续完善
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // ── Model: outline card ──
          if (msg.sender === "model" && msg.type === "outline-card") {
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pl-8">{msg.prompt}</p>

                {/* Outline Card - click to expand/collapse */}
                <div className="pl-8">
                  <div
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative cursor-pointer hover:border-indigo-200 transition"
                    onClick={() => {
                      setCreationStage(4);
                      setAgentStageData("outline", msg.data);
                    }}
                  >
                    <div className="max-h-[220px] overflow-hidden">
                      {/* Structure info */}
                      <div className="px-4 py-3 flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">{msg.data.structure}</span>
                        <span className="text-xs text-gray-400">{msg.data.totalChapters}章 · {msg.data.estimatedWords}</span>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Chapter list */}
                      <div className="px-4 py-2">
                        {msg.data.chapters.slice(0, 5).map((ch, i) => (
                          <div key={i} className="flex items-start gap-2.5 py-2">
                            <span className="text-xs text-gray-300 w-5 shrink-0 text-right">{i + 1}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-700">{ch.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{ch.keyEvent}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    <div className="relative px-4 py-2.5 text-center border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">点击在编辑区查看完整大纲</span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  {currentRound === 13 && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => quickConfirm("确认大纲，开始写正文")}
                          data-tip="确认大纲并逐章生成正文"
                          className="flex-1 px-4 py-2.5 text-gray-700 text-sm rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition"
                        >
                          开始写正文
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4 pt-2">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              currentRound === 4
                ? "想调整什么？比如「题材换成科幻」「加入穿越元素」..."
                : currentRound === 8
                ? "想调整什么？比如「加个竹林」「小镇改成海边」..."
                : currentRound === 12
                ? "想调整什么？比如「女主性格改强势一点」「加个反派」..."
                : currentRound === 13
                ? "想调整什么？比如「第三章加个反转」「结局改成开放式」..."
                : flowMode === "none"
                ? scene === "marketing"
                  ? "商品名称、卖点、价格、目标平台..."
                  : scene === "knowledge"
                  ? "输入书名或上传文件，比如「帮我拆解《诡秘之主》」..."
                  : "描述你的故事，比如「重生复仇的女频故事」「末日科幻」..."
                : awaitingAdjust
                ? "想微调什么？直接说就行，或者点「继续」跳过"
                : "输入你的想法..."
            }
            className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent min-h-[40px]"
            rows={1}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="relative" ref={attachRef}>
              {(scene === "novel" || scene === "screenplay") ? (
                <button
                  className="flex items-center gap-1 h-8 px-2.5 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>文件</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowAttachMenu(!showAttachMenu)}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  {showAttachMenu && (
                    <div className="absolute left-0 bottom-full mb-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-28 z-20">
                      {[
                        { icon: FileUp, label: "文档", color: "text-blue-500" },
                        { icon: ImageIcon, label: "图片", color: "text-green-500" },
                        { icon: AudioLines, label: "音频", color: "text-purple-500" },
                        { icon: Video, label: "视频", color: "text-red-500" },
                      ].map((item) => (
                        <button key={item.label} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          {item.label}
                        </button>
                      ))}
                      <div className="border-t border-gray-100 my-1" />
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <span className="w-4 h-4 text-blue-500 text-sm leading-4">☁️</span>
                        网盘
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <Star className="w-4 h-4 text-gray-500" />
                        收藏
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <Clock className="w-4 h-4 text-gray-500" />
                        最近
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 text-gray-400 hover:text-gray-600 transition">
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={handleSend}
                className="p-1.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-2">
          内容由AI生成，仅供参考，请仔细甄别
        </p>
      </div>
    </div>
  );
}
