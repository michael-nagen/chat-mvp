import { colors } from '../../../shared/styles/colors';

export const messageListStyles = {
  list: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
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
