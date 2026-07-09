import type { SseEvent } from './sseClient.types';

export function normalizeNewlines(text: string): string {
  return text.replace(/\r\n/g, '\n');
}
export function splitFrames(buffer: string): { frames: string[]; rest: string } {
  const parts = buffer.split('\n\n');
  const rest = parts.pop() ?? '';
  return { frames: parts, rest };
}

export function parseSseFrame(frame: string): SseEvent | null {
  let event = 'message';
  const dataLines: string[] = [];

  for (const line of frame.split('\n')) {
    if (line === '' || line.startsWith(':')) {
      continue;
    }
    const colon = line.indexOf(':');
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? '' : line.slice(colon + 1);
    if (value.startsWith(' ')) {
      value = value.slice(1);
    }
    if (field === 'event') {
      event = value;
    } else if (field === 'data') {
      dataLines.push(value);
    }
  }

  return dataLines.length > 0 ? { event, data: dataLines.join('\n') } : null;
}
