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
    prompt: "好的，让我们来细化这个故事的设定吧！首先，关于故事的**时空背景和题材方向**，你更偏好哪种？",
    cards: [
      {
        text: "现代都市言情：大城市的高压生活为底色，娱乐圈/商战/职场为舞台。节奏明快，冲突激烈，适合写权谋博弈与感情纠葛并行的故事。",
        keywords: ["都市", "娱乐圈", "职场", "快节奏"],
      },
      {
        text: "现代小镇治愈：远离都市的慢节奏小镇生活，烟火气十足。适合写「逃离都市→重新发现自我→收获爱情」的治愈成长线。",
        keywords: ["小镇", "治愈", "慢生活", "烟火气"],
      },
      {
        text: "古代架空权谋：架空朝代，宫廷或江湖为背景。可以融入玄幻、重生等元素，适合大女主逆袭或家国情怀的宏大叙事。",
        keywords: ["古代", "权谋", "逆袭", "架空"],
      },
    ],
    adjustPrompt: "想微调什么？比如「时间改到民国」「背景换成末世」之类的，或者直接跳过～",
  },
  {
    prompt: "方向不错！接下来看看**故事基调和风格**，你更喜欢哪种调性？",
    cards: [
      {
        text: "甜宠治愈：日常向、慢热型，大量生活细节和温暖互动。「双向暗恋→误会→表白」的经典甜宠结构，结局HE，全程高甜。",
        keywords: ["甜宠", "慢热", "日常", "HE"],
      },
      {
        text: "悬疑暗线：明线感情暗线真相，每章都有伏笔和反转。烧脑叙事、双视角切换，适合「边谈恋爱边解谜」的阅读体验。",
        keywords: ["悬疑", "反转", "伏笔", "烧脑"],
      },
      {
        text: "虐恋情深：先虐后甜（或BE），强烈的情感冲击力。「错过→误会→牺牲→重逢」的情感过山车，虐点密集但逻辑自洽。",
        keywords: ["虐恋", "先虐后甜", "情感冲击", "深情"],
      },
    ],
    adjustPrompt: "如果想调整风格也可以说，比如「再轻松一点」「加入爽文元素」，或者直接跳过～",
  },
  {
    prompt: "最后确认一下**核心冲突和故事走向**：",
    cards: [
      {
        text: "身份秘密型：主角隐藏的身份（失忆/卧底/伪装）是核心驱动力。真相揭露时的冲击和随之而来的信任危机，推动故事高潮。",
        keywords: ["秘密", "身份", "信任危机", "揭秘"],
      },
      {
        text: "成长逆袭型：主角从低谷一步步崛起，靠实力打脸质疑者。核心冲突是「自我证明」，配合感情线形成双线并行的爽感。",
        keywords: ["逆袭", "打脸", "成长", "爽文"],
      },
      {
        text: "守护抉择型：主角在「爱情/事业/真相」之间做出艰难选择。核心冲突是价值观碰撞，结局取决于主角的成长和取舍。",
        keywords: ["抉择", "守护", "价值观", "取舍"],
      },
    ],
    adjustPrompt: "最后还想补充什么？比如「加入复仇线」「结局要开放式」，没有的话我来更新设定～",
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
    prompt: "来完善世界观的细节吧！首先，**故事发生的主要场景**你更偏好哪种？",
    cards: [
      {
        text: "南方水乡古镇：依山傍水、青石板路、白墙黑瓦。手机信号时有时无，留下的都是老人和几个不愿离开的「怪人」。慢节奏，烟火气十足。",
        keywords: ["水乡", "古镇", "烟火气", "慢生活"],
      },
      {
        text: "山间避世小镇：四面环山的盆地小镇，常年云雾缭绕，只有一条公路通往外界。有天然温泉和百年茶园，像被时间遗忘的地方。",
        keywords: ["山间", "避世", "云雾", "温泉"],
      },
      {
        text: "海边渔港小镇：东南沿海的老渔港，咸湿的海风、斑驳的灯塔、清晨出海的渔船。旺季会有零星的游客，淡季只剩自家人。",
        keywords: ["海边", "渔港", "灯塔", "海风"],
      },
    ],
    adjustPrompt: "想微调什么？比如「加个竹林」「镇上要有集市」之类的，或者跳过继续～",
  },
  {
    prompt: "很有画面感！**核心活动场所**你更喜欢哪种组合？",
    cards: [
      {
        text: "烟火美食线：女主的面馆「一碗春」+ 男主的中医馆「济世堂」+ 镇中心的百年古戏台。面香和药香隔墙混在一起，古戏台是全镇社交中心。",
        keywords: ["面馆", "中医馆", "古戏台", "邻里"],
      },
      {
        text: "文艺慢生活：女主的旧书咖啡馆 + 男主的陶艺工作室 + 镇尾的老电影院。文艺气息浓厚，日常细节丰富，适合慢热叙事。",
        keywords: ["书店", "陶艺", "电影院", "文艺"],
      },
      {
        text: "自然治愈线：女主的山脚花店 + 男主的竹林茶舍 + 湖边的废弃小木屋。大量自然描写，四季轮转推动情节发展。",
        keywords: ["花店", "竹林", "湖边", "四季"],
      },
    ],
    adjustPrompt: "场景还想加什么？比如「后山要有个秘密基地」「再加一个赶集场景」，没有就跳过～",
  },
  {
    prompt: "最后确认一下**小镇的人文氛围和暗线方向**：",
    cards: [
      {
        text: "温暖人情味：热心的王婶当非官方媒人、每周日赶集全镇出动、「三巨头」聊天团八卦一切。暗线是女主童年曾在此生活，有人认出她但选择守护她的平静。",
        keywords: ["人情味", "赶集", "八卦", "守护"],
      },
      {
        text: "表面平静暗流涌动：镇上每个人都有不为人知的过去，老一辈之间有未解的恩怨。失忆真相与十五年前一场事故有关，线索散落各处。",
        keywords: ["秘密", "恩怨", "事故", "线索"],
      },
      {
        text: "世外桃源渐被打破：小镇像时间胶囊般宁静，直到外界的人（经纪人、记者）开始闯入。宁静与喧嚣的碰撞推动故事走向高潮。",
        keywords: ["桃源", "打破", "碰撞", "高潮"],
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
    prompt: "来完善角色的细节吧！首先，**女主角的性格倾向**你更偏好哪种？",
    cards: [
      {
        text: "外柔内刚型：表面温柔随和，实则内心坚韧。失忆前在娱乐圈养成了察言观色的本能，失忆后反而展现出天然的亲和力。做面时专注认真，面馆被她经营得有声有色。",
        keywords: ["温柔", "坚韧", "亲和力", "不服输"],
      },
      {
        text: "毒舌傲娇型：嘴硬心软，失忆后依然保留了犀利和高标准。面馆经营得一丝不苟，对男主嘴上不饶人，行动却很诚实。生气时会多做一碗面摔在桌上。",
        keywords: ["毒舌", "傲娇", "犀利", "嘴硬心软"],
      },
      {
        text: "元气治愈型：失忆后像换了个人，开朗热情、对一切充满好奇。把面馆变成了小镇的社交中心，用美食治愈所有人。笑起来像清晨的阳光，但偶尔会在深夜突然安静下来。",
        keywords: ["元气", "治愈", "好奇", "反差"],
      },
    ],
    adjustPrompt: "想微调女主性格吗？比如「再强势一点」「加点文艺气质」，或者跳过继续～",
  },
  {
    prompt: "很有魅力！接下来看看**男主角的人设方向**：",
    cards: [
      {
        text: "沉默守护型：话少但行动力强，默默照顾女主却从不邀功。中医馆里严肃认真，面对女主时语气会不自觉变软。有一段不愿提起的过去，深夜独自在后山竹林练八段锦。",
        keywords: ["沉默", "守护", "反差萌", "过去"],
      },
      {
        text: "毒舌闷骚型：表面冷漠毒舌，实则闷骚到不行。和女主的日常拌嘴是全镇的连续剧。会在深夜偷偷给面馆留一把新鲜草药，附纸条写「多的，别浪费」。",
        keywords: ["毒舌", "闷骚", "拌嘴", "偷偷关心"],
      },
      {
        text: "温润如玉型：温和有礼，医者仁心。对所有人都很好，但对女主有明显的不同——会记住她喝什么茶、哪天该换药。在女主失忆发作时永远第一个出现。",
        keywords: ["温润", "细心", "医者仁心", "偏爱"],
      },
    ],
    adjustPrompt: "想调整男主什么？比如「再高冷一点」「加点反派感」，或者跳过继续～",
  },
  {
    prompt: "最后确认一下**关键配角和人物关系**：",
    cards: [
      {
        text: "热闹烟火型配角：王婶（热心媒人，全镇姻缘操碎心）、老张（杂货店话痨，情报中心）、陈老（茶馆智者，偶尔一句点醒所有人）、小鱼（16岁面馆学徒，萌系担当）。",
        keywords: ["烟火气", "群像", "日常", "萌系"],
      },
      {
        text: "暗线关联型配角：男主的青梅竹马（温柔表象下暗藏心机）、女主的前经纪人（掌握失忆真相）、神秘的镇长奶奶（知道所有人的秘密但从不主动开口）。每个人都是谜题的一块拼图。",
        keywords: ["悬疑", "心机", "真相", "拼图"],
      },
      {
        text: "成长陪伴型配角：小鱼（面馆学徒，治愈萌物）、花姐（隔壁花店老板娘，恋爱军师）、中医馆的老猫阿福（灵性十足，只亲近女主）。温馨日常为主，配角各有成长线。",
        keywords: ["陪伴", "成长", "萌宠", "闺蜜"],
      },
    ],
    adjustPrompt: "配角还想加谁？比如「加个反派」「闺蜜要更有存在感」，没有的话我来更新角色～",
  },
];

// ─── Mock Character Card Data ────────────────────────────────

interface CharacterProfile {
  name: string;
  identity: string;
  personality: string;
  appearance: string;
  habit: string;
  secret: string;
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
    personality: "外柔内刚，失忆后展现出天然的亲和力和不服输的韧劲",
    appearance: "杏眼桃腮，常扎麻花辫，最爱穿素色棉麻围裙",
    habit: "做面时会无意识哼歌，那首歌是她失忆前拍戏时的插曲",
    secret: "随身带着一枚旧铜钥匙，不知道它能打开什么",
  },
  maleLead: {
    name: "陆知行",
    identity: "济世堂第四代传人，清岚镇唯一的中医",
    personality: "沉默寡言但行动力强，面对苏念时语气会不自觉变软",
    appearance: "清瘦高挑，常穿白衬衫，手指修长带着淡淡药香",
    habit: "深夜在后山竹林练八段锦，是他唯一的独处时间",
    secret: "认出了苏念的真实身份，但选择沉默守护她的平静生活",
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
    personality: "外表文静内里倔强，失去味觉后从不抱怨，坚信能找回来",
    appearance: "短发利落，总戴着围裙，指尖常沾着面粉或糖霜",
    habit: "每天清晨去海边收集不同的海盐，说「每天的海味道都不一样」",
    secret: "失去味觉前最后尝到的味道是海盐焦糖，那个配方来自一个她想不起的人",
  },
  maleLead: {
    name: "顾北洲",
    identity: "远洋渔民，「归潮」号船长，潮音镇最年轻的讨海人",
    personality: "沉默寡言，海上的硬汉，上岸后对人却温柔得笨拙",
    appearance: "肤色黝黑，手掌粗糙有力，笑起来眼角有细纹",
    habit: "每次出海回来会在女主店门口放一袋当天最新鲜的海货，从不多说什么",
    secret: "三年前在远洋货轮上目睹了一件事，那件事和女主失去味觉有关",
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
};

// ─── Mock: free-input guided flow ────────────────────────────

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
  | { id: string; sender: "model"; type: "length-select"; prompt: string }
  | { id: string; sender: "model"; type: "micro-adjust"; prompt: string; round: number }
  | { id: string; sender: "model"; type: "subtype-select"; prompt: string }
  | { id: string; sender: "user"; type: "card-selection"; content: string }
  | { id: string; sender: "user"; type: "text"; content: string };

// ─── Component ───────────────────────────────────────────────

export default function ChatPanel() {
  const setCreationStage = useEditorStore((s) => s.setCreationStage);
  const setStageProgress = useEditorStore((s) => s.setStageProgress);
  const setAutoTitle = useEditorStore((s) => s.setAutoTitle);
  const initNovelChapters = useEditorStore((s) => s.initNovelChapters);
  const setNovelChapterStatus = useEditorStore((s) => s.setNovelChapterStatus);
  const setNovelChapterContent = useEditorStore((s) => s.setNovelChapterContent);
  const setCurrentNovelChapter = useEditorStore((s) => s.setCurrentNovelChapter);
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
    if (isScreenplay) return "你好！欢迎来到剧本创作工作台 ✨\n\n描述一下你想创作的剧本——一句话、一个画面、甚至几个关键词就够了。\n我会帮你快速生成一版完整设定，然后我们一起调整打磨。\n\n没有想法也没关系，点击下方按钮我来帮你构思一个。";
    if (isMarketing) return "你好！告诉我你要推广什么产品？\n\n产品名称、链接、核心卖点都可以——比如「一款隐形蓝牙耳机，主打极致隐形和防水」。\n我来帮你快速生成一版视频策略，然后一起优化。\n\n没有想法也没关系，点击下方按钮我来帮你构思一个。";
    if (isKnowledge) return "你好！欢迎来到深度解读工作台 ✨\n\n告诉我你想拆解哪本书？书名、文件、核心问题都可以——比如「帮我拆解《诡秘之主》的力量体系」。\n我来帮你快速生成分析框架，然后一起深入。\n\n没有想法也没关系，点击下方按钮我来帮你构思一个。";
    return "你好！欢迎来到小说创作工作台 ✨\n\n描述一下你想写的故事——一句话、一个画面、甚至几个关键词就够了。\n我会帮你快速生成一版创作设定，然后我们一起调整打磨。\n\n没有想法也没关系，点击下方按钮我来帮你构思一个。";
  }, [isScreenplay, isMarketing, isKnowledge]);

  const dataRef = useRef({
    sceneInspirationRounds, sceneSettingsCard, sceneWorldbuildingRounds, sceneWorldbuilding,
    sceneCharacterRounds, sceneCharacterCard, sceneOutlineCard, sceneChapterTexts, sceneTitle, sceneWelcome,
    isMarketing, isKnowledge, isScreenplay,
  });
  useEffect(() => {
    dataRef.current = {
      sceneInspirationRounds, sceneSettingsCard, sceneWorldbuildingRounds, sceneWorldbuilding,
      sceneCharacterRounds, sceneCharacterCard, sceneOutlineCard, sceneChapterTexts, sceneTitle, sceneWelcome,
      isMarketing, isKnowledge, isScreenplay,
    };
  });

  // Generate a brief summary from settings data for the prompt
  const getSettingsSummary = useCallback(() => {
    const s = dataRef.current.sceneSettingsCard;
    if (dataRef.current.isMarketing) {
      const concept = s["产品信息"] || s["视频策略"];
      const core = concept?.[0]?.value || "";
      return core ? `\n\n产品定位：${core}` : "";
    }
    if (dataRef.current.isKnowledge) {
      const concept = s["书籍信息"] || s["分析配置"];
      const core = concept?.[0]?.value || "";
      return core ? `\n\n分析对象：${core}` : "";
    }
    // Novel / Screenplay
    const concept = s["故事概念"];
    const elements = s["写作要素"];
    const coreSetting = concept?.[0]?.value || "";
    const genre = elements?.find((e: { label: string; value: string }) => e.label === "题材")?.value || "";
    const style = elements?.find((e: { label: string; value: string }) => e.label === "风格调性")?.value || "";
    const ending = elements?.find((e: { label: string; value: string }) => e.label === "结局")?.value || "";
    const parts = [genre, style, ending].filter(Boolean).join(" · ");
    return parts || coreSetting ? `\n\n${parts}\n${coreSetting}` : "";
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
  const settingsRegenRef = useRef(0);
  const wbRegenRef = useRef(0);
  const charRegenRef = useRef(0);
  const outlineRegenRef = useRef(0);

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
    // Stage 1→2 (世界观): rounds 4-8, line fills during worldbuilding rounds
    // Stage 2→3 (角色): rounds 8-12, line fills during character rounds
    // Stage 3→4 (大纲): rounds 12-13, line fills during outline generation
    const progressMap: Record<number, number> = {
      0: 0,     // welcome
      1: 0.25,  // inspiration round 1
      2: 0.50,  // inspiration round 2
      3: 0.75,  // inspiration round 3
      4: 0,     // settings confirmed, reset for next line
      5: 0.25,  // worldbuilding round 1
      6: 0.50,  // worldbuilding round 2
      7: 0.75,  // worldbuilding round 3
      8: 0,     // worldbuilding confirmed, reset
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

    const thinkingId = `thinking-init`;
    setMessages([{ id: thinkingId, sender: "model", type: "thinking" }]);

    setTimeout(() => {
      if (isScreenplay) {
        // Screenplay: show subtype selection first
        setMessages([
          {
            id: "model-subtype",
            sender: "model",
            type: "subtype-select",
            prompt: "你好！欢迎来到剧本创作工作台。你想创作哪种类型？",
          },
        ]);
      } else if (scene === "novel") {
        // Novel: show length selection first
        setMessages([
          {
            id: "model-length",
            sender: "model",
            type: "length-select",
            prompt: "你好！欢迎来到小说创作工作台 ✨\n\n在开始之前，先选一下你想写的篇幅：",
          },
        ]);
      } else {
        setMessages([
          {
            id: "model-welcome",
            sender: "model",
            type: "welcome",
            prompt: sceneWelcome,
          },
        ]);
      }
    }, 1200);
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

  // Handle novel length selection
  const handleLengthSelect = useCallback((length: "short" | "medium" | "long") => {
    setNovelLength(length);
    const labels: Record<string, string> = { short: "短篇", medium: "中篇", long: "长篇" };

    setMessages((prev) => [
      ...prev,
      { id: `user-length`, sender: "user", type: "card-selection", content: `我想写${labels[length]}` },
    ]);

    const thinkingId = `thinking-welcome-after-length`;
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
    }, 300);

    const welcomeText = length === "short"
      ? "好的，短篇小说！\n\n描述一下你想写的故事——一句话、一个画面、甚至几个关键词就够了。\n我会帮你快速生成一版创作设定，然后我们一起调整打磨。\n\n没有想法也没关系，点击下方按钮我来帮你构思一个。"
      : length === "medium"
      ? "好的，中篇小说！\n\n描述一下你想写的故事——一句话、一个画面、甚至几个关键词就够了。\n我会帮你快速生成一版创作设定，然后我们一起调整打磨。\n\n没有想法也没关系，点击下方按钮我来帮你构思一个。"
      : "好的，长篇小说！\n\n描述一下你想写的故事——一句话、一个画面、甚至几个关键词就够了。\n我会帮你快速生成一版创作设定，然后我们一起调整打磨。\n\n没有想法也没关系，点击下方按钮我来帮你构思一个。";

    setTimeout(() => {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingId),
        {
          id: "model-welcome",
          sender: "model",
          type: "welcome",
          prompt: welcomeText,
        },
      ]);
    }, 1500);
  }, []);

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
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-settings",
              sender: "model",
              type: "settings-card",
              prompt: dataRef.current.isMarketing
                ? "收到！我为你整理了视频策略Brief。确认无误就可以开始设计故事线了，有需要调整的随时告诉我。"
                : dataRef.current.isKnowledge
                ? "已读取完毕！以下是书籍总览和分析配置。确认无误就可以开始深入分析了，有需要调整的随时告诉我。"
                : "根据你的灵感方向，我为你整理了以下创作设定。确认无误就可以开始构建世界观了，你也可以告诉我需要调整的地方。",
              settings: dataRef.current.sceneSettingsCard,
            },
          ]);
          setCurrentRound(4);
          setCreationStage(1);
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
              prompt: "世界观构建完成！你可以在编辑区查看完整内容，觉得没问题就可以开始创建角色了，有想调整的也可以直接告诉我。",
              data: dataRef.current.sceneWorldbuilding,
            },
          ]);
          setCurrentRound(8);
          setCreationStage(2);
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
              prompt: "角色创建完成！你可以在编辑区查看完整的角色档案，觉得没问题就可以开始生成大纲了，想调整随时告诉我。",
              data: dataRef.current.sceneCharacterCard,
            },
          ]);
          setCurrentRound(12);
          setCreationStage(3);
        }, 2500);
        return;
      }
    },
    [setCreationStage]
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
    proceedToNextRound(adjustRound);
  }, [adjustRound, proceedToNextRound]);

  // Handle "跳过，直接生成" — skip remaining inspiration rounds, jump to card generation
  const handleSkipToGenerate = useCallback(() => {
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
          // Notify in chat
          const chTitle = dataRef.current.sceneOutlineCard.chapters[chapterIndex]?.title || `第${chapterIndex + 1}章`;
          setMessages((prev) => [
            ...prev,
            {
              id: `model-ch-done-${chapterIndex}`,
              sender: "model" as const,
              type: "text" as const,
              content: chapterIndex < dataRef.current.sceneOutlineCard.chapters.length - 1
                ? `**${chTitle}** 生成完毕！你可以在编辑区查看和修改。\n\n满意后说「继续」，我就开始写下一章。`
                : dataRef.current.sceneOutlineCard.chapters.length === 1
                ? `全文生成完毕！你可以在编辑区查看和自由编辑。\n\n有什么想修改的直接告诉我。`
                : `**${chTitle}** 生成完毕！这是最后一章。\n\n全部章节已完成，你可以自由编辑任何章节。`,
            },
          ]);
          // Update progress bar for 正文 stage
          const doneCount = chapterIndex + 1;
          const total = dataRef.current.sceneOutlineCard.chapters.length;
          setStageProgress(doneCount / total);
          return;
        }
        current += chars.slice(i, i + chunkSize).join("");
        i += chunkSize;
        setNovelChapterContent(chapterIndex, current);
      }, 30);
    },
    [setNovelChapterStatus, setNovelChapterContent, setCurrentNovelChapter, setStageProgress]
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
    const isConfirmIntent = /确认|继续完善|下一步|方向不错|没问题|生成设定|开始写|开始生成|开始探索/.test(text);

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

    // If at confirm stage (after settings card shown), user confirmed → auto-generate worldbuilding
    if (currentRound === 4) {
      // Auto-generate a fitting title based on the story settings
      setAutoTitle(dataRef.current.sceneTitle);

      const thinkingId = `thinking-wb-intro`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-auto-title",
            sender: "model",
            type: "text",
            content: dataRef.current.isMarketing
              ? `视频策略确认！根据你的产品信息，项目暂定为——**《${dataRef.current.sceneTitle}》**，你随时可以在顶部修改。\n\n接下来帮你设计视频的故事线...`
              : dataRef.current.isKnowledge
              ? `分析配置确认！已为你创建项目——**《${dataRef.current.sceneTitle}》**，你随时可以在顶部修改。\n\n接下来深入分析设定体系...`
              : `设定确认！根据你的故事设定，我帮你起了个名字——**《${dataRef.current.sceneTitle}》**，你随时可以在顶部修改。\n\n正在为你构建世界观...`,
          },
        ]);
        setStageProgress(0.1);
        // Auto-generate worldbuilding after a brief pause
        const thinkingId2 = `thinking-auto-wb`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId2, sender: "model", type: "thinking" }]);
        }, 800);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId2),
            {
              id: "model-worldbuilding",
              sender: "model",
              type: "worldbuilding-card",
              prompt: dataRef.current.isMarketing
                ? "视频故事线构建完成！看看感觉怎么样？你可以告诉我想调整哪里，也可以直接继续完善。"
                : dataRef.current.isKnowledge
                ? "设定体系分析完成！看看感觉怎么样？你可以告诉我想调整哪里，也可以直接继续完善。"
                : "世界观构建完成！看看感觉怎么样？\n你可以告诉我想调整哪里，也可以直接继续完善。",
              data: dataRef.current.sceneWorldbuilding,
            },
          ]);
          setCurrentRound(8);
          setCreationStage(2);
        }, 3000);
      }, 1500);
      return;
    }

    // If at worldbuilding confirm stage, user confirmed → auto-generate characters
    if (currentRound === 8) {
      const thinkingId = `thinking-char-intro`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-char-intro",
            sender: "model",
            type: "text",
            content: dataRef.current.isMarketing
              ? "故事线就位！正在为你设计出镜角色..."
              : dataRef.current.isKnowledge
              ? "设定体系整理完毕！正在分析核心角色..."
              : "世界观就位！正在为你创建角色...",
          },
        ]);
        setStageProgress(0.1);
        // Auto-generate characters
        const thinkingId2 = `thinking-auto-char`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId2, sender: "model", type: "thinking" }]);
        }, 800);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId2),
            {
              id: "model-characters",
              sender: "model",
              type: "character-card",
              prompt: dataRef.current.isMarketing
                ? "出镜角色设计完成！看看感觉怎么样？你可以告诉我想调整哪里。"
                : dataRef.current.isKnowledge
                ? "核心角色分析完成！看看感觉怎么样？你可以告诉我想调整哪里。"
                : "角色创建完成！看看感觉怎么样？\n你可以告诉我想调整哪里，也可以直接继续完善。",
              data: dataRef.current.sceneCharacterCard,
            },
          ]);
          setCurrentRound(12);
          setCreationStage(3);
        }, 3000);
      }, 1500);
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
          // Init as single "chapter"
          initNovelChapters(["全文"]);
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: "model-write-start",
              sender: "model",
              type: "text",
              content: "角色档案完成！短篇不需要大纲，直接开始写正文。\n\n正在为你生成全文...",
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
      const thinkingId = `thinking-outline-intro`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-outline-intro",
            sender: "model",
            type: "text",
            content: dataRef.current.isMarketing
              ? "角色设定完成！正在为你生成分幕脚本..."
              : dataRef.current.isKnowledge
              ? "角色分析完成！正在生成结构化分析报告..."
              : "角色档案完成！正在为你搭建故事骨架...",
          },
        ]);
        setStageProgress(0.1);
        // Auto-generate outline
        const thinkingId2 = `thinking-auto-outline`;
        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId2, sender: "model", type: "thinking" }]);
        }, 800);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId2),
            {
              id: "model-outline",
              sender: "model",
              type: "outline-card",
              prompt: "大纲生成完毕！看看感觉怎么样？确认后就可以开始正文创作了。",
              data: dataRef.current.sceneOutlineCard,
            },
          ]);
          setCurrentRound(13);
          setCreationStage(4);
        }, 3000);
      }, 1500);
      return;
    }

    // If at outline confirm stage, user confirmed → init chapters and start generating
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
              ? `分幕脚本确认！开始生成详细脚本。\n\n我会逐幕生成，每幕包含画面描述、台词和技巧标注。满意后告诉我「继续」，我就接着写下一幕。\n\n正在生成 **${chapterTitles[0]}**...`
              : dataRef.current.isKnowledge
              ? `分析大纲确认！开始生成深度报告。\n\n我会逐篇分析，每篇附带原文出处引用。满意后告诉我「继续」，我就接着写下一篇。\n\n正在生成 **${chapterTitles[0]}**...`
              : `大纲确认！开始为你生成正文。\n\n我会逐章生成，每章完成后你可以在编辑区直接修改。满意后告诉我「继续」，我就接着写下一章。\n\n正在生成 **第一章 ${chapterTitles[0]?.replace(/^第.章\s*/, "")}**...`,
          },
        ]);
        setCurrentRound(14);
        setCreationStage(5);
        // Start generating chapter 0
        setWritingChapter(0);
        generateChapter(0);
      }, 2000);
      return;
    }

    // If in writing mode, user says "继续" → generate next chapter
    if (currentRound === 14 && writingChapter >= 0) {
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
              content: `好的，正在生成 **${title}**...`,
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
              content: "全部章节生成完毕！🎉\n\n你可以在编辑区点击左上角的目录图标查看和切换章节，随时修改任何内容。如果需要我帮忙润色、改写或调整某一章，直接告诉我就好。",
            },
          ]);
        }, 1500);
      }
      return;
    }

    // Free-form input flow: user typed a description → directly generate settings
    if (flowMode === "none" || flowMode === "freeform") {
      setFlowMode("freeform");

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
            prompt: dataRef.current.isMarketing
              ? "根据你的描述，我帮你生成了一版视频策略Brief。" + getSettingsSummary() + "\n\n看看感觉怎么样？你可以告诉我想调整哪里，也可以直接确认进入下一步。"
              : dataRef.current.isKnowledge
              ? "根据你的描述，我帮你生成了一版分析配置。" + getSettingsSummary() + "\n\n看看感觉怎么样？你可以告诉我想调整哪里，也可以直接确认进入下一步。"
              : "根据你的描述，我帮你生成了一版创作设定。" + getSettingsSummary() + "\n\n看看感觉怎么样？你可以告诉我想调整哪里，也可以直接确认进入下一步。",
            settings: dataRef.current.sceneSettingsCard,
          },
        ]);
        setCurrentRound(4);
        setCreationStage(1);
      }, 2500);
    }
  }, [input, awaitingAdjust, adjustRound, currentRound, flowMode, writingChapter, novelChapters, novelLength, setCreationStage, setStageProgress, setAutoTitle, proceedToNextRound, initNovelChapters, generateChapter, getSettingsSummary]);

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

  // ── Mode Selection: full chat-area centered UI (no chat, no input) ──
  if ((scene === "novel" || scene === "screenplay") && workMode === null) {
    const sceneLabel = scene === "novel" ? "小说" : "剧本";
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-light text-gray-800 tracking-wide mb-2">选择创作模式</h2>
          <p className="text-sm text-gray-400">{sceneLabel}创作 · 选择适合你的方式开始</p>
        </div>

        <div className="flex gap-4 w-full max-w-md">
          <button
            onClick={() => handleModeSelect("agent")}
            className="group flex-1 bg-white rounded-2xl border-2 border-indigo-400 ring-2 ring-indigo-100 p-5 text-left shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
              <MessageSquare className="w-[18px] h-[18px] text-indigo-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">引导创作</h3>
            <p className="text-xs text-gray-500 leading-relaxed">自由对话，灵活探索</p>
            <p className="text-[11px] text-gray-400 mt-2.5 leading-relaxed">通过 AI 对话完成灵感→设定→角色→大纲→正文的创作流程</p>
          </button>

          <button
            onClick={() => handleModeSelect("workflow")}
            className="group flex-1 bg-white rounded-2xl border border-gray-200 p-5 text-left hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-indigo-50 transition">
              <ListChecks className="w-[18px] h-[18px] text-gray-600 group-hover:text-indigo-500 transition" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">独立创作</h3>
            <p className="text-xs text-gray-500 leading-relaxed">自主配置，自由编辑</p>
            <p className="text-[11px] text-gray-400 mt-2.5 leading-relaxed">在配置面板中设定参数，按步骤生成，每一步可精确调控</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50/50">

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5" ref={scrollRef}>
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
                    <div className="mt-1.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRefresh()}
                          className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-400 hover:text-indigo-500 transition"
                        >
                          <RefreshCw className="w-3 h-3" />
                          换一换
                        </button>
                        <button
                          onClick={handleSkipToGenerate}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-indigo-500 border border-gray-200 rounded-full hover:border-indigo-200 transition"
                        >
                          跳过，直接生成
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        {msg.round <= 3
                          ? `选择后进入第 ${Math.min(msg.round + 1, 3)} / 3 轮，完成后生成创作设定`
                          : msg.round <= 7
                          ? `选择后进入第 ${Math.min(msg.round - 4, 3)} / 3 轮，完成后生成世界观`
                          : `选择后进入第 ${Math.min(msg.round - 8, 3)} / 3 轮，完成后生成角色档案`
                        }
                      </p>
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
                  <div className="pl-8">
                    <button
                      onClick={handleSkipAdjust}
                      className="px-3.5 py-1.5 text-xs text-gray-500 bg-gray-50 rounded-full border border-gray-200 hover:bg-gray-100 transition"
                    >
                      继续
                    </button>
                    <p className="text-[11px] text-gray-400 mt-1.5">跳过微调，进入下一轮选择</p>
                  </div>
                )}
              </div>
            );
          }

          // ── Model: text message ──
          if (msg.sender === "model" && msg.type === "text") {
            const isChapterDone = msg.id.startsWith("model-ch-done-");
            const chapterIdx = isChapterDone ? parseInt(msg.id.replace("model-ch-done-", ""), 10) : -1;
            const hasNextChapter = isChapterDone && chapterIdx < dataRef.current.sceneOutlineCard.chapters.length - 1;
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
                            { id: `model-gen-ch-${nextCh}`, sender: "model" as const, type: "text" as const, content: `好的，正在生成 **${title}**...` },
                          ]);
                          setWritingChapter(nextCh);
                          generateChapter(nextCh);
                        }, 1500);
                      }}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl border border-indigo-100 hover:bg-indigo-100 transition"
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
                        setFlowMode("inspiration");
                        const thinkingId = `thinking-direct-settings`;
                        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                        setTimeout(() => {
                          setMessages((prev) => [
                            ...prev.filter((m) => m.id !== thinkingId),
                            {
                              id: "model-settings",
                              sender: "model",
                              type: "settings-card",
                              prompt: dataRef.current.isMarketing
                                ? "我帮你生成了一版视频策略Brief，看看感觉怎么样？" + getSettingsSummary() + "\n\n你可以告诉我想调整哪里，也可以直接确认进入下一步。"
                                : dataRef.current.isKnowledge
                                ? "我帮你生成了一版分析配置，看看感觉怎么样？" + getSettingsSummary() + "\n\n你可以告诉我想调整哪里，也可以直接确认进入下一步。"
                                : "我帮你生成了一版创作设定，看看感觉怎么样？" + getSettingsSummary() + "\n\n你可以告诉我想调整哪里，也可以直接确认进入下一步。",
                              settings: dataRef.current.sceneSettingsCard,
                            },
                          ]);
                          setCurrentRound(4);
                          setCreationStage(1);
                        }, 2500);
                      }}
                      className="px-4 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl border border-indigo-100 hover:bg-indigo-100 transition"
                    >
                      ✨ 帮我想一个
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

                {/* Settings Card - truncated with fade */}
                <div className="pl-8">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
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
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    {/* View full in editor hint */}
                    <div className="relative px-4 py-2.5 text-center border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">查看完整设定请点击编辑区</span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  {currentRound === 4 && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => quickConfirm("确认设定，进入下一步")}
                          className="flex-1 px-4 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl border border-indigo-100 hover:bg-indigo-100 transition"
                        >
                          确认设定，下一步
                        </button>
                        <button
                          onClick={() => {
                            settingsRegenRef.current += 1;
                            const altData = settingsRegenRef.current % 2 === 1 ? mockSettingsAlt : mockSettings;
                            const thinkingId = `thinking-regen-settings`;
                            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                            setTimeout(() => {
                              setMessages((prev) => [
                                ...prev.filter((m) => m.id !== thinkingId),
                                {
                                  id: `model-settings-${Date.now()}`,
                                  sender: "model" as const,
                                  type: "settings-card" as const,
                                  prompt: "已重新生成一版设定，看看这个怎么样？",
                                  settings: altData,
                                },
                              ]);
                            }, 2000);
                          }}
                          className="px-4 py-2.5 text-gray-500 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                          换一换
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          // Enter inspiration round 1 to refine settings
                          const thinkingId = `thinking-refine-insp`;
                          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                          setTimeout(() => {
                            const r1 = dataRef.current.sceneInspirationRounds[0];
                            setMessages((prev) => [
                              ...prev.filter((m) => m.id !== thinkingId),
                              {
                                id: "model-r1",
                                sender: "model",
                                type: "inspiration",
                                prompt: "好的，让我们通过几个选择来完善设定细节吧！" + r1.prompt,
                                cards: r1.cards,
                                round: 1,
                              },
                            ]);
                            setCurrentRound(1);
                            setFlowMode("inspiration");
                          }, 1500);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-indigo-500 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-300 transition"
                      >
                        ✨ 通过灵感探索继续完善
                      </button>
                      <p className="text-[11px] text-gray-400">{"想调整？直接告诉我哪里不满意，比如\"题材换成科幻\"、\"女主改成医生\""}</p>
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

                {/* Worldbuilding Card - truncated with fade */}
                <div className="pl-8">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                    <div className="max-h-[200px] overflow-hidden">
                      {/* Summary */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">故事世界</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">{msg.data.summary}</p>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Scenes preview */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">核心场景</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.data.scenes.map((s) => (
                            <span key={s.name} className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-xs rounded-full">
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
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    <div className="relative px-4 py-2.5 text-center border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">查看完整世界观请点击编辑区</span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  {currentRound === 8 && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => quickConfirm("确认世界观，进入下一步")}
                          className="flex-1 px-4 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl border border-indigo-100 hover:bg-indigo-100 transition"
                        >
                          确认世界观，下一步
                        </button>
                        <button
                          onClick={() => {
                            wbRegenRef.current += 1;
                            const altData = wbRegenRef.current % 2 === 1 ? mockWorldbuildingAlt : mockWorldbuilding;
                            const thinkingId = `thinking-regen-wb`;
                            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                            setTimeout(() => {
                              setMessages((prev) => [
                                ...prev.filter((m) => m.id !== thinkingId),
                                {
                                  id: `model-worldbuilding-${Date.now()}`,
                                  sender: "model" as const,
                                  type: "worldbuilding-card" as const,
                                  prompt: "已重新生成一版世界观，看看这个怎么样？",
                                  data: altData,
                                },
                              ]);
                            }, 2000);
                          }}
                          className="px-4 py-2.5 text-gray-500 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                          换一换
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const thinkingId = `thinking-refine-wb`;
                          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                          setTimeout(() => {
                            const r1 = dataRef.current.sceneWorldbuildingRounds[0];
                            setMessages((prev) => [
                              ...prev.filter((m) => m.id !== thinkingId),
                              {
                                id: "model-r5",
                                sender: "model",
                                type: "inspiration",
                                prompt: "好的，让我们通过几个选择来完善世界观细节吧！" + r1.prompt,
                                cards: r1.cards,
                                round: 5,
                              },
                            ]);
                            setCurrentRound(5);
                            setFlowMode("inspiration");
                          }, 1500);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-indigo-500 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-300 transition"
                      >
                        ✨ 通过灵感探索完善世界观
                      </button>
                      <p className="text-[11px] text-gray-400">{"想调整？比如\"加个竹林\"、\"小镇改成海边渔村\""}</p>
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

                {/* Character Card - truncated with fade */}
                <div className="pl-8">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                    <div className="max-h-[200px] overflow-hidden">
                      {/* Female lead */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">女主角</h4>
                        <p className="text-sm font-medium text-purple-600">{msg.data.femaleLead.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{msg.data.femaleLead.identity}</p>
                        <p className="text-xs text-gray-600 mt-1">{msg.data.femaleLead.personality}</p>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Male lead */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">男主角</h4>
                        <p className="text-sm font-medium text-blue-600">{msg.data.maleLead.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{msg.data.maleLead.identity}</p>
                        <p className="text-xs text-gray-600 mt-1">{msg.data.maleLead.personality}</p>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Supporting */}
                      <div className="px-4 py-3">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">关键配角</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.data.supporting.map((c) => (
                            <span key={c.name} className="px-2.5 py-1 bg-amber-50 text-amber-600 text-xs rounded-full">
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Gradient fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    <div className="relative px-4 py-2.5 text-center border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">查看完整角色档案请点击编辑区</span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  {currentRound === 12 && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => quickConfirm("确认角色，进入下一步")}
                          className="flex-1 px-4 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl border border-indigo-100 hover:bg-indigo-100 transition"
                        >
                          确认角色，下一步
                        </button>
                        <button
                          onClick={() => {
                            charRegenRef.current += 1;
                            const altData = charRegenRef.current % 2 === 1 ? mockCharacterCardAlt : mockCharacterCard;
                            const thinkingId = `thinking-regen-char`;
                            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                            setTimeout(() => {
                              setMessages((prev) => [
                                ...prev.filter((m) => m.id !== thinkingId),
                                {
                                  id: `model-characters-${Date.now()}`,
                                  sender: "model" as const,
                                  type: "character-card" as const,
                                  prompt: "已重新生成一版角色档案，看看这个怎么样？",
                                  data: altData,
                                },
                              ]);
                            }, 2000);
                          }}
                          className="px-4 py-2.5 text-gray-500 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                          换一换
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const thinkingId = `thinking-refine-char`;
                          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                          setTimeout(() => {
                            const r1 = dataRef.current.sceneCharacterRounds[0];
                            setMessages((prev) => [
                              ...prev.filter((m) => m.id !== thinkingId),
                              {
                                id: "model-r9",
                                sender: "model",
                                type: "inspiration",
                                prompt: "好的，让我们通过几个选择来完善角色细节吧！" + r1.prompt,
                                cards: r1.cards,
                                round: 9,
                              },
                            ]);
                            setCurrentRound(9);
                            setFlowMode("inspiration");
                          }, 1500);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-indigo-500 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 hover:border-indigo-300 transition"
                      >
                        ✨ 通过灵感探索完善角色
                      </button>
                      <p className="text-[11px] text-gray-400">{"想调整？比如\"女主性格改成更强势\"、\"加一个反派角色\""}</p>
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

                {/* Outline Card - truncated */}
                <div className="pl-8">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                    <div className="max-h-[220px] overflow-hidden">
                      {/* Structure info */}
                      <div className="px-4 py-3 flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">{msg.data.structure}</span>
                        <span className="text-xs text-gray-400">{msg.data.totalChapters}章 · {msg.data.estimatedWords}</span>
                      </div>
                      <div className="border-t border-gray-100" />
                      {/* Chapter list preview */}
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
                    {/* Gradient fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    <div className="relative px-4 py-2.5 text-center border-t border-gray-50">
                      <span className="text-[11px] text-gray-400">查看完整大纲请点击编辑区</span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  {currentRound === 13 && (
                    <div className="mt-2.5 space-y-2">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => quickConfirm("确认大纲，开始写正文")}
                          className="flex-1 px-4 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl border border-indigo-100 hover:bg-indigo-100 transition"
                        >
                          开始写正文
                        </button>
                        <button
                          onClick={() => {
                            outlineRegenRef.current += 1;
                            const altData = outlineRegenRef.current % 2 === 1 ? mockOutlineCardAlt : mockOutlineCard;
                            const thinkingId = `thinking-regen-outline`;
                            setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
                            setTimeout(() => {
                              setMessages((prev) => [
                                ...prev.filter((m) => m.id !== thinkingId),
                                {
                                  id: `model-outline-${Date.now()}`,
                                  sender: "model" as const,
                                  type: "outline-card" as const,
                                  prompt: "已重新生成一版大纲，看看这个怎么样？",
                                  data: altData,
                                },
                              ]);
                            }, 2500);
                          }}
                          className="px-4 py-2.5 text-gray-500 text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                          换一换
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400">{"想调整？比如\"第三章增加一个反转\"、\"结局改成开放式\""}</p>
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
                  ? "描述你要推广的产品，核心卖点、目标人群..."
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
                  <span>传文件</span>
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
