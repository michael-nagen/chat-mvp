import { chatPageStyles } from './ChatPage.styles';
import type { ChatPageViewProps } from '../ChatPage.types';
import { ChatSidebar } from './ChatSidebar';
import { ChatMainPanel } from './ChatMainPanel';
import { Toast } from '../../toast';

/** Top-level chat layout — composes the left and right panes with no prop drilling. */
export function ChatPageView({ userName }: ChatPageViewProps): React.JSX.Element {
  return (
    <div style={chatPageStyles.root}>
      <ChatSidebar userName={userName} />
      <ChatMainPanel />
      <Toast />
    </div>
  );
}
