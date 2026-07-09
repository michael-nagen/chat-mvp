export type SseEvent = { event: string; data: string };

export type StreamEventsOptions = {
  onEvent: (event: SseEvent) => void;
  signal?: AbortSignal;
};
