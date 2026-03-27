import type { DNAScore, DNAType, GameChoice, GameNode } from "@/types/game";

interface ChoiceDNAFlags {
  risk: boolean;
  longTerm: boolean;
  independent: boolean;
}

const choiceDNAProfiles: Record<number, Record<GameChoice, ChoiceDNAFlags>> = {
  1: {
    A: { risk: true, longTerm: false, independent: true },
    B: { risk: false, longTerm: true, independent: false },
  },
  2: {
    A: { risk: false, longTerm: false, independent: false },
    B: { risk: true, longTerm: true, independent: true },
  },
  3: {
    A: { risk: true, longTerm: true, independent: true },
    B: { risk: false, longTerm: false, independent: false },
  },
  4: {
    A: { risk: false, longTerm: true, independent: false },
    B: { risk: true, longTerm: false, independent: true },
  },
  5: {
    A: { risk: false, longTerm: false, independent: false },
    B: { risk: true, longTerm: true, independent: true },
  },
  6: {
    A: { risk: false, longTerm: false, independent: false },
    B: { risk: true, longTerm: true, independent: true },
  },
  7: {
    A: { risk: false, longTerm: true, independent: true },
    B: { risk: true, longTerm: false, independent: false },
  },
  8: {
    A: { risk: true, longTerm: true, independent: true },
    B: { risk: false, longTerm: false, independent: false },
  },
  9: {
    A: { risk: false, longTerm: true, independent: true },
    B: { risk: false, longTerm: false, independent: false },
  },
  10: {
    A: { risk: true, longTerm: false, independent: false },
    B: { risk: false, longTerm: true, independent: true },
  },
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/**
 * 计算资产变化（巴菲特基准线 + 偏离效果模型）
 *
 * - 选了巴菲特选项 → 资产 = buffettRealAsset × 累计折扣
 * - 选了非巴菲特选项 → 资产 = buffettRealAsset × 即时倍率 × 累计折扣
 */
export function calculateAssetChange(
  node: GameNode,
  choice: GameChoice,
  accumulatedDiscount: number
): number {
  const isDivergent = choice !== node.buffettRealChoice;

  if (isDivergent) {
    return Math.round(
      node.buffettRealAsset * node.divergenceEffect.immediateMultiplier * accumulatedDiscount
    );
  }

  return Math.round(node.buffettRealAsset * accumulatedDiscount);
}

/**
 * 更新累计折扣
 *
 * - 选了巴菲特选项 → 折扣不变（只处理临时折扣到期）
 * - 选了非巴菲特选项 → 折扣叠加 futureDiscount
 */
export function updateDiscount(
  currentDiscount: number,
  tempDiscountRounds: number,
  node: GameNode,
  choice: GameChoice
): { discount: number; tempRounds: number } {
  let discount = currentDiscount;
  let tempRounds = tempDiscountRounds;

  // 先处理临时折扣到期：如果上轮有临时折扣，本轮结束后恢复
  if (tempRounds > 0) {
    tempRounds -= 1;
    if (tempRounds === 0) {
      // 临时折扣到期，除以上次的临时折扣来恢复
      // 但这里简化处理：临时折扣已经乘进去了，到期时不恢复（叠加模型）
      // 实际设计：节点7的折扣只生效1轮，到期后discount不再包含该折扣
      // 我们在应用临时折扣时记录，到期时反除
    }
  }

  const isDivergent = choice !== node.buffettRealChoice;

  if (isDivergent) {
    const effect = node.divergenceEffect;

    if (effect.futureDiscount !== 1.0) {
      discount *= effect.futureDiscount;

      if (effect.futureDiscountRounds > 0) {
        // 临时折扣
        tempRounds = effect.futureDiscountRounds;
      }
    }
  }

  return { discount, tempRounds };
}

/**
 * 处理临时折扣到期（在下一轮开始前调用）
 * 返回恢复后的折扣值
 */
export function expireTempDiscount(
  currentDiscount: number,
  tempDiscountRounds: number,
  lastDivergenceEffect: { futureDiscount: number } | null
): { discount: number; tempRounds: number } {
  if (tempDiscountRounds === 1 && lastDivergenceEffect && lastDivergenceEffect.futureDiscount !== 1.0) {
    // 临时折扣到期，反除恢复
    return {
      discount: currentDiscount / lastDivergenceEffect.futureDiscount,
      tempRounds: 0,
    };
  }

  if (tempDiscountRounds > 1) {
    return { discount: currentDiscount, tempRounds: tempDiscountRounds - 1 };
  }

  return { discount: currentDiscount, tempRounds: 0 };
}

/**
 * 破产判定：玩家资产低于巴菲特资产的 1%
 */
export function checkBankruptcy(playerAssets: number, buffettAssets: number): boolean {
  return playerAssets < buffettAssets * 0.01;
}

export function calculateDNAScore(
  playerChoices: GameChoice[],
  nodes: GameNode[]
): DNAScore {
  const totalChoices = Math.min(playerChoices.length, nodes.length);

  if (totalChoices === 0) {
    return {
      riskAppetite: 0,
      longTermThinking: 0,
      independentJudgment: 0,
      conviction: 0,
    };
  }

  let riskSelections = 0;
  let longTermSelections = 0;
  let independentSelections = 0;

  for (let index = 0; index < totalChoices; index += 1) {
    const choice = playerChoices[index];
    const profile = choiceDNAProfiles[nodes[index].id]?.[choice];

    if (!profile) {
      continue;
    }

    if (profile.risk) {
      riskSelections += 1;
    }

    if (profile.longTerm) {
      longTermSelections += 1;
    }

    if (profile.independent) {
      independentSelections += 1;
    }
  }

  let conviction = 0;

  if (totalChoices > 1) {
    let sameDirectionTransitions = 0;

    for (let index = 1; index < totalChoices; index += 1) {
      if (playerChoices[index] === playerChoices[index - 1]) {
        sameDirectionTransitions += 1;
      }
    }

    conviction = clampScore((sameDirectionTransitions / (totalChoices - 1)) * 100);
  }

  return {
    riskAppetite: clampScore((riskSelections / totalChoices) * 100),
    longTermThinking: clampScore((longTermSelections / totalChoices) * 100),
    independentJudgment: clampScore((independentSelections / totalChoices) * 100),
    conviction,
  };
}

export function getDNAType(score: DNAScore): DNAType {
  const values = [
    score.riskAppetite,
    score.longTermThinking,
    score.independentJudgment,
    score.conviction,
  ];
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const minScore = Math.min(...values);
  const maxScore = Math.max(...values);

  if (average >= 70 && minScore >= 50 && maxScore - minScore <= 30) {
    return "全能决策者";
  }

  if (score.riskAppetite >= 70 && score.conviction >= 45) {
    return "冒险先锋";
  }

  if (score.independentJudgment >= 70 && score.longTermThinking >= 50) {
    return "逆向思考者";
  }

  if (score.riskAppetite <= 35 && score.longTermThinking >= 65) {
    return "稳健守护者";
  }

  return "价值猎手";
}

export function getCompanionChoice(nodeId: number): GameChoice {
  const muskChoices: Record<number, GameChoice> = {
    1: "A",
    2: "B",
    3: "A",
    4: "A",
    5: "B",
    6: "B",
    7: "B",
    8: "A",
    9: "B",
    10: "A",
  };

  return muskChoices[nodeId] ?? "A";
}
