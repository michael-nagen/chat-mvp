import { ChatPage } from './features/chatPage';
import { AuthScreen, useAuth } from './features/auth';

/** Root component that gates the chat page behind authentication. */
function App(): React.JSX.Element {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <ChatPage />;
}

export default App;
