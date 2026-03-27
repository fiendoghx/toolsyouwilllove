"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { GameChoice, GameNode } from "@/types/game";
import { formatUsd } from "@/lib/formatters";
import { COMPANION_LABEL } from "@/lib/game-summary";
import { playNarration, stopNarration, pauseNarration, resumeNarration } from "@/lib/audio";

interface PlayingPhaseProps {
  node: GameNode;
  nodeIndex: number;
  playerName: string;
  playerAssets: number;
  onChoice: (choice: GameChoice) => void;
}

export default function PlayingPhase({
  node,
  nodeIndex,
  playerName,
  playerAssets,
  onChoice,
}: PlayingPhaseProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, [node.id]);

  const handleToggleAudio = useCallback(() => {
    if (isPlaying) {
      pauseNarration();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        resumeNarration();
      } else {
        const audio = playNarration(node.id);
        if (audio) {
          audioRef.current = audio;
          audio.addEventListener("ended", () => {
            setIsPlaying(false);
            audioRef.current = null;
          });
        }
      }
      setIsPlaying(true);
    }
  }, [isPlaying, node.id]);

  // Reset audio ref when node changes
  useEffect(() => {
    audioRef.current = null;
    setIsPlaying(false);
  }, [node.id]);

  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 py-6 text-foreground sm:px-8 sm:py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,168,83,0.16),_transparent_32%)]" />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.35em] text-muted-foreground/50">
          <Link href="/buffett" className="hover:text-accent">← 首页</Link>
          <span>Decision Cinema</span>
        </div>
        <header className="panel gold-frame rounded-[2rem] px-5 py-5 sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
                Node {nodeIndex + 1} / 10
              </p>
              <h1 className="mt-3 font-serif text-3xl text-[#fff0ca] sm:text-4xl">
                {node.era}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {playerName}，你正站在 {node.year} 年的岔路口。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-[320px]">
              <div className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                  当前资产
                </p>
                <p className="mt-2 text-lg font-semibold text-accent">
                  {formatUsd(playerAssets)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/25 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                  揭晓嘉宾
                </p>
                <p className="mt-2 text-lg font-semibold text-[#fff2d0]">
                  {COMPANION_LABEL}
                </p>
              </div>
            </div>
          </div>
        </header>

        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <article className="panel gold-frame rounded-[2rem] px-6 py-7 sm:px-8 sm:py-9">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
                Background
              </p>
              <button
                type="button"
                onClick={handleToggleAudio}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3.5 py-1.5 text-xs text-muted-foreground hover:border-accent/40 hover:text-accent"
              >
                {isPlaying ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                    暂停朗读
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    朗读背景
                  </>
                )}
              </button>
            </div>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-[#fff2d4] sm:text-4xl">
              {node.dilemma}
            </h2>
            <p className="mt-6 text-sm leading-8 text-muted-foreground sm:text-base">
              {node.backgroundDescription}
            </p>
          </article>

          <div className="grid gap-4">
            {([
              {
                choice: "A",
                label: node.optionA.label,
                description: node.optionA.description,
              },
              {
                choice: "B",
                label: node.optionB.label,
                description: node.optionB.description,
              },
            ] as const).map((option) => (
              <motion.button
                key={option.choice}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  stopNarration();
                  setIsPlaying(false);
                  audioRef.current = null;
                  onChoice(option.choice);
                }}
                className="panel gold-frame flex min-h-56 flex-col rounded-[2rem] p-6 text-left hover:border-accent/40 sm:p-7"
              >
                <span className="text-[11px] uppercase tracking-[0.35em] text-accent/70">
                  选项 {option.choice}
                </span>
                <h3 className="mt-4 font-serif text-2xl text-[#fff0cb]">
                  {option.label}
                </h3>
                <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
                  {option.description}
                </p>
                <span className="mt-auto pt-6 text-sm font-medium text-accent">
                  我选这条路
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
