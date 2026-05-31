import { useEffect } from "react";

// Calls onDismiss after `durationMs` while `active` is true.
export function useAutoDismiss(
  active: boolean,
  onDismiss: () => void,
  durationMs: number = 3000,
): void {
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [active, onDismiss, durationMs]);
}
