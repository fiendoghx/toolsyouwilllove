import type { Metadata } from "next";
import Link from "next/link";
import { dnaTypes } from "@/data/dna-types";
import { gameNodes } from "@/data/nodes";
import { calculateDNAScore, getDNAType } from "@/lib/game-logic";
import { formatPercent, formatUsd } from "@/lib/formatters";
import { calculateBuffettMatchRate, simulateGameSummary } from "@/lib/game-summary";
import { decodeShareData } from "@/lib/share-codec";

type SharePageProps = {
  params: Promise<{ code: string }>;
};

function buildShareDescription(code: string) {
  const data = decodeShareData(code);

  if (!data) {
    return {
      title: "分享结果无效",
      description: "这个分享码已经失效，重新开始一局，生成你自己的战绩链接。",
    };
  }

  const score = calculateDNAScore(data.choices, gameNodes);
  const dnaType = getDNAType(score);
  const summary = simulateGameSummary(data.choices, gameNodes);
  const matchRate = calculateBuffettMatchRate(data.choices, gameNodes);

  return {
    title: `${dnaType} · 与巴菲特同路 ${matchRate}%`,
    description: data.isBankrupt
      ? `在第 ${data.bankruptNode} 关出局，留下 ${formatUsd(summary.playerAssets)} 的战绩。`
      : `打出 ${formatUsd(summary.playerAssets)} 的最终资产，DNA 类型是 ${dnaType}。`,
  };
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { code } = await params;
  const meta = buildShareDescription(code);
  const image = `/buffett/api/og?code=${encodeURIComponent(code)}`;

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: "重走巴菲特人生路",
      description: meta.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [image],
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { code } = await params;
  const data = decodeShareData(code);

  if (!data) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center px-5 py-10 text-foreground sm:px-8">
        <section className="panel gold-frame w-full max-w-2xl rounded-[2rem] p-8 text-center sm:p-10">
          <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
            Share Code Invalid
          </p>
          <h1 className="mt-4 font-serif text-4xl text-[#fff0cb]">这个分享码失效了</h1>
          <p className="mt-5 text-sm leading-8 text-muted-foreground sm:text-base">
            链接里的结果已经无法解码。重新开一局，做出你自己的 10 次选择，再生成新的分享页。
          </p>
          <Link
            href="/buffett/play"
            className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-accent px-8 text-base font-semibold text-[#1d1608] hover:-translate-y-0.5 hover:bg-[#e2ba72]"
          >
            去开始一局
          </Link>
        </section>
      </main>
    );
  }

  const summary = simulateGameSummary(data.choices, gameNodes);
  const score = calculateDNAScore(data.choices, gameNodes);
  const dnaType = getDNAType(score);
  const dnaInfo = dnaTypes.find((item) => item.name === dnaType);
  const matchRate = calculateBuffettMatchRate(data.choices, gameNodes);

  const cards = [
    { label: "DNA 类型", value: dnaType },
    { label: "与巴菲特匹配", value: formatPercent(matchRate) },
    { label: "最终资产", value: formatUsd(summary.playerAssets) },
    {
      label: "结局",
      value: data.isBankrupt ? `第 ${data.bankruptNode} 关破产` : "完整走完 10 关",
    },
  ];

  return (
    <main className="px-5 py-8 text-foreground sm:px-8">
      <section className="mx-auto flex min-h-[100svh] w-full max-w-5xl items-center">
        <div className="panel gold-frame w-full rounded-[2rem] p-6 sm:p-8">
          <div className="border-b border-white/8 pb-6">
            <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
              Shared Result
            </p>
            <h1 className="mt-4 font-serif text-4xl text-[#fff0cb] sm:text-5xl">
              有人刚刚重走了一遍巴菲特人生路
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-muted-foreground sm:text-base">
              这位玩家的最终人格类型是 <span className="text-accent">{dnaType}</span>。
              {dnaInfo?.description}
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <article
                key={card.label}
                className="rounded-[1.5rem] border border-white/8 bg-white/4 p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                  {card.label}
                </p>
                <p className="mt-4 font-serif text-2xl text-[#fff1cc]">{card.value}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-accent/25 bg-accent/10 p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
              路线摘要
            </p>
            <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
              这位玩家一共做了 {summary.roundsPlayed} 次选择，其中有{" "}
              <span className="text-[#fff0c7]">{summary.playerMatchCount}</span> 次和巴菲特一致。
              {data.isBankrupt
                ? " 但在途中提前出局，故事停在最不体面的地方。"
                : " 最终顺利打完整条路线，留下了一份完整的决策 DNA。"}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/buffett/play"
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-accent px-8 text-base font-semibold text-[#1d1608] hover:-translate-y-0.5 hover:bg-[#e2ba72]"
            >
              我也要来一局
            </Link>
            <Link
              href="/buffett"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-base font-semibold text-[#fff0cb] hover:border-accent/35 hover:bg-white/8"
            >
              回到入口页
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
