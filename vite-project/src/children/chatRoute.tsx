import type { RouteObject } from 'react-router-dom';
import { ChatPage } from '../features/chatPage';

export const chatRoute: RouteObject = {
  path: '/chat',
  element: <ChatPage />,
};
