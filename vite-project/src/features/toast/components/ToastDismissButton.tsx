import type { ToastDismissButtonProps } from '../Toast.types';
import { toastStyles } from './Toast.styles';

/** Dismiss (×) button for the toast banner. */
export function ToastDismissButton({ onDismiss }: ToastDismissButtonProps): React.JSX.Element {
  return (
    <button onClick={onDismiss} aria-label="Dismiss" style={toastStyles.dismissButton}>
      ×
    </button>
  );
}
