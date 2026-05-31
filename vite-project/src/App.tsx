import { ChatPage } from './chatPage';
import { AuthScreen, useAuth } from './auth';

/** Root component that gates the chat page behind authentication. */
function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <ChatPage />;
}

export default App;
