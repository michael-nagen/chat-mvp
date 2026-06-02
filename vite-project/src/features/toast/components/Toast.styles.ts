import { colors } from '../../../shared/styles/colors';
import { TOAST_Z_INDEX } from '../Toast.constants';

export const toastStyles = {
  root: {
    position: 'fixed' as const,
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: colors.toastError,
    color: colors.surface,
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    zIndex: TOAST_Z_INDEX,
  },
  dismissButton: {
    background: 'transparent',
    border: 'none',
    color: colors.surface,
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: 1,
  },
};
