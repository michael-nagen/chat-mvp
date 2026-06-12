import { colors } from '../../../shared/styles/colors';
import { SIDEBAR_WIDTH } from './ChatPage.constants';

export const chatPageStyles = {
  root: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'sans-serif',
    background: colors.background,
    color: colors.text,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    borderRight: `1px solid ${colors.divider}`,
    background: colors.sidebarSurface,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  sidebarHeader: {
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.divider}`,
    fontWeight: 600,
  },
  sidebarScroll: {
    flex: 1,
    overflowY: 'auto' as const,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
};
