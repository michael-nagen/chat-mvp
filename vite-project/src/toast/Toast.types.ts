/** Props for the Toast container, where a null message means no toast is shown. */
export type ToastProps = {
  message: string | null;
  onDismiss: () => void;
};

/** Props for the pure toast view, requiring a non-null message string. */
export type ToastViewProps = {
  message: string;
  onDismiss: () => void;
};
