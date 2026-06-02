import type { MessageListAction, MessageListState } from '../MessageList.types';

export const initialMessageListState: MessageListState = {
  isLoading: false,
  error: null,
};

export function messageListReducer(
  state: MessageListState,
  action: MessageListAction,
): MessageListState {
  switch (action.type) {
    case 'LOAD_START':
      return { isLoading: true, error: null };
    case 'LOAD_SUCCESS':
      return { isLoading: false, error: null };
    case 'LOAD_ERROR':
      return { isLoading: false, error: action.error };
    case 'NO_SELECTION':
      return initialMessageListState;
    default:
      return state;
  }
}
