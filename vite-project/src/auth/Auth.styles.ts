import type { CSSProperties } from 'react';
import { colors } from '../shared/styles/colors';

export const authStyles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.overlay,
    fontFamily: 'sans-serif',
  },
  card: {
    width: '320px',
    background: colors.surface,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
  },
  hint: {
    margin: 0,
    fontSize: '13px',
    color: colors.textMuted,
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
    outline: 'none',
  },
  error: {
    color: colors.danger,
    fontSize: '13px',
  },
  button: (submittable: boolean): CSSProperties => ({
    padding: '10px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: submittable ? colors.primary : colors.disabled,
    color: colors.surface,
    cursor: submittable ? 'pointer' : 'default',
  }),
};
