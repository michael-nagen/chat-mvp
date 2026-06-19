import type { RouteObject } from 'react-router-dom';
import { LoginRoute } from '../routing';

export const loginRoute: RouteObject = {
  path: '/login',
  element: <LoginRoute />,
};
