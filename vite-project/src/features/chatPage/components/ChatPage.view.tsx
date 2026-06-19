import { chatPageStyles } from './ChatPage.styles';
import { ChatSidebar } from './ChatSidebar';
import { ChatMainPanel } from './ChatMainPanel';

/** Top-level chat layout — composes the left and right panes with no prop drilling.
 *  The Toast banner is rendered globally in App. */
export function ChatPageView(): React.JSX.Element {
  return (
    <div style={chatPageStyles.root}>
      <ChatSidebar />
      <ChatMainPanel />
    </div>
  );
}
