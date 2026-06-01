import { toastStyles } from './Toast.styles';

type ToastViewProps = { message: string; onDismiss: () => void };

/** Renders a fixed-position error banner at the bottom of the screen with a dismiss button. */
export function ToastView({ message, onDismiss }: ToastViewProps): React.JSX.Element {
  return (
    <div
      role="alert"
      style={toastStyles.root}
    >
      <span>{message}</span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={toastStyles.dismissButton}
      >
        ×
      </button>
    </div>
  );
}
