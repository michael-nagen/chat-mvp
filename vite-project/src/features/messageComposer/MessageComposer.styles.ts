import type { CSSProperties } from 'react';
import { colors } from '../../shared/styles/colors';

export const messageComposerStyles = {
  form: {
    display: 'flex',
    gap: '8px',
    padding: '8px',
    borderTop: `1px solid ${colors.divider}`,
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    padding: '8px 10px',
    borderRadius: '4px',
    border: `1px solid ${colors.border}`,
    resize: 'none' as const,
    fontFamily: 'inherit',
    fontSize: 'inherit',
  },
  button: (sendable: boolean): CSSProperties => ({
    padding: '8px 14px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: sendable ? colors.primary : colors.disabled,
    color: colors.surface,
    cursor: sendable ? 'pointer' : 'default',
  }),
};
