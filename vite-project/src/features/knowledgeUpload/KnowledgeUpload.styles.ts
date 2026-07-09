import type { CSSProperties } from 'react';
import { colors } from '../../shared/styles/colors';

export const knowledgeUploadStyles = {
  button: (uploading: boolean): CSSProperties => ({
    padding: '8px 12px',
    borderRadius: '4px',
    border: `1px solid ${colors.border}`,
    background: colors.surface,
    color: colors.text,
    cursor: uploading ? 'default' : 'pointer',
    whiteSpace: 'nowrap',
  }),
  hiddenInput: { display: 'none' } as CSSProperties,
};
