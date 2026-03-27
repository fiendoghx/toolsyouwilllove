"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { dnaScoreDimensions, dnaTypes } from "@/data/dna-types";
import { gameNodes } from "@/data/nodes";
import { encodeShareData } from "@/lib/share-codec";
import { formatPercent, formatUsd } from "@/lib/formatters";
import {
  INITIAL_ASSETS,
  calculateBuffettMatchRate,
  countBuffettMatches,
} from "@/lib/game-summary";
import { calculateDNAScore, getDNAType } from "@/lib/game-logic";
import type { GameChoice, PlayerGender, WealthHistoryPoint } from "@/types/game";

const WealthCurve = dynamic(() => import("./WealthCurve"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 items-center justify-center rounded-[1.5rem] border border-white/8 bg-black/20 text-sm text-muted-foreground">
      财富曲线装载中...
    </div>
  ),
});

interface ResultPhaseProps {
  playerName: string;
  playerGender: PlayerGender;
  playerChoices: GameChoice[];
  companionChoices: GameChoice[];
  playerAssets: number;
  companionAssets: number;
  assetHistory: WealthHistoryPoint[];
  isDivergent: boolean[];
  isPlayerBankrupt: boolean;
  bankruptNode: number | null;
  onRestart: () => void;
}

export default function ResultPhase({
  playerName,
  playerGender,
  playerChoices,
  companionChoices,
  playerAssets,
  companionAssets,
  assetHistory,
  isDivergent,
  isPlayerBankrupt,
  bankruptNode,
  onRestart,
}: ResultPhaseProps) {
  const [shareState, setShareState] = useState<"idle" | "copied" | "error">("idle");

  const score = calculateDNAScore(playerChoices, gameNodes);
  const dnaType = getDNAType(score);
  const dnaInfo = dnaTypes.find((item) => item.name === dnaType);
  const roundsPlayed = playerChoices.length;
  const buffettAssets = assetHistory.at(-1)?.buffettAssets ?? INITIAL_ASSETS;
  const playerMatchRate = calculateBuffettMatchRate(playerChoices, gameNodes);
  const companionMatchRate = calculateBuffettMatchRate(companionChoices, gameNodes);
  const divergentCount = isDivergent.filter(Boolean).length;
  const shareCode = encodeShareData({
    choices: playerChoices,
    gender: playerGender,
    isBankrupt: isPlayerBankrupt,
    bankruptNode,
  });

  const comparisonRows = [
    {
      label: "最终资产",
      player: formatUsd(playerAssets),
      companion: formatUsd(companionAssets),
      buffett: formatUsd(buffettAssets),
    },
    {
      label: "与巴菲特同路",
      player: `${countBuffettMatches(playerChoices, gameNodes)} / ${roundsPlayed} (${formatPercent(playerMatchRate)})`,
      companion: `${countBuffettMatches(companionChoices, gameNodes)} / ${roundsPlayed} (${formatPercent(companionMatchRate)})`,
      buffett: "原始剧本",
    },
    {
      label: "完成关卡",
      player: `${roundsPlayed} / 10`,
      companion: `${roundsPlayed} / 10`,
      buffett: `${roundsPlayed} / 10`,
    },
    {
      label: "路线状态",
      player: isPlayerBankrupt
        ? `第 ${bankruptNode} 关破产`
        : divergentCount > 0
          ? `偏航 ${divergentCount} 次`
          : "全程同路",
      companion: "固定剧本自动驾驶",
      buffett: "历史真实路线",
    },
  ];

  const handleShare = async () => {
    if (!shareCode) {
      setShareState("error");
      return;
    }

    try {
      const shareUrl = `${window.location.origin}/buffett/share/${shareCode}`;
      await navigator.clipboard.writeText(shareUrl);
      setShareState("copied");
    } catch {
      setShareState("error");
    }
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 py-8 text-foreground sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,168,83,0.18),_transparent_34%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative mx-auto flex w-full max-w-6xl flex-col gap-6"
      >
        <header className="panel gold-frame rounded-[2rem] p-6 sm:p-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
            Result Phase
          </p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-serif text-4xl text-[#fff0cb] sm:text-5xl">
                {dnaType}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
                {dnaInfo?.description}
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-accent/30 bg-accent/10 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
                {playerName} 的结局
              </p>
              <p className="mt-3 text-3xl font-semibold text-[#fff2ce]">
                {formatUsd(playerAssets)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {isPlayerBankrupt
                  ? `你在第 ${bankruptNode} 关出局，但已经留下完整的决策轨迹。`
                  : "你活完了 10 个节点，留下了一条完整的人生资产曲线。"}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="panel gold-frame rounded-[2rem] p-6 sm:p-8">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-serif text-xl text-[#fff0cb] sm:text-2xl">三方对比表</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-accent/70">
                You / Elon / Buffett
              </span>
            </div>

            <div className="rounded-[1.5rem] border border-white/8">
              <table className="w-full table-fixed text-left text-xs sm:text-sm">
                <colgroup>
                  <col className="w-[22%]" />
                  <col className="w-[26%]" />
                  <col className="w-[26%]" />
                  <col className="w-[26%]" />
                </colgroup>
                <thead className="bg-white/5 text-[#fff2cd]">
                  <tr>
                    <th className="px-2.5 py-2.5 font-medium sm:px-4 sm:py-3">指标</th>
                    <th className="px-2.5 py-2.5 font-medium sm:px-4 sm:py-3">你</th>
                    <th className="px-2.5 py-2.5 font-medium sm:px-4 sm:py-3">Elon</th>
                    <th className="px-2.5 py-2.5 font-medium sm:px-4 sm:py-3">巴菲特</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label} className="border-t border-white/8">
                      <td className="break-all px-2.5 py-3 text-muted-foreground sm:px-4 sm:py-4">{row.label}</td>
                      <td className="break-all px-2.5 py-3 text-[#fff2cd] sm:px-4 sm:py-4">{row.player}</td>
                      <td className="break-all px-2.5 py-3 text-[#d8e0f2] sm:px-4 sm:py-4">{row.companion}</td>
                      <td className="break-all px-2.5 py-3 text-accent sm:px-4 sm:py-4">{row.buffett}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel gold-frame rounded-[2rem] p-6 sm:p-8">
            <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-serif text-xl text-[#fff0cb] sm:text-2xl">Decision DNA 报告</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-accent/70">
                4 Dimensions
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {dnaInfo?.traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-[#f7e8c3]"
                >
                  {trait}
                </span>
              ))}
            </div>

            <p className="mt-5 text-sm leading-8 text-muted-foreground sm:text-base">
              {dnaInfo?.matchCondition}
            </p>

            <div className="mt-6 space-y-3 sm:space-y-4">
              {dnaScoreDimensions.map((dimension) => (
                <div key={dimension.key} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-xs sm:gap-4 sm:text-sm">
                    <div className="min-w-0">
                      <p className="text-[#fff1ca]">{dimension.label}</p>
                      <p className="text-[10px] text-muted-foreground sm:text-xs">{dimension.description}</p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-accent sm:text-sm">
                      {formatPercent(score[dimension.key])}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8 sm:h-2">
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-500"
                      style={{ width: `${score[dimension.key]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="panel gold-frame rounded-[2rem] p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-[#fff0cb]">财富曲线</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-accent/70">
              Dynamic Import / Recharts
            </span>
          </div>
          <WealthCurve data={assetHistory} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-accent px-6 text-base font-semibold text-[#1d1608] hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#e2ba72]"
          >
            {shareState === "copied"
              ? "分享链接已复制"
              : shareState === "error"
                ? "复制失败，再试一次"
                : "复制分享链接"}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 text-base font-semibold text-[#fff0cb] hover:border-accent/35 hover:bg-white/8"
          >
            再来一次
          </button>
          <Link
            href="/buffett"
            className="inline-flex min-h-12 items-center justify-center text-sm text-muted-foreground hover:text-accent"
          >
            回到首页
          </Link>
        </section>
      </motion.div>
    </section>
  );
}
