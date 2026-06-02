import { colors } from '../../../../shared/styles/colors';
import { SELECTED_BORDER_WIDTH } from './ConversationRow.constants';

export const conversationRowStyles = {
  row: (isSelected: boolean): React.CSSProperties => ({
    padding: '12px 16px',
    cursor: 'pointer',
    background: isSelected ? colors.selectedSurface : 'transparent',
    borderLeft: isSelected
      ? `${SELECTED_BORDER_WIDTH} solid ${colors.primary}`
      : `${SELECTED_BORDER_WIDTH} solid transparent`,
  }),
  title: {
    fontWeight: 500,
  },
  preview: {
    fontSize: '13px',
    color: colors.textMuted,
    marginTop: '2px',
  },
};
