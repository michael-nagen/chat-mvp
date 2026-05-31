import { ChatPage } from './chatPage';
import { AuthScreen, useAuth } from './auth';

/** Root component that gates the chat page behind authentication. */
function App() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <AuthScreen />;
  }

  return <ChatPage currentUser={user} />;
}

export default App;
