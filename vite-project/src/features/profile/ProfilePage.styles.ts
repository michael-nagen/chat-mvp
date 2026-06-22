import { colors } from '../../shared/styles/colors';

export const profilePageStyles = {
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
} as const;
