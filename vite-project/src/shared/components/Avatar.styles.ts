import type { CSSProperties } from 'react';

export const avatarStyles = {
  image: (size: number): CSSProperties => ({
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    objectFit: 'cover',
  }),
} as const;
