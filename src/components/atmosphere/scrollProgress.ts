export const scrollProgress = { current: 0 };
export const moonPosition = { x: 8, y: 6, opacity: 0.9 };
export const sunPosition = { x: 5, y: 60, opacity: 0 };

type ScrollCallback = (progress: number) => void;
const subscribers = new Set<ScrollCallback>();

export function subscribeToScroll(cb: ScrollCallback): () => void {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

export function notifySubscribers(progress: number) {
  scrollProgress.current = progress;
  for (const cb of subscribers) cb(progress);
}
