import { colors } from '../../../shared/styles/colors';
import { BUBBLE_MAX_WIDTH } from './Message.constants';

export const messageStyles = {
  skeletonList: {
    flex: 1,
    padding: '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  bubble: (isUser: boolean): React.CSSProperties => ({
    maxWidth: BUBBLE_MAX_WIDTH,
    padding: '8px 12px',
    borderRadius: '12px',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    background: isUser ? colors.primary : colors.assistantBubble,
    color: isUser ? colors.surface : colors.text,
  }),
  skeletonBubble: (index: number, width: string): React.CSSProperties => ({
    maxWidth: BUBBLE_MAX_WIDTH,
    padding: '8px 12px',
    borderRadius: '12px',
    alignSelf: index % 2 === 1 ? 'flex-end' : 'flex-start',
    width,
    height: '32px',
  }),
};
