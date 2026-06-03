import { chatPageStyles } from './ChatPage.styles';
import { ChatSidebar } from './ChatSidebar';
import { ChatMainPanel } from './ChatMainPanel';
import { Toast } from '../../toast';

/** Top-level chat layout — composes the left and right panes with no prop drilling. */
export function ChatPageView(): React.JSX.Element {
  return (
    <div style={chatPageStyles.root}>
      <ChatSidebar />
      <ChatMainPanel />
      <Toast />
    </div>
  );
}
