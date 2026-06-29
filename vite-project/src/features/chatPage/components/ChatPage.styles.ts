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
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  sidebarHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
  },
  profileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    minWidth: 0,
    fontWeight: 600,
    color: colors.text,
    textDecoration: 'none',
  },
  profileLinkText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    fontSize: '13px',
    color: colors.textMuted,
    cursor: 'pointer',
    flexShrink: 0,
  },
  newButton: {
    background: 'none',
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    padding: '6px 10px',
    fontSize: '13px',
    color: colors.primary,
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  sidebarScroll: {
    flex: 1,
    overflowY: 'auto' as const,
  },
  sidebarFooter: {
    padding: '12px 16px',
    borderTop: `1px solid ${colors.divider}`,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    borderBottom: `1px solid ${colors.divider}`,
    background: colors.surface,
  },
  headerName: {
    fontWeight: 600,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
};
