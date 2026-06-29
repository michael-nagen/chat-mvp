import type { CSSProperties } from 'react';
import { colors } from '../../shared/styles/colors';

export const newConversationStyles = {
  segmentGroup: {
    display: 'flex',
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    overflow: 'hidden',
  } satisfies CSSProperties,
  segment: (active: boolean): CSSProperties => ({
    flex: 1,
    padding: '8px 0',
    border: 'none',
    background: active ? colors.primary : colors.surface,
    color: active ? colors.surface : colors.text,
    cursor: 'pointer',
    fontSize: '14px',
  }),
  list: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '320px',
    overflowY: 'auto',
  } satisfies CSSProperties,
  notice: {
    fontSize: '13px',
    color: colors.textMuted,
    padding: '12px 0',
  } satisfies CSSProperties,
  error: {
    fontSize: '13px',
    color: colors.danger,
    padding: '12px 0',
  } satisfies CSSProperties,
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
  } satisfies CSSProperties,
  primaryButton: (enabled: boolean): CSSProperties => ({
    padding: '10px 14px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: enabled ? colors.primary : colors.disabled,
    color: colors.surface,
    cursor: enabled ? 'pointer' : 'default',
  }),
  secondaryButton: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
    background: colors.surface,
    color: colors.text,
    cursor: 'pointer',
  } satisfies CSSProperties,
  selectedRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  } satisfies CSSProperties,
  selectedChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
  } satisfies CSSProperties,
} as const;
