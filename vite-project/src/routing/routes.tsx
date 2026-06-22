import type { RouteObject } from 'react-router-dom';
import { ChatPage } from '../features/chatPage';
import { ProfilePage } from '../features/profile';
import { LoginGate } from './LoginGate';
import { RequireAuth } from './RequireAuth';
import { RootRedirect } from './RootRedirect';

export const routes: RouteObject[] = [
  { path: '/login', element: <LoginGate /> },
  {
    element: <RequireAuth />,
    children: [
      { path: '/chat', element: <ChatPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
  { path: '*', element: <RootRedirect /> },
];
