import { useEffect, useRef, type RefObject } from 'react';
import type { Message } from '../../shared/entities/Message.types';

/** Scrolls the bottom anchor into view whenever the messages list changes. */
export function useAutoScroll(messages: Message[]): RefObject<HTMLDivElement | null> {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  return bottomRef;
}
