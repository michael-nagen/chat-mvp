import type { CSSProperties } from 'react';
import { colors } from '../../../shared/styles/colors';

export const profileStyles = {
  section: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
    paddingTop: '16px',
    borderTop: `1px solid ${colors.divider}`,
  },
  sectionTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 700,
    color: colors.textMuted,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
    outline: 'none',
    fontSize: '14px',
  },
  error: {
    color: colors.danger,
    fontSize: '13px',
  },
  button: (enabled: boolean): CSSProperties => ({
    padding: '10px 14px',
    borderRadius: '6px',
    border: 'none',
    alignSelf: 'flex-start',
    backgroundColor: enabled ? colors.primary : colors.disabled,
    color: colors.surface,
    cursor: enabled ? 'pointer' : 'default',
  }),
  secondaryButton: (enabled: boolean): CSSProperties => ({
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
    background: colors.surface,
    color: colors.text,
    cursor: enabled ? 'pointer' : 'default',
    fontSize: '13px',
  }),
} as const;
