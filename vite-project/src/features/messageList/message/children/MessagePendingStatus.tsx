import { messageStyles } from '../Message.styles';
import { useMessage } from '../Message.context';

// Transient progress line under an in-progress AI reply. Renders nothing once
// tokens start arriving (the status is cleared) or when there is none.
export function MessagePendingStatus(): React.JSX.Element | null {
  const { message } = useMessage();
  if (!message.pendingStatus) {
    return null;
  }
  return <span style={messageStyles.pendingStatus}>{message.pendingStatus}</span>;
}
