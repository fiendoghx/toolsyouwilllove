import type { DNAProfile, DNAScoreDimension } from "@/types/game";

export const dnaTypes: DNAProfile[] = [
  {
    name: "稳健守护者",
    description:
      "你把不犯大错看得比一夜暴富更重要，愿意为了更高的生存率放弃一部分爆发力。你的优势不是花哨，而是在漫长周期里一直留在牌桌上。",
    traits: ["低风险偏好", "耐心等待", "重视本金", "纪律稳定"],
    matchCondition: "风险偏好明显偏低，长期思维较高，且很少为了短期热度改变节奏。",
  },
  {
    name: "价值猎手",
    description:
      "你擅长在喧闹中盯住价格与价值的错位，既不会盲目保守，也不会为故事支付溢价。你相信真正的机会往往长得不性感，但赔率足够好。",
    traits: ["安全边际", "赔率意识", "理性定价", "耐心埋伏"],
    matchCondition: "长期思维较高，风险偏好适中，做选择时更关注估值和赔率而非情绪。",
  },
  {
    name: "逆向思考者",
    description:
      "你对集体狂热天生警惕，越是人人看懂的机会，你越想再追问一层。你不怕短期显得格格不入，只怕自己在关键时刻随了大流。",
    traits: ["独立判断", "逆向观察", "抗噪能力", "不怕孤独"],
    matchCondition: "独立判断分明显偏高，并多次选择与时代主流情绪相反的路径。",
  },
  {
    name: "冒险先锋",
    description:
      "你相信大机会只奖励敢于重仓的人，宁可承受巨大的波动，也不愿意平平稳稳地慢慢赢。你的决策像冲锋，收益和回撤都比别人更陡。",
    traits: ["高风险偏好", "重仓出击", "行动果断", "野心强烈"],
    matchCondition: "风险偏好显著偏高，且在关键节点更愿意选择高波动、高赔率的路线。",
  },
  {
    name: "全能决策者",
    description:
      "你既能理解风险，也能把握赔率；既敢逆向，也懂得在合适时保持克制。你的强项不是某一项极端天赋，而是在复杂局面里做出均衡又有效的判断。",
    traits: ["维度均衡", "局势感知", "长期复盘", "适应力强"],
    matchCondition: "四个维度整体较高且分布均衡，没有明显短板，能在不同情境里切换打法。",
  },
];

export const dnaScoreDimensions: DNAScoreDimension[] = [
  {
    key: "riskAppetite",
    label: "风险偏好",
    description: "你在10次选择中有多常站到高波动、高回报的一边，分数越高代表越愿意为大赔率承受更大回撤。",
  },
  {
    key: "longTermThinking",
    label: "长期思维",
    description: "你有多常愿意放弃眼前更轻松的收益，转而选择更能在多年后放大复利和护城河的方案。",
  },
  {
    key: "independentJudgment",
    label: "独立判断",
    description: "你有多常在舆论压力、从众情绪或主流共识面前坚持自己的看法，而不是为了舒服而跟风。",
  },
  {
    key: "conviction",
    label: "信念坚定",
    description: "你的决策方向是否前后一致。分数越高，说明你更少左右横跳，更愿意沿着同一套信念连续下注。",
  },
];
