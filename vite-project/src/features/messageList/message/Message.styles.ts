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
  // The row stretches full width; flexDirection alone anchors the cluster —
  // row-reverse pins it right (own messages), row pins it left (others). No
  // justifyContent: under row-reverse it would invert and push both to the left.
  row: (isUser: boolean): React.CSSProperties => ({
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
    flexDirection: isUser ? 'row-reverse' : 'row',
  }),
  // Stack of (optional) sender name, the bubble, and the timestamp; aligned to
  // the same side as the row so name/time line up under the bubble.
  column: (isUser: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    maxWidth: BUBBLE_MAX_WIDTH,
    alignItems: isUser ? 'flex-end' : 'flex-start',
  }),
  senderName: {
    fontSize: '10px',
    fontWeight: 600,
    color: colors.textMuted,
    padding: '0 4px',
  } as React.CSSProperties,
  time: {
    fontSize: '11px',
    color: colors.textMuted,
    padding: '0 4px',
  } as React.CSSProperties,
  bubble: (isUser: boolean): React.CSSProperties => ({
    maxWidth: '100%',
    padding: '8px 12px',
    borderRadius: '12px',
    wordBreak: 'break-word',
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
  // "Sources" block shown under a tutor answer that carries citations.
  citations: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    marginTop: '4px',
    padding: '0 4px',
  } as React.CSSProperties,
  citationsTitle: {
    fontSize: '10px',
    fontWeight: 600,
    color: colors.textMuted,
  } as React.CSSProperties,
  citationItem: {
    fontSize: '11px',
    color: colors.textMuted,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  } as React.CSSProperties,
  citationShowSource: {
    alignSelf: 'flex-start',
    padding: 0,
    border: 'none',
    background: 'transparent',
    color: colors.primary,
    cursor: 'pointer',
    fontSize: '11px',
  } as React.CSSProperties,
  citationSourceText: {
    fontSize: '11px',
    color: colors.text,
    background: colors.assistantBubble,
    borderRadius: '4px',
    padding: '4px 6px',
    whiteSpace: 'pre-wrap' as const,
  } as React.CSSProperties,
  uploadCard: {
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '8px 12px',
    background: colors.surface,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  } as React.CSSProperties,
  uploadCardTitle: {
    fontSize: '11px',
    fontWeight: 600,
    color: colors.textMuted,
  } as React.CSSProperties,
  uploadCardName: {
    fontSize: '14px',
    color: colors.text,
  } as React.CSSProperties,
  uploadCardHint: {
    fontSize: '11px',
    color: colors.textMuted,
  } as React.CSSProperties,
};
