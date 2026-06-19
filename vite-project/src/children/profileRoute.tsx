import type { RouteObject } from 'react-router-dom';
import { ProfilePage } from '../features/profile';

export const profileRoute: RouteObject = {
  path: '/profile',
  element: <ProfilePage />,
};
