import type { RouteObject } from 'react-router-dom';
import { RootRedirect } from '../routing';

export const fallbackRoute: RouteObject = {
  path: '*',
  element: <RootRedirect />,
};
