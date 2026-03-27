"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function IntroPhase() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,168,83,0.24),_transparent_34%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,_rgba(255,255,255,0.04),_transparent)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <section className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-accent/70">
          <span>Decision Cinema</span>
          <span>10 Nodes / 1 Fate</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8 py-12 sm:py-20"
        >
          <div className="panel gold-frame w-full rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-accent">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_16px_rgba(212,168,83,0.9)]" />
              巴菲特决策模拟游戏
            </div>

            <h1 className="max-w-3xl font-serif text-4xl leading-tight text-[#fff4d6] sm:text-6xl">
              重走巴菲特人生路
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              巴菲特靠10个选择赚了1000亿，你能活过第几关？
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/buffett/play"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-accent px-8 text-base font-semibold text-[#140f06] shadow-[0_16px_40px_rgba(212,168,83,0.24)] hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#e2ba72]"
              >
                开始游戏
              </Link>
              <p className="max-w-md text-sm leading-7 text-muted-foreground">
                你将连续做出 10 次关键决策，每一步都可能复制巴菲特的复利，也可能把你提前送出牌桌。
              </p>
            </div>
          </div>
        </motion.div>

        <footer className="flex flex-col gap-3 border-t border-white/8 pt-5 text-xs leading-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>历史情境基于公开资料与叙事化改编，用于游戏体验，不构成投资建议。</p>
          <p>市场不会给你读档机会，这个游戏会。</p>
        </footer>
      </section>
    </main>
  );
}
