import { colors } from '../../shared/styles/colors';

export const conversationListStyles = {
  column: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  skeletonRow: {
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  skeletonTitle: {
    height: '14px',
    width: '60%',
  },
  skeletonPreview: {
    height: '12px',
    width: '85%',
  },
  center: {
    padding: '16px',
    color: colors.textMuted,
  },
  error: {
    padding: '16px',
    color: colors.danger,
  },
};
