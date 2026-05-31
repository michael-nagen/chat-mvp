import { useEffect, useRef } from "react";
import type { Message } from "../shared/contract/contract";

/** Scrolls the bottom anchor into view whenever the messages list changes. */
export function useAutoScroll(messages: Message[]) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  return bottomRef;
}
