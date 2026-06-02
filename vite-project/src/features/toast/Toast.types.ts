export type ToastContextValue = {
  message: string | null;
  showToast: (message: string) => void;
  dismissToast: () => void;
};
