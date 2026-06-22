import type { CSSProperties } from 'react';
import { colors } from '../styles/colors';

export const textFieldStyles = {
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: `1px solid ${colors.border}`,
    outline: 'none',
  } satisfies CSSProperties,
} as const;
