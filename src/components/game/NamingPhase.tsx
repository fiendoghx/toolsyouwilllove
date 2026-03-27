"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { funnyNames } from "@/data/names";
import type { PlayerGender } from "@/types/game";
import { COMPANION_LABEL, COMPANION_TITLE } from "@/lib/game-summary";

interface NamingPhaseProps {
  onComplete: (name: string, gender: PlayerGender) => void;
}

export default function NamingPhase({ onComplete }: NamingPhaseProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<PlayerGender>("male");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onComplete(name.trim() || "奥马哈见习生", gender);
  };

  const handleRandomName = () => {
    const randomIndex = Math.floor(Math.random() * funnyNames.length);
    setName(funnyNames[randomIndex]);
  };

  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 py-8 text-foreground sm:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,168,83,0.18),_transparent_38%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto flex min-h-[100svh] w-full max-w-3xl items-center"
      >
        <div className="panel gold-frame w-full rounded-[2rem] p-6 sm:p-10">
          <div className="mb-6 flex flex-col gap-3 border-b border-white/8 pb-6">
            <span className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
              Naming Phase
            </span>
            <h2 className="font-serif text-3xl text-[#fff2d0] sm:text-4xl">
              先给自己一个名字，再上牌桌
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              确定你的身份，然后让
              <span className="text-accent"> {COMPANION_LABEL}</span> 在揭晓环节和你对答案。
            </p>
          </div>

          <div className="mb-8 grid gap-4 rounded-3xl border border-accent/20 bg-white/3 p-4 sm:grid-cols-[1.2fr_0.8fr] sm:p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-accent/70">
                陪跑教练
              </p>
              <p className="mt-3 font-serif text-2xl text-[#fff0c6]">{COMPANION_LABEL}</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{COMPANION_TITLE}</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/25 p-4 text-sm leading-7 text-muted-foreground">
              他不会替你做决定，只会在你出手之后，把自己的路和巴菲特的路同时亮出来。
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label htmlFor="player-name" className="text-sm font-medium text-[#f7e9c8]">
                你的名字
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="player-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="比如：还没财务自由的小王"
                  className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-black/35 px-4 text-base text-[#fff5da] outline-none placeholder:text-[#8f8366] focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
                />
                <button
                  type="button"
                  onClick={handleRandomName}
                  className="min-h-14 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-[#f6e7c2] hover:border-accent/40 hover:bg-accent/10"
                >
                  随机来一个
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-[#f7e9c8]">你的性别</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "male" as const, label: "他", desc: "沉着下注" },
                  { value: "female" as const, label: "她", desc: "锋利判断" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGender(option.value)}
                    className={`rounded-3xl border px-4 py-5 text-left ${
                      gender === option.value
                        ? "border-accent/60 bg-accent/12 text-[#fff1cd]"
                        : "border-white/10 bg-white/4 text-muted-foreground hover:border-white/20"
                    }`}
                  >
                    <p className="font-serif text-2xl">{option.label}</p>
                    <p className="mt-2 text-sm">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex min-h-14 w-full items-center justify-center rounded-full border border-white/20 bg-accent px-6 text-base font-semibold text-[#1d1608] shadow-[0_18px_46px_rgba(212,168,83,0.22)] hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#e2ba72]"
            >
              进入第一关
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
