"use client";

import { useReducer } from "react";
import DivergePhase from "@/components/game/DivergePhase";
import NamingPhase from "@/components/game/NamingPhase";
import PlayingPhase from "@/components/game/PlayingPhase";
import ResultPhase from "@/components/game/ResultPhase";
import RevealPhase from "@/components/game/RevealPhase";
import { gameNodes } from "@/data/nodes";
import { checkBankruptcy, updateDiscount } from "@/lib/game-logic";
import {
  appendHistoryPoint,
  createInitialHistoryPoint,
  createRoundSnapshot,
  INITIAL_ASSETS,
} from "@/lib/game-summary";
import type { GameChoice, GameState, PlayerGender } from "@/types/game";

type GameAction =
  | { type: "START_GAME"; name: string; gender: PlayerGender }
  | { type: "MAKE_CHOICE"; choice: GameChoice }
  | { type: "OPEN_DIVERGE" }
  | { type: "ADVANCE_MATCHED" }
  | { type: "RESOLVE_DIVERGENCE"; isDivergent: boolean }
  | { type: "RESTART" };

function createInitialState(): GameState {
  return {
    phase: "naming",
    playerName: "",
    playerGender: "male",
    currentNode: 0,
    playerChoices: [],
    companionChoices: [],
    playerAssets: INITIAL_ASSETS,
    playerDiscount: 1.0,
    playerTempDiscountRounds: 0,
    companionAssets: INITIAL_ASSETS,
    companionDiscount: 1.0,
    companionTempDiscountRounds: 0,
    assetHistory: [createInitialHistoryPoint()],
    isDivergent: [],
    isPlayerBankrupt: false,
    bankruptNode: null,
    currentRound: null,
  };
}

function finalizeRound(state: GameState, isDivergent: boolean): GameState {
  const node = gameNodes[state.currentNode];
  const round = state.currentRound;

  if (!node || !round) {
    return state;
  }

  const playerAssets = round.playerAssetsAfter;
  const companionAssets = round.companionAssetsAfter;
  const playerChoices = [...state.playerChoices, round.playerChoice];
  const companionChoices = [...state.companionChoices, round.companionChoice];
  const assetHistory = appendHistoryPoint(
    state.assetHistory,
    node,
    playerAssets,
    companionAssets
  );

  // 更新玩家累计折扣
  const playerDiscountResult = updateDiscount(
    state.playerDiscount,
    state.playerTempDiscountRounds,
    node,
    round.playerChoice
  );

  // 更新教练累计折扣
  const companionDiscountResult = updateDiscount(
    state.companionDiscount,
    state.companionTempDiscountRounds,
    node,
    round.companionChoice
  );

  const isPlayerBankrupt = checkBankruptcy(playerAssets, node.buffettRealAsset);
  const isLastNode = state.currentNode >= gameNodes.length - 1;

  return {
    ...state,
    phase: isPlayerBankrupt || isLastNode ? "result" : "playing",
    currentNode: isPlayerBankrupt || isLastNode ? state.currentNode : state.currentNode + 1,
    playerChoices,
    companionChoices,
    playerAssets,
    companionAssets,
    playerDiscount: playerDiscountResult.discount,
    playerTempDiscountRounds: playerDiscountResult.tempRounds,
    companionDiscount: companionDiscountResult.discount,
    companionTempDiscountRounds: companionDiscountResult.tempRounds,
    assetHistory,
    isDivergent: [...state.isDivergent, isDivergent],
    isPlayerBankrupt,
    bankruptNode: isPlayerBankrupt ? node.id : null,
    currentRound: null,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        phase: "playing",
        playerName: action.name,
        playerGender: action.gender,
      };

    case "MAKE_CHOICE": {
      const node = gameNodes[state.currentNode];

      if (!node) {
        return state;
      }

      return {
        ...state,
        phase: "reveal",
        currentRound: createRoundSnapshot(
          node,
          action.choice,
          state.playerAssets,
          state.playerDiscount,
          state.companionAssets,
          state.companionDiscount
        ),
      };
    }

    case "OPEN_DIVERGE":
      return state.currentRound ? { ...state, phase: "diverge" } : state;

    case "ADVANCE_MATCHED":
      return state.currentRound?.playerChoice === state.currentRound?.buffettChoice
        ? finalizeRound(state, false)
        : state;

    case "RESOLVE_DIVERGENCE":
      return finalizeRound(state, action.isDivergent);

    case "RESTART":
      return createInitialState();

    default:
      return state;
  }
}

export default function PlayPage() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);

  const currentNode = gameNodes[state.currentNode];

  if (state.phase === "naming") {
    return (
      <NamingPhase
        onComplete={(name, gender) =>
          dispatch({ type: "START_GAME", name, gender })
        }
      />
    );
  }

  if (!currentNode && state.phase !== "result") {
    return null;
  }

  return (
    <main className="bg-background">
      {state.phase === "playing" && currentNode ? (
        <PlayingPhase
          node={currentNode}
          nodeIndex={state.currentNode}
          playerName={state.playerName}
          playerAssets={state.playerAssets}
          onChoice={(choice) => dispatch({ type: "MAKE_CHOICE", choice })}
        />
      ) : null}

      {state.phase === "reveal" && currentNode && state.currentRound ? (
        <RevealPhase
          node={currentNode}
          round={state.currentRound}
          playerName={state.playerName}
          onAdvance={() => dispatch({ type: "ADVANCE_MATCHED" })}
          onEnterDiverge={() => dispatch({ type: "OPEN_DIVERGE" })}
        />
      ) : null}

      {state.phase === "diverge" && currentNode && state.currentRound ? (
        <DivergePhase
          node={currentNode}
          round={state.currentRound}
          onMergeBack={() =>
            dispatch({ type: "RESOLVE_DIVERGENCE", isDivergent: false })
          }
          onStayDivergent={() =>
            dispatch({ type: "RESOLVE_DIVERGENCE", isDivergent: true })
          }
        />
      ) : null}

      {state.phase === "result" ? (
        <ResultPhase
          playerName={state.playerName}
          playerGender={state.playerGender}
          playerChoices={state.playerChoices}
          companionChoices={state.companionChoices}
          playerAssets={state.playerAssets}
          companionAssets={state.companionAssets}
          assetHistory={state.assetHistory}
          isDivergent={state.isDivergent}
          isPlayerBankrupt={state.isPlayerBankrupt}
          bankruptNode={state.bankruptNode}
          onRestart={() => dispatch({ type: "RESTART" })}
        />
      ) : null}
    </main>
  );
}
