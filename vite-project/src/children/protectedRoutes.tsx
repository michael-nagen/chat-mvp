import type { RouteObject } from 'react-router-dom';
import { RequireAuth } from '../routing';
import { chatRoute } from './chatRoute';
import { profileRoute } from './profileRoute';

export const protectedRoutes: RouteObject = {
  element: <RequireAuth />,
  children: [chatRoute, profileRoute],
};
