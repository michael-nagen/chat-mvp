export const avatarStyles = {
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
  hiddenFileInput: {
    display: 'none',
  },
} as const;
