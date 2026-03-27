"use client";

import { motion } from "framer-motion";
import type { GameNode, RoundSnapshot } from "@/types/game";
import { formatUsd } from "@/lib/formatters";
import { getChoiceOption } from "@/lib/game-summary";

interface DivergePhaseProps {
  node: GameNode;
  round: RoundSnapshot;
  onMergeBack: () => void;
  onStayDivergent: () => void;
}

function buildDivergenceCommentary(node: GameNode): string {
  const effect = node.divergenceEffect;

  if (effect.immediateMultiplier > 1) {
    return "你这一步拿到了更漂亮的短期数字，但路线核心已经偏了。巴菲特更在意的是能否把这笔决定继续滚成未来几十年的复利。";
  }

  if (effect.immediateMultiplier < 1) {
    return "这一偏不仅让你少拿到筹码，也暴露出你更愿意为眼前的确定性感或情绪性判断买单。巴菲特赢在路径，而不只是当下盈亏。";
  }

  return "这一步账面差距不算夸张，真正分叉的是你的决策心法。你和巴菲特看的是同一张牌桌，但押注逻辑已经不同了。";
}

export default function DivergePhase({
  node,
  round,
  onMergeBack,
  onStayDivergent,
}: DivergePhaseProps) {
  const playerOption = getChoiceOption(node, round.playerChoice);
  const buffettOption = getChoiceOption(node, round.buffettChoice);
  const commentary = buildDivergenceCommentary(node);

  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 py-8 text-foreground sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,168,83,0.18),_transparent_34%)]" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative mx-auto flex min-h-[100svh] w-full max-w-5xl items-center"
      >
        <div className="panel gold-frame w-full rounded-[2rem] p-6 sm:p-8">
          <div className="border-b border-white/8 pb-6">
            <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
              Diverge Phase
            </p>
            <h1 className="mt-3 font-serif text-3xl text-[#fff0ca] sm:text-4xl">
              你已经偏离剧本，接下来怎么走？
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-muted-foreground sm:text-base">
              {commentary}
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <article className="rounded-[1.75rem] border border-white/10 bg-white/4 p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">
                你的路线
              </p>
              <h2 className="mt-4 font-serif text-2xl text-[#fff1cd]">
                {round.playerChoice} · {playerOption.label}
              </h2>
              <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
                {playerOption.financialReason}
              </p>
              <p className="mt-6 text-sm font-medium text-[#fff0ca]">
                资产来到 {formatUsd(round.playerAssetsAfter)}
              </p>
            </article>

            <article className="rounded-[1.75rem] border border-accent/30 bg-accent/10 p-5 sm:p-6">
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
                巴菲特路线
              </p>
              <h2 className="mt-4 font-serif text-2xl text-[#fff1cd]">
                {round.buffettChoice} · {buffettOption.label}
              </h2>
              <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
                {node.buffettRealContext}
              </p>
              <p className="mt-6 text-sm font-medium text-[#fff0ca]">
                历史身价约 {formatUsd(node.buffettRealAsset)}
              </p>
            </article>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/25 p-5 text-sm leading-7 text-muted-foreground">
            这里的选择不会改写已经发生的盈亏，但会记录你是否愿意继续沿着自己的判断偏航下去。
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onMergeBack}
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-accent/12 px-6 text-base font-semibold text-[#fff0c7] hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/25 hover:shadow-[0_8px_24px_rgba(212,168,83,0.15)]"
            >
              回到巴菲特的路线
            </button>
            <button
              type="button"
              onClick={onStayDivergent}
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-accent px-6 text-base font-semibold text-[#1c1508] hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#e2ba72]"
            >
              坚持我的选择
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
