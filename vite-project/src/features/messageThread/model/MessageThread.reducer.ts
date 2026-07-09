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
    case 'APPEND_ASSISTANT_DELTA':
      return state.map((m) =>
        m.id === action.tempId ? { ...m, content: m.content + action.delta } : m,
      );
    case 'FINISH_ASSISTANT':
      return state.map((m) =>
        m.id === action.tempId ? { ...m, id: action.messageId } : m,
      );
    default:
      return state;
  }
}
