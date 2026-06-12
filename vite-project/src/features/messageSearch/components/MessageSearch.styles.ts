import { colors } from '../../../shared/styles/colors';

export const messageSearchStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    flex: 1,
    minHeight: 0,
  },
  inputBar: {
    padding: '8px 12px',
    borderBottom: `1px solid ${colors.divider}`,
  },
  input: {
    width: '100%',
    padding: '7px 10px',
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
    outline: 'none',
    fontSize: '13px',
  },
  scroll: {
    flex: 1,
    overflowY: 'auto' as const,
    minHeight: 0,
  },
  visible: {
    display: 'block',
  },
  hidden: {
    display: 'none',
  },
  column: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  center: {
    padding: '16px',
    color: colors.textMuted,
  },
  error: {
    padding: '16px',
    color: colors.danger,
  },
  recentRow: {
    width: '100%',
    textAlign: 'left' as const,
    background: 'none',
    border: 'none',
    padding: '10px 16px',
    fontSize: '13px',
    color: colors.text,
    cursor: 'pointer',
  },
  resultRow: {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: `1px solid ${colors.divider}`,
  },
  resultTitle: {
    fontWeight: 500,
    fontSize: '13px',
    color: colors.textMuted,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  resultBody: {
    display: 'flex',
    flexDirection: 'column' as const,
    marginTop: '6px',
  },
  skeletonRow: {
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  skeletonTitle: {
    height: '14px',
    width: '55%',
  },
  skeletonSnippet: {
    height: '12px',
    width: '80%',
  },
};
