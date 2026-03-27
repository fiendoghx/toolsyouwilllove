let currentAudio: HTMLAudioElement | null = null;

export function playNarration(nodeId: number): HTMLAudioElement | null {
  stopNarration();
  try {
    const audio = new Audio(`/audio/node-${nodeId}.mp3`);
    currentAudio = audio;
    audio.play().catch(() => {});
    return audio;
  } catch {
    return null;
  }
}

export function stopNarration() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export function pauseNarration() {
  currentAudio?.pause();
}

export function resumeNarration() {
  currentAudio?.play().catch(() => {});
}

export function getCurrentAudio(): HTMLAudioElement | null {
  return currentAudio;
}
