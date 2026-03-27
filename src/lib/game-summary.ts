import { gameNodes } from "@/data/nodes";
import type {
  GameChoice,
  GameNode,
  RoundSnapshot,
  WealthHistoryPoint,
} from "@/types/game";
import { calculateAssetChange, updateDiscount, getCompanionChoice } from "@/lib/game-logic";

export const INITIAL_ASSETS = 9800; // 第一个节点前的巴菲特起步资产
export const COMPANION_LABEL = "Elon Musk";
export const COMPANION_TITLE = "你的陪跑教练";

export interface SimulationSummary {
  roundsPlayed: number;
  playerAssets: number;
  companionAssets: number;
  buffettAssets: number;
  playerChoices: GameChoice[];
  companionChoices: GameChoice[];
  assetHistory: WealthHistoryPoint[];
  playerMatchCount: number;
  companionMatchCount: number;
  playerMatchRate: number;
  companionMatchRate: number;
}

export function getChoiceOption(node: GameNode, choice: GameChoice) {
  return choice === "A" ? node.optionA : node.optionB;
}

export function createInitialHistoryPoint(): WealthHistoryPoint {
  return {
    label: "起点",
    year: gameNodes[0]?.year ?? new Date().getFullYear(),
    playerAssets: INITIAL_ASSETS,
    companionAssets: INITIAL_ASSETS,
    buffettAssets: INITIAL_ASSETS,
  };
}

export function createRoundSnapshot(
  node: GameNode,
  playerChoice: GameChoice,
  playerAssets: number,
  playerDiscount: number,
  companionAssets: number,
  companionDiscount: number
): RoundSnapshot {
  const companionChoice = getCompanionChoice(node.id);

  return {
    nodeId: node.id,
    year: node.year,
    playerChoice,
    companionChoice,
    buffettChoice: node.buffettRealChoice,
    playerAssetsBefore: playerAssets,
    playerAssetsAfter: calculateAssetChange(node, playerChoice, playerDiscount),
    companionAssetsBefore: companionAssets,
    companionAssetsAfter: calculateAssetChange(node, companionChoice, companionDiscount),
  };
}

export function appendHistoryPoint(
  history: WealthHistoryPoint[],
  node: GameNode,
  playerAssets: number,
  companionAssets: number
): WealthHistoryPoint[] {
  return [
    ...history,
    {
      label: `${node.year}`,
      year: node.year,
      playerAssets,
      companionAssets,
      buffettAssets: node.buffettRealAsset,
    },
  ];
}

export function countBuffettMatches(
  choices: GameChoice[],
  nodes: GameNode[] = gameNodes
): number {
  return choices.reduce((total, choice, index) => {
    return total + (choice === nodes[index]?.buffettRealChoice ? 1 : 0);
  }, 0);
}

export function calculateBuffettMatchRate(
  choices: GameChoice[],
  nodes: GameNode[] = gameNodes
): number {
  if (choices.length === 0) {
    return 0;
  }

  return Math.round((countBuffettMatches(choices, nodes) / choices.length) * 100);
}

export function simulateGameSummary(
  playerChoices: GameChoice[],
  nodes: GameNode[] = gameNodes
): SimulationSummary {
  let playerAssets = INITIAL_ASSETS;
  let companionAssets = INITIAL_ASSETS;
  let playerDiscount = 1.0;
  let playerTempRounds = 0;
  let companionDiscount = 1.0;
  let companionTempRounds = 0;
  const companionChoices: GameChoice[] = [];
  let playerMatchCount = 0;
  let companionMatchCount = 0;
  const assetHistory: WealthHistoryPoint[] = [createInitialHistoryPoint()];

  playerChoices.forEach((choice, index) => {
    const node = nodes[index];

    if (!node) {
      return;
    }

    const companionChoice = getCompanionChoice(node.id);
    companionChoices.push(companionChoice);

    // 计算资产
    playerAssets = calculateAssetChange(node, choice, playerDiscount);
    companionAssets = calculateAssetChange(node, companionChoice, companionDiscount);

    // 更新累计折扣
    const playerDiscountResult = updateDiscount(playerDiscount, playerTempRounds, node, choice);
    playerDiscount = playerDiscountResult.discount;
    playerTempRounds = playerDiscountResult.tempRounds;

    const companionDiscountResult = updateDiscount(companionDiscount, companionTempRounds, node, companionChoice);
    companionDiscount = companionDiscountResult.discount;
    companionTempRounds = companionDiscountResult.tempRounds;

    if (choice === node.buffettRealChoice) {
      playerMatchCount += 1;
    }

    if (companionChoice === node.buffettRealChoice) {
      companionMatchCount += 1;
    }

    assetHistory.push({
      label: `${node.year}`,
      year: node.year,
      playerAssets,
      companionAssets,
      buffettAssets: node.buffettRealAsset,
    });
  });

  const roundsPlayed = playerChoices.length;
  const buffettAssets =
    roundsPlayed > 0 ? nodes[roundsPlayed - 1]?.buffettRealAsset ?? INITIAL_ASSETS : INITIAL_ASSETS;

  return {
    roundsPlayed,
    playerAssets,
    companionAssets,
    buffettAssets,
    playerChoices,
    companionChoices,
    assetHistory,
    playerMatchCount,
    companionMatchCount,
    playerMatchRate: roundsPlayed === 0 ? 0 : Math.round((playerMatchCount / roundsPlayed) * 100),
    companionMatchRate:
      roundsPlayed === 0 ? 0 : Math.round((companionMatchCount / roundsPlayed) * 100),
  };
}
