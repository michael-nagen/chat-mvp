import { apiUrl, getAuthToken, extractErrorMessage } from './apiClient';
import type { SseEvent, StreamEventsOptions } from './sseClient.types';
import { normalizeNewlines, parseSseFrame, splitFrames } from './sseClient.utils';

export type { SseEvent } from './sseClient.types';

export async function streamEvents(
  path: string,
  { onEvent, signal }: StreamEventsOptions,
): Promise<void> {
  const headers: Record<string, string> = { Accept: 'text/event-stream' };
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(apiUrl(path), { method: 'GET', headers, signal });
  if (!res.ok || !res.body) {
    const payload = await res.json().catch(() => null);
    throw new Error(extractErrorMessage(payload, `Stream failed (${res.status})`));
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const emit = (frame: string): void => {
    const event: SseEvent | null = parseSseFrame(frame);
    if (event) onEvent(event);
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer = normalizeNewlines(buffer + decoder.decode(value, { stream: true }));
    const { frames, rest } = splitFrames(buffer);
    for (const frame of frames) emit(frame);
    buffer = rest;
  }

  buffer = normalizeNewlines(buffer + decoder.decode());
  if (buffer.length > 0) emit(buffer);
}
