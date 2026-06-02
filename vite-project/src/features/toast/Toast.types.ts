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

/** Props for the toast dismiss (×) button. */
export type ToastDismissButtonProps = {
  onDismiss: () => void;
};
