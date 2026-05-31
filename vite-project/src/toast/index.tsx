import type { ToastProps } from "./Toast.types";
import { ToastView } from "./Toast.view";
import { useAutoDismiss } from "./Toast.use";

export type { ToastProps } from "./Toast.types";

/** Renders a toast notification that auto-dismisses after a timeout; renders nothing when message is null. */
export function Toast({ message, onDismiss }: ToastProps) {
  useAutoDismiss(message !== null, onDismiss);

  if (message === null) return null;
  return <ToastView message={message} onDismiss={onDismiss} />;
}
