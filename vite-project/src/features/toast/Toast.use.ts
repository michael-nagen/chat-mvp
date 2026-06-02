import { useEffect } from 'react';
import { AUTO_DISMISS_MS } from './Toast.constants';

/** Calls onDismiss after AUTO_DISMISS_MS while `active` is true. */
export function useAutoDismiss(
  active: boolean,
  onDismiss: () => void,
  durationMs: number = AUTO_DISMISS_MS,
): void {
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(timer);
  }, [active, onDismiss, durationMs]);
}
