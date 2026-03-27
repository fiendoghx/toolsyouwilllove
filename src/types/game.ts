export type GameChoice = "A" | "B";

export type PlayerGender = "male" | "female";
export type CompanionGender = PlayerGender;

export interface GameOption {
  label: string;
  description: string;
  financialReason: string;
  companionMonologue: string;
}

export interface DivergenceEffect {
  immediateMultiplier: number;
  futureDiscount: number;
  futureDiscountRounds: number; // -1 = 永久, N = 仅生效 N 轮
}

export interface GameNode {
  id: number;
  era: string;
  year: number;
  backgroundDescription: string;
  dilemma: string;
  optionA: GameOption;
  optionB: GameOption;
  buffettRealChoice: GameChoice;
  buffettRealAsset: number;
  buffettRealContext: string;
  divergenceEffect: DivergenceEffect;
}

export type GamePhase = "naming" | "playing" | "reveal" | "diverge" | "result";

export interface WealthHistoryPoint {
  label: string;
  year: number;
  playerAssets: number;
  companionAssets: number;
  buffettAssets: number;
}

export interface RoundSnapshot {
  nodeId: number;
  year: number;
  playerChoice: GameChoice;
  companionChoice: GameChoice;
  buffettChoice: GameChoice;
  playerAssetsBefore: number;
  playerAssetsAfter: number;
  companionAssetsBefore: number;
  companionAssetsAfter: number;
}

export interface GameState {
  phase: GamePhase;
  playerName: string;
  playerGender: PlayerGender;
  currentNode: number;
  playerChoices: GameChoice[];
  companionChoices: GameChoice[];
  playerAssets: number;
  playerDiscount: number;
  playerTempDiscountRounds: number;
  companionAssets: number;
  companionDiscount: number;
  companionTempDiscountRounds: number;
  assetHistory: WealthHistoryPoint[];
  isDivergent: boolean[];
  isPlayerBankrupt: boolean;
  bankruptNode: number | null;
  currentRound: RoundSnapshot | null;
}

export interface DNAScore {
  riskAppetite: number;
  longTermThinking: number;
  independentJudgment: number;
  conviction: number;
}

export type DNAType =
  | "稳健守护者"
  | "价值猎手"
  | "逆向思考者"
  | "冒险先锋"
  | "全能决策者";

export interface DNAProfile {
  name: DNAType;
  description: string;
  traits: string[];
  matchCondition: string;
}

export interface DNAScoreDimension {
  key: keyof DNAScore;
  label: string;
  description: string;
}

export interface ShareData {
  choices: GameChoice[];
  gender: PlayerGender;
  isBankrupt: boolean;
  bankruptNode: number | null;
}
