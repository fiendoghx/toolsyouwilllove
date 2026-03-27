"use client";

import { motion } from "framer-motion";
import type { GameNode, RoundSnapshot } from "@/types/game";
import { formatUsd } from "@/lib/formatters";
import { COMPANION_LABEL, getChoiceOption } from "@/lib/game-summary";

interface RevealPhaseProps {
  node: GameNode;
  round: RoundSnapshot;
  playerName: string;
  onAdvance: () => void;
  onEnterDiverge: () => void;
}

export default function RevealPhase({
  node,
  round,
  playerName,
  onAdvance,
  onEnterDiverge,
}: RevealPhaseProps) {
  const isAligned = round.playerChoice === round.buffettChoice;
  const playerOption = getChoiceOption(node, round.playerChoice);
  const companionOption = getChoiceOption(node, round.companionChoice);
  const buffettOption = getChoiceOption(node, round.buffettChoice);

  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 py-8 text-foreground sm:px-8">
      <div
        className={`absolute inset-0 ${
          isAligned
            ? "bg-[radial-gradient(circle_at_top,_rgba(212,168,83,0.28),_transparent_32%)]"
            : "bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.14),_transparent_30%)]"
        }`}
      />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl items-center"
      >
        <div className="panel gold-frame w-full rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-6 border-b border-white/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
                Reveal Phase
              </p>
              <h1 className="mt-3 font-serif text-3xl text-[#fff0ca] sm:text-4xl">
                {isAligned ? "这一步，你和巴菲特走在同一条线上" : "这一步，你拐出了巴菲特的路线"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {playerName} 选择了 {round.playerChoice}，{COMPANION_LABEL} 选择了{" "}
                {round.companionChoice}，而巴菲特真正走的是 {round.buffettChoice}。
              </p>
            </div>

            {isAligned ? (
              <button
                type="button"
                onClick={onAdvance}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-accent px-6 text-sm font-semibold text-[#1d1608] hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#e2ba72]"
              >
                进入下一关
              </button>
            ) : (
              <button
                type="button"
                onClick={onEnterDiverge}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-accent px-6 text-sm font-semibold text-[#1d1608] hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#e2ba72]"
              >
                进入偏离评价
              </button>
            )}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[
              {
                title: `${playerName} 的出手`,
                choice: round.playerChoice,
                headline: playerOption.label,
                detail: playerOption.financialReason,
                stat: `${formatUsd(round.playerAssetsBefore)} → ${formatUsd(round.playerAssetsAfter)}`,
                tone: isAligned ? "border-accent/35 bg-accent/10" : "border-white/10 bg-white/4",
              },
              {
                title: `${COMPANION_LABEL} 的独白`,
                choice: round.companionChoice,
                headline: companionOption.label,
                detail: companionOption.companionMonologue,
                stat: `${formatUsd(round.companionAssetsBefore)} → ${formatUsd(round.companionAssetsAfter)}`,
                tone: "border-white/10 bg-white/4",
              },
              {
                title: "巴菲特的真实选择",
                choice: round.buffettChoice,
                headline: buffettOption.label,
                detail: node.buffettRealContext,
                stat: `${node.year} 年身价约 ${formatUsd(node.buffettRealAsset)}`,
                tone: "border-accent/35 bg-accent/10",
              },
            ].map((card) => (
              <article
                key={card.title}
                className={`rounded-[1.75rem] border p-5 sm:p-6 ${card.tone}`}
              >
                <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
                  {card.title}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <h2 className="font-serif text-2xl text-[#fff1cc]">{card.headline}</h2>
                  <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-sm text-accent">
                    {card.choice}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
                  {card.detail}
                </p>
                <p className="mt-6 text-sm font-medium text-[#fff0c7]">{card.stat}</p>
              </article>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
