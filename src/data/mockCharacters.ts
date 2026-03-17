export interface Character {
  id: string;
  name: string;
  role: "main" | "secondary";
  identity: string;
  motivation: string;
  personality: string[];
  background: string;
  arc: string;
}

export const mockScreenplayCharacters: Character[] = [
  {
    id: "sc1",
    name: "林晓",
    role: "main",
    identity: "刑侦记者",
    motivation: "追查未婚夫的双重身份，揭开隐藏的真相",
    personality: ["敏锐", "执着", "外柔内刚"],
    background:
      "28岁，某都市报社深度调查记者。一次偶然的线人接头，让她卷入一桩远超预期的阴谋，而所有线索都指向她最信任的人。",
    arc: "从信任他人到独立求真",
  },
  {
    id: "sc2",
    name: "陈深",
    role: "main",
    identity: "林晓的未婚夫 / 神秘组织成员",
    motivation: "在感情与任务之间艰难抉择",
    personality: ["沉稳", "矛盾", "深情"],
    background:
      "表面是科技公司高管，实际隐藏着另一重身份。深爱林晓，却无法坦白自己的秘密。当林晓的调查越来越接近真相时，他被迫做出选择。",
    arc: "从隐瞒者到坦诚面对",
  },
  {
    id: "sc3",
    name: "陈队长",
    role: "secondary",
    identity: "市局刑侦队队长",
    motivation: "破获连环案件，维护城市安全",
    personality: ["老练", "正直", "不苟言笑"],
    background:
      "从警二十年的老刑警，在监控室发现了关键时间线矛盾。他看似站在林晓的对立面，实际上也在追查同一个真相。",
    arc: "从例行公事到深入追查",
  },
];

export const mockCharacters: Character[] = [
  {
    id: "c1",
    name: "沈夜川",
    role: "main",
    identity: "天机阁末代传人",
    motivation: "找回被封印的记忆碎片，揭开灵脉枯竭的真相",
    personality: ["隐忍", "聪慧", "外冷内热"],
    background:
      "十年前灵脉暴动，天机阁一夜覆灭。他是唯一的幸存者，却失去了那夜所有记忆。以游方术士身份隐匿于市井，直到一柄古剑在他手中自行苏醒。",
    arc: "从逃避者到直面真相的承担者",
  },
  {
    id: "c2",
    name: "姜晚吟",
    role: "main",
    identity: "南渊城城主之女 / 暗河情报网首领",
    motivation: "守护南渊城，查明父亲失踪的原因",
    personality: ["果决", "细腻", "亦正亦邪"],
    background:
      "表面是深居简出的大小姐，实际掌控着大陆最大的地下情报网。三年前父亲南巡归来后性情大变，她开始暗中调查，意外发现灵脉枯竭与父亲有关。",
    arc: "从为家族而战到为天下而战",
  },
  {
    id: "c3",
    name: "裴长庚",
    role: "secondary",
    identity: "皇城禁卫军统领",
    motivation: "执行皇命追查灵脉异变，但内心矛盾于忠诚与正义",
    personality: ["刚正", "固执", "重情义"],
    background:
      "寒门出身，凭一身武功和绝对忠诚官至统领。他奉命追捕沈夜川，却在调查中发现真正的敌人可能就在皇城之内。",
    arc: "从绝对服从到独立判断",
  },
];
