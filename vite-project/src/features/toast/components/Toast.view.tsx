import type { ToastViewProps } from '../Toast.types';
import { toastStyles } from './Toast.styles';
import { ToastDismissButton } from './ToastDismissButton';

/** Renders a fixed-position error banner at the bottom of the screen with a dismiss button. */
export function ToastView({ message, onDismiss }: ToastViewProps): React.JSX.Element {
  return (
    <div role="alert" style={toastStyles.root}>
      <span>{message}</span>
      <ToastDismissButton onDismiss={onDismiss} />
    </div>
  );
}
