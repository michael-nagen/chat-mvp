import type { CSSProperties } from 'react';
import { colors } from '../../../../shared/styles/colors';

export const contactRowStyles = {
  row: (isSelected: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 4px',
    cursor: 'pointer',
    background: isSelected ? colors.selectedSurface : 'transparent',
    borderRadius: '6px',
  }),
  name: {
    flex: 1,
    fontSize: '14px',
  } satisfies CSSProperties,
  check: {
    color: colors.primary,
    fontWeight: 700,
  } satisfies CSSProperties,
} as const;
