export type StreamCallback = (text: string, done: boolean) => void;

export function simulateAIStream(
  fullText: string,
  onUpdate: StreamCallback,
  speed: number = 50
): { cancel: () => void } {
  let currentIndex = 0;
  let cancelled = false;
  let timer: NodeJS.Timeout;

  function tick() {
    if (cancelled || currentIndex >= fullText.length) {
      if (!cancelled) onUpdate(fullText, true);
      return;
    }
    const chunkSize = Math.random() > 0.8 ? 2 : 1;
    currentIndex = Math.min(currentIndex + chunkSize, fullText.length);
    onUpdate(fullText.slice(0, currentIndex), false);
    const delay = speed + Math.random() * speed * 0.6;
    timer = setTimeout(tick, delay);
  }

  timer = setTimeout(tick, 300);

  return {
    cancel: () => {
      cancelled = true;
      clearTimeout(timer);
    },
  };
}
