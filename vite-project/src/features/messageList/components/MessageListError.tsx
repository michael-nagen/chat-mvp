import type { MessageListErrorProps } from '../MessageList.types';
import { messageListStyles } from './MessageList.styles';

/** Inline error message shown when the thread fails to load. */
export function MessageListError({ error }: MessageListErrorProps): React.JSX.Element {
  return <div style={messageListStyles.error}>{error}</div>;
}
