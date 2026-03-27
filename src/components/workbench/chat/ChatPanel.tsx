"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
} from "lucide-react";

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
    prompt: "你好！我来帮你构思一个精彩的故事。先看看这几个方向，哪个更打动你？",
    cards: [
      {
        text: "现代都市，当红影后在事业巅峰突然失忆，被迫隐居在南方小镇。没有聚光灯的日子里，她意外发现这里藏着她遗忘的童年和一段未完的缘分。",
        keywords: ["都市", "失忆", "娱乐圈", "小镇", "治愈"],
      },
      {
        text: "架空古代，被退婚的废材郡主在绝境中觉醒前世记忆，发现自己曾是镇压妖族的大祭司。重活一世，她要用前世的知识改写命运、逆袭朝堂。",
        keywords: ["古代", "重生", "逆袭", "宫斗", "玄幻"],
      },
      {
        text: "近未来末世，一场全球性的信号中断让文明倒退五十年。前AI工程师带着最后一台能运行的终端，在废墟中寻找重建网络的可能，却发现断网背后是一个更大的阴谋。",
        keywords: ["末世", "科幻", "悬疑", "生存", "阴谋"],
      },
    ],
    adjustPrompt: "选得好！有没有想微调的？比如「想要更虐一点」「加入美食元素」之类的，随便说说就行～",
  },
  {
    prompt: "好方向！在这个基础上，你更偏好哪种风格走向？",
    cards: [
      {
        text: "甜宠日常：她在小镇开了一家面馆，和隔壁沉默寡言的中医馆馆主从互相看不顺眼到每天给对方留饭，小镇居民看在眼里急在心里。温暖治愈的慢节奏故事。",
        keywords: ["甜宠", "美食", "慢热", "日常", "欢喜冤家"],
      },
      {
        text: "悬疑暗线：小镇看似平静，但她的记忆碎片指向一个惊人的真相——她的失忆并非意外，身边最亲近的人可能就是幕后推手。每一章都有反转的烧脑叙事。",
        keywords: ["悬疑", "烧脑", "反转", "暗黑", "真相"],
      },
      {
        text: "爽文逆袭：她用娱乐圈摸爬滚打练出的手段，把小镇文艺汇演搞成了全网爆款，从此一路开挂重返巅峰。但这次她选择按自己的规则来，不再为资本低头。",
        keywords: ["爽文", "逆袭", "打脸", "励志", "开挂"],
      },
    ],
    adjustPrompt: "如果想调整什么细节也可以说，比如「节奏再快一点」「想加入职场线」，或者直接跳过～",
  },
  {
    prompt: "快要成型了！最后确认一下故事的走向和结局：",
    cards: [
      {
        text: "明线甜恋暗线揭秘，当她终于想起一切，要在复仇和眼前的幸福之间做选择。她选择放下执念，和他在小镇安定下来，用新的方式重新定义成功。温暖HE。",
        keywords: ["HE", "双线叙事", "治愈", "放下"],
      },
      {
        text: "层层反转，每个角色都有不可告人的秘密，真相像洋葱一样一层层剥开。最后她看清了所有人的面目，独自踏上新的旅程。开放式结局，余韵悠长。",
        keywords: ["开放式结局", "反转", "群像", "独立"],
      },
      {
        text: "治愈成长线，从迷失到被小镇的人情味治愈，重新理解「成功」的意义。她带着全新的自己回归，在事业和生活之间找到了属于自己的平衡点。温暖HE。",
        keywords: ["HE", "成长", "治愈", "回归", "平衡"],
      },
    ],
    adjustPrompt: "最后还有想补充的吗？比如「想要更甜」「结尾要有反转」，没有的话我就开始整理设定了～",
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

// ─── Mock Worldbuilding Rounds ───────────────────────────────

const worldbuildingRounds: InspirationRound[] = [
  {
    prompt: "设定确认！接下来我们构建故事发生的世界。你希望这个小镇是什么样的？",
    cards: [
      {
        text: "南方水乡古镇：依山傍水、青石板路、白墙黑瓦、小桥流水。手机信号时有时无，年轻人外出谋生，留下的都是老人和几个不愿离开的「怪人」。慢节奏，烟火气十足。",
        keywords: ["水乡", "古镇", "烟火气", "慢生活"],
      },
      {
        text: "山间避世小镇：四面环山的盆地小镇，常年云雾缭绕，只有一条公路通往外界。镇上有天然温泉、百年茶园和一座废弃的小学，像是被时间遗忘的地方。",
        keywords: ["山间", "避世", "云雾", "温泉"],
      },
      {
        text: "海边渔港小镇：东南沿海的老渔港，咸湿的海风、斑驳的灯塔、清晨出海的渔船。镇上有妈祖庙和一个年久失修的小码头，旺季会有零星的游客。",
        keywords: ["海边", "渔港", "灯塔", "海风"],
      },
    ],
    adjustPrompt: "想微调什么？比如「加个竹林」「镇上要有集市」之类的，或者跳过继续～",
  },
  {
    prompt: "很有画面感！小镇的核心场景你更喜欢哪种组合？",
    cards: [
      {
        text: "烟火美食线：女主的面馆「一碗春」+ 男主的中医馆「济世堂」+ 镇中心的百年古戏台。面香和药香隔墙混在一起，古戏台是全镇社交中心。",
        keywords: ["面馆", "中医馆", "古戏台", "邻里"],
      },
      {
        text: "文艺慢生活：女主的旧书咖啡馆 + 男主的陶艺工作室 + 镇尾的老电影院（只在周末放映）。文艺气息浓厚，日常细节丰富，适合慢热叙事。",
        keywords: ["书店", "陶艺", "电影院", "文艺"],
      },
      {
        text: "自然治愈线：女主的山脚花店 + 男主的竹林茶舍 + 湖边的废弃小木屋。大量自然描写，四季轮转推动情节发展和情感变化。",
        keywords: ["花店", "竹林", "湖边", "四季"],
      },
    ],
    adjustPrompt: "场景还想加什么？比如「后山要有个秘密基地」「再加一个赶集场景」，没有就跳过～",
  },
  {
    prompt: "最后确认一下小镇的人文氛围和暗线方向：",
    cards: [
      {
        text: "温暖人情味：热心的王婶当非官方媒人、每周日赶集全镇出动、「三巨头」聊天团八卦一切。暗线是女主童年曾在此生活，有人认出她但选择守护她的平静。",
        keywords: ["人情味", "赶集", "八卦", "守护"],
      },
      {
        text: "表面平静暗流涌动：镇上每个人都有不为人知的过去，老一辈之间有未解的恩怨。失忆真相与十五年前一场事故有关，线索散落在小镇各个角落。",
        keywords: ["秘密", "恩怨", "事故", "线索"],
      },
      {
        text: "世外桃源渐被打破：小镇像时间胶囊般宁静，直到外界的人（经纪人、记者）开始闯入。宁静与喧嚣的碰撞推动故事走向高潮。",
        keywords: ["桃源", "打破", "碰撞", "高潮"],
      },
    ],
    adjustPrompt: "最后还想补充什么？比如「隐藏线索再多一条」「氛围再温暖一点」，没有的话我开始整理世界观了～",
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

// ─── Mock Character Rounds ───────────────────────────────────

const characterRounds: InspirationRound[] = [
  {
    prompt: "世界观搭建完毕！接下来创建角色。先看看女主角的性格方向：",
    cards: [
      {
        text: "外柔内刚型：表面温柔随和，实则内心坚韧。失忆前在娱乐圈养成了察言观色的本能，失忆后反而展现出天然的亲和力。做面时专注认真，不服输，面馆被她经营得有声有色。",
        keywords: ["温柔", "坚韧", "亲和力", "不服输"],
      },
      {
        text: "毒舌傲娇型：嘴硬心软，失忆后依然保留了当影后时的犀利和高标准。面馆经营得一丝不苟，对男主嘴上不饶人，行动却很诚实。生气时会多做一碗面摔在桌上。",
        keywords: ["毒舌", "傲娇", "犀利", "嘴硬心软"],
      },
      {
        text: "元气治愈型：失忆后像换了个人，开朗热情、对一切充满好奇。把面馆变成了小镇的社交中心，用美食治愈所有人。笑起来像清晨的阳光，但偶尔会在深夜突然安静下来。",
        keywords: ["元气", "治愈", "好奇", "反差"],
      },
    ],
    adjustPrompt: "想调整女主性格吗？比如「再强势一点」「加点文艺气质」，或者跳过～",
  },
  {
    prompt: "女主很有魅力！再来看看男主角的人设：",
    cards: [
      {
        text: "沉默守护型：话少但行动力强，默默照顾女主却从不邀功。中医馆里严肃认真，面对女主时会不自觉地语气变软。有一段不愿提起的过去，深夜独自在后山竹林练八段锦。",
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
    adjustPrompt: "想调整男主什么？比如「再高冷一点」「加点反派感」，或者跳过～",
  },
  {
    prompt: "男女主搭配很有火花！最后确认关键配角和人物关系：",
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
    adjustPrompt: "配角还想加谁？或者想调整关系设定？比如「加个反派」「闺蜜要更有存在感」，没有就跳过～",
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

// ─── Mock: free-input guided flow ────────────────────────────

const guidedFollowUps = [
  {
    analysis: "很棒的构思！我从你的描述中提取到了以下信息：\n\n• **题材方向**：都市言情\n• **核心设定**：影后失忆隐居小镇\n• **故事基调**：治愈温暖\n\n还有几个关键信息需要确认一下：",
    question: "你希望故事的**剧情元素**侧重哪些方面？比如：失忆、娱乐圈、美食、重生、职场等。另外，男女主之间是什么样的关系设定？",
  },
  {
    analysis: "明白了！我更新一下设定：\n\n• **剧情元素**：失忆 · 娱乐圈 · 美食 · 治愈\n• **人物关系**：欢喜冤家 · 青梅竹马\n\n最后确认一下：",
    question: "你想要什么样的**结局**？（HE / BE / 开放式）篇幅大概多长？叙事视角有偏好吗？",
  },
];

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
  | { id: string; sender: "model"; type: "micro-adjust"; prompt: string; round: number }
  | { id: string; sender: "user"; type: "card-selection"; content: string }
  | { id: string; sender: "user"; type: "text"; content: string };

// ─── Component ───────────────────────────────────────────────

export default function ChatPanel() {
  const setCreationStage = useEditorStore((s) => s.setCreationStage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selections, setSelections] = useState<Record<number, number>>({}); // round → selected card index
  const [currentRound, setCurrentRound] = useState(0); // 0=welcome, 1-3=inspiration, 4=confirm stage
  const [flowMode, setFlowMode] = useState<"none" | "inspiration" | "freeform">("none");
  const [freeformStep, setFreeformStep] = useState(0);
  const [awaitingAdjust, setAwaitingAdjust] = useState(false); // waiting for user micro-adjust
  const [adjustRound, setAdjustRound] = useState(0); // which round is awaiting adjust
  const [favKeywords, setFavKeywords] = useState<Set<string>>(new Set());
  const [stageEntry, setStageEntry] = useState<"worldbuilding" | "characters" | "outline" | null>(null);
  const [input, setInput] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const attachRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInit = useRef(false);

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

  // Scene card entry: model sends welcome message
  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;

    const thinkingId = `thinking-init`;
    setMessages([{ id: thinkingId, sender: "model", type: "thinking" }]);

    setTimeout(() => {
      setMessages([
        {
          id: "model-welcome",
          sender: "model",
          type: "welcome",
          prompt: "你好！欢迎来到小说创作工作台 ✨\n\n你可以让我帮你找灵感，也可以直接在下面描述你的故事——\n一段梗概、一个画面、甚至一句「我想写一个关于__的故事」都可以，我们一起把它变成完整的创作蓝图。",
        },
      ]);
    }, 1200);
  }, []);

  // Toggle keyword favorite
  const toggleKeyword = useCallback((kw: string) => {
    setFavKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(kw)) next.delete(kw);
      else next.add(kw);
      return next;
    });
  }, []);

  // Handle "帮我找灵感" button click
  const handleStartInspiration = useCallback(() => {
    setFlowMode("inspiration");

    const thinkingId = `thinking-r1`;
    setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);

    setTimeout(() => {
      const round = inspirationRounds[0];
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== thinkingId),
        {
          id: "model-r1",
          sender: "model",
          type: "inspiration",
          prompt: round.prompt,
          cards: round.cards,
          round: 1,
        },
      ]);
      setCurrentRound(1);
    }, 1500);
  }, []);

  // Handle "帮我找灵感" button in stage intros
  const handleStageInspiration = useCallback((stage: "worldbuilding" | "characters" | "outline") => {
    setStageEntry(null);

    if (stage === "worldbuilding") {
      const thinkingId = `thinking-wb-r1`;
      setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      setTimeout(() => {
        const wb1 = worldbuildingRounds[0];
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          { id: "model-r5", sender: "model", type: "inspiration", prompt: wb1.prompt, cards: wb1.cards, round: 5 },
        ]);
        setCurrentRound(5);
      }, 1500);
    } else if (stage === "characters") {
      const thinkingId = `thinking-ch-r1`;
      setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      setTimeout(() => {
        const ch1 = characterRounds[0];
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          { id: "model-r9", sender: "model", type: "inspiration", prompt: ch1.prompt, cards: ch1.cards, round: 9 },
        ]);
        setCurrentRound(9);
      }, 1500);
    } else if (stage === "outline") {
      const thinkingId = `thinking-outline-gen`;
      setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          { id: "model-outline", sender: "model", type: "outline-card", prompt: "大纲生成完毕！16章完整故事线已就绪，你可以在编辑区查看每章详情。确认后就可以开始正文创作了，有想调整的随时告诉我。", data: mockOutlineCard },
        ]);
        setCurrentRound(13);
        setCreationStage(4);
      }, 3000);
    }
  }, [setCreationStage]);

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
          const nextRound = inspirationRounds[fromRound];
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
              prompt: "根据你的灵感方向，我为你整理了以下创作设定。确认无误就可以开始构建世界观了，你也可以告诉我需要调整的地方。",
              settings: mockSettings,
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
          const nextWb = worldbuildingRounds[fromRound - 5 + 1];
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
              data: mockWorldbuilding,
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
          const nextChar = characterRounds[fromRound - 9 + 1];
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
              data: mockCharacterCard,
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
        ? characterRounds[round - 9]
        : isWb
        ? worldbuildingRounds[round - 5]
        : inspirationRounds[round - 1];
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

  // Handle refresh
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

    // If user is at a stage-intro and types text → directly generate the card for that stage
    if (stageEntry) {
      const thinkingId = `thinking-${stageEntry}-direct`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      if (stageEntry === "worldbuilding") {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            { id: `model-${stageEntry}-ack`, sender: "model", type: "text", content: "好的，我根据你的描述来构建世界观——" },
          ]);
          setTimeout(() => {
            const thinkingId2 = `thinking-wb-card-direct`;
            setMessages((prev) => [...prev, { id: thinkingId2, sender: "model", type: "thinking" }]);
            setTimeout(() => {
              setMessages((prev) => [
                ...prev.filter((m) => m.id !== thinkingId2),
                { id: "model-worldbuilding", sender: "model", type: "worldbuilding-card", prompt: "世界观构建完成！你可以在编辑区查看完整内容，觉得没问题就可以开始创建角色了。", data: mockWorldbuilding },
              ]);
              setCurrentRound(8);
              setCreationStage(2);
            }, 2500);
          }, 500);
        }, 1200);
        setStageEntry(null);
      } else if (stageEntry === "characters") {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            { id: `model-${stageEntry}-ack`, sender: "model", type: "text", content: "好的，我根据你的想法来创建角色——" },
          ]);
          setTimeout(() => {
            const thinkingId2 = `thinking-char-card-direct`;
            setMessages((prev) => [...prev, { id: thinkingId2, sender: "model", type: "thinking" }]);
            setTimeout(() => {
              setMessages((prev) => [
                ...prev.filter((m) => m.id !== thinkingId2),
                { id: "model-characters", sender: "model", type: "character-card", prompt: "角色创建完成！你可以在编辑区查看完整的角色档案，想调整随时告诉我。", data: mockCharacterCard },
              ]);
              setCurrentRound(12);
              setCreationStage(3);
            }, 2500);
          }, 500);
        }, 1200);
        setStageEntry(null);
      } else if (stageEntry === "outline") {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            { id: `model-${stageEntry}-ack`, sender: "model", type: "text", content: "好的，我根据你的思路来拟定大纲——" },
          ]);
          setTimeout(() => {
            const thinkingId2 = `thinking-outline-direct`;
            setMessages((prev) => [...prev, { id: thinkingId2, sender: "model", type: "thinking" }]);
            setTimeout(() => {
              setMessages((prev) => [
                ...prev.filter((m) => m.id !== thinkingId2),
                { id: "model-outline", sender: "model", type: "outline-card", prompt: "大纲生成完毕！16章完整故事线已就绪，确认后就可以开始正文创作了。", data: mockOutlineCard },
              ]);
              setCurrentRound(13);
              setCreationStage(4);
            }, 3000);
          }, 500);
        }, 1200);
        setStageEntry(null);
      }
      return;
    }

    // If at confirm stage (after settings card shown), user confirmed → show worldbuilding intro
    if (currentRound === 4) {
      const thinkingId = `thinking-wb-intro`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-wb-intro",
            sender: "model",
            type: "stage-intro",
            prompt: "设定确认！接下来我们构建故事发生的世界。\n\n你对世界观有自己的想法吗？可以直接描述你心目中的场景、地点、社会背景等——也可以让我来给你灵感。",
            stage: "worldbuilding",
          },
        ]);
        setStageEntry("worldbuilding");
      }, 1500);
      return;
    }

    // If at worldbuilding confirm stage, user confirmed → show characters intro
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
            type: "stage-intro",
            prompt: "世界观就位！接下来创建角色。\n\n你心里有主角的样子了吗？可以告诉我你想要的角色性格、身份、关系——或者让我来给你灵感。",
            stage: "characters",
          },
        ]);
        setStageEntry("characters");
      }, 1500);
      return;
    }

    // If at character confirm stage, user confirmed → show outline intro
    if (currentRound === 12) {
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
            type: "stage-intro",
            prompt: "角色档案完成！最后一步——搭建故事骨架。\n\n你对故事走向和章节安排有想法吗？可以描述你希望的结构、转折点、节奏——或者我来帮你规划。",
            stage: "outline",
          },
        ]);
        setStageEntry("outline");
      }, 1500);
      return;
    }

    // If at outline confirm stage, user confirmed → unlock editor for writing
    if (currentRound === 13) {
      const thinkingId = `thinking-write`;
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== thinkingId),
          {
            id: "model-writing",
            sender: "model",
            type: "text",
            content: "编辑器已解锁！你可以在左侧开始正文创作了。我会一直在这里，随时可以帮你：\n\n• 续写下一段\n• 润色已有内容\n• 调整情节走向\n• 补充细节描写\n\n开始写吧，期待你的故事！",
          },
        ]);
        setCurrentRound(14);
        setCreationStage(5);
      }, 2000);
      return;
    }

    // Free-form input flow
    if (flowMode === "none" || flowMode === "freeform") {
      setFlowMode("freeform");

      if (freeformStep < guidedFollowUps.length) {
        const followUp = guidedFollowUps[freeformStep];
        const thinkingId = `thinking-ff-${freeformStep}`;

        setTimeout(() => {
          setMessages((prev) => [...prev, { id: thinkingId, sender: "model", type: "thinking" }]);
        }, 300);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev.filter((m) => m.id !== thinkingId),
            {
              id: `model-ff-${freeformStep}`,
              sender: "model",
              type: "text",
              content: followUp.analysis + "\n\n" + followUp.question,
            },
          ]);
          setFreeformStep((s) => s + 1);
        }, 2000);
      } else {
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
              prompt: "根据你的描述，我为你整理了以下创作设定。确认无误就可以开始生成世界观了，你也可以告诉我需要调整的地方。",
              settings: mockSettings,
            },
          ]);
          setCurrentRound(4);
          setCreationStage(1);
        }, 2500);
      }
    }
  }, [input, awaitingAdjust, adjustRound, currentRound, flowMode, freeformStep, stageEntry, setCreationStage, proceedToNextRound, handleStageInspiration]);

  // Collect all keywords from all rounds for the "fav bar"
  const allFavKeywords = Array.from(favKeywords);

  return (
    <div className="h-full flex flex-col bg-gray-50/50">
      {/* Favorited Keywords Bar */}
      {allFavKeywords.length > 0 && (
        <div className="px-5 py-2.5 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-gray-400 shrink-0">收藏的元素</span>
            {allFavKeywords.map((kw) => (
              <span
                key={kw}
                className="px-2 py-0.5 bg-pink-50 text-pink-500 text-xs rounded-full border border-pink-100 flex items-center gap-1"
              >
                <Heart className="w-2.5 h-2.5 fill-pink-400" />
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5" ref={scrollRef}>
        {messages.map((msg) => {
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

                  {/* Refresh button */}
                  {isActive && (
                    <button
                      onClick={() => handleRefresh()}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-400 hover:text-indigo-500 transition mt-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      换一换
                    </button>
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
                      就这样 👌
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // ── Model: text message ──
          if (msg.sender === "model" && msg.type === "text") {
            return (
              <div key={msg.id} className="space-y-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">{msg.content}</div>
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
                      onClick={handleStartInspiration}
                      className="px-4 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl border border-indigo-100 hover:bg-indigo-100 transition"
                    >
                      ✨ 帮我找灵感
                    </button>
                  </div>
                )}
              </div>
            );
          }

          // ── Model: stage intro ──
          if (msg.sender === "model" && msg.type === "stage-intro") {
            const isActive = stageEntry === msg.stage;
            return (
              <div key={msg.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">AI</span>
                  </div>
                  <span className="text-xs text-gray-400">文心</span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed pl-8 whitespace-pre-wrap">{msg.prompt}</div>

                {isActive && (
                  <div className="pl-8 mt-2">
                    <button
                      onClick={() => handleStageInspiration(msg.stage)}
                      className="px-4 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl border border-indigo-100 hover:bg-indigo-100 transition"
                    >
                      ✨ 帮我找灵感
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
              stageEntry === "worldbuilding"
                ? "描述你想象中的世界：场景、地点、社会背景..."
                : stageEntry === "characters"
                ? "描述你心中的角色：性格、身份、人物关系..."
                : stageEntry === "outline"
                ? "描述你的故事走向：结构、转折点、章节安排..."
                : flowMode === "none"
                ? "描述你的故事构思，一段梗概、一个画面、甚至一句话..."
                : awaitingAdjust
                ? "想微调什么？直接说就行，或者点「就这样」跳过"
                : "输入你的想法..."
            }
            className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent min-h-[40px]"
            rows={1}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="relative" ref={attachRef}>
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
