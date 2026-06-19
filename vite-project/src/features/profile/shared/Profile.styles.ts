import type { CSSProperties } from 'react';
import { colors } from '../../../shared/styles/colors';

export const profileStyles = {
  root: {
    minHeight: '100vh',
    background: colors.background,
    color: colors.text,
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '32px 16px',
  },
  card: {
    width: '100%',
    maxWidth: '520px',
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
  },
  backLink: {
    fontSize: '14px',
    color: colors.primary,
    textDecoration: 'none',
  },
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
  avatarRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatarActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const,
  },
  secondaryButton: (enabled: boolean): CSSProperties => ({
    padding: '8px 12px',
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
    background: colors.surface,
    color: colors.text,
    cursor: enabled ? 'pointer' : 'default',
    fontSize: '13px',
  }),
  hiddenFileInput: {
    display: 'none',
  },
} as const;
