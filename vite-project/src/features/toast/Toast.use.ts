import { useEffect } from 'react';
import { AUTO_DISMISS_MS } from './Toast.constants';

/** Calls onDismiss after AUTO_DISMISS_MS while `active` is true. */
export function useAutoDismiss({
  active,
  onDismiss,
  durationMs = AUTO_DISMISS_MS,
}: {
  active: boolean;
  onDismiss: () => void;
  durationMs?: number;
}): void {
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [active, onDismiss, durationMs]);
}
