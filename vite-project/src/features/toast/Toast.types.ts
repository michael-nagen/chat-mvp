export type ToastContextValue = {
  message: string | null;
  showToast: (message: string) => void;
  dismissToast: () => void;
};

/** Props for the pure toast banner view. */
export type ToastViewProps = {
  message: string;
  onDismiss: () => void;
};
