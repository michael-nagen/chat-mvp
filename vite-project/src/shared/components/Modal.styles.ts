import type { CSSProperties } from 'react';
import { colors } from '../styles/colors';

export const modalStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.overlay,
    fontFamily: 'sans-serif',
    zIndex: 1000,
  } satisfies CSSProperties,
  card: {
    width: '360px',
    maxHeight: '80vh',
    background: colors.surface,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  } satisfies CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } satisfies CSSProperties,
  title: {
    margin: 0,
    fontSize: '18px',
  } satisfies CSSProperties,
  close: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    lineHeight: 1,
    color: colors.textMuted,
    cursor: 'pointer',
  } satisfies CSSProperties,
} as const;
