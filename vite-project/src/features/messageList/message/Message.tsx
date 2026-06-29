import type { MessageProps } from './Message.types';
import { MessageContext } from './Message.context';
import { MessageView } from './MessageView';

function MessageProvider({
  message,
  children,
}: MessageProps & { children: React.ReactNode }): React.JSX.Element {
  return <MessageContext.Provider value={{ message }}>{children}</MessageContext.Provider>;
}

export function Message({ message }: MessageProps): React.JSX.Element {
  return (
    <MessageProvider message={message}>
      <MessageView />
    </MessageProvider>
  );
}
