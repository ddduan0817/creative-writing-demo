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
