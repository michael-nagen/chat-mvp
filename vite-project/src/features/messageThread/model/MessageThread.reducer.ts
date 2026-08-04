import type { Message } from '../../../shared/entities/Message.types';
import type { MessageThreadAction } from '../MessageThread.types';

export const initialMessageThreadState: Message[] = [];

export function messageThreadReducer(
  state: Message[],
  action: MessageThreadAction,
): Message[] {
  switch (action.type) {
    case 'REPLACE':
      return action.messages;
    case 'ADD_OPTIMISTIC':
      return [...state, action.message];
    case 'CONFIRM':
      return state.map((m) => (m.id === action.tempId ? action.message : m));
    case 'ROLLBACK':
      return state.filter((m) => m.id !== action.tempId);
    case 'SET_ASSISTANT_STATUS':
      return state.map((m) =>
        m.id === action.tempId ? { ...m, pendingStatus: action.label } : m,
      );
    case 'APPEND_ASSISTANT_DELTA':
      // The first token means work is done: drop the progress status.
      return state.map((m) =>
        m.id === action.tempId
          ? { ...m, content: m.content + action.delta, pendingStatus: undefined }
          : m,
      );
    case 'FINISH_ASSISTANT':
      return state.map((m) =>
        m.id === action.tempId
          ? {
              ...m,
              id: action.messageId,
              pendingStatus: undefined,
              metadata:
                action.citations.length > 0
                  ? { ...m.metadata, citations: action.citations }
                  : m.metadata,
            }
          : m,
      );
    default:
      return state;
  }
}
