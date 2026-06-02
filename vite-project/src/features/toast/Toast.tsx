import { useToast } from './Toast.context';
import { useAutoDismiss } from './Toast.use';
import { ToastView } from './Toast.view';

/** Self-contained toast — reads the global toast message and auto-dismisses after 3 s. */
export function Toast(): React.JSX.Element | null {
  const { message, dismissToast } = useToast();
  useAutoDismiss(message !== null, dismissToast);
  if (message === null) return null;

  return <ToastView message={message} onDismiss={dismissToast} />;
}
