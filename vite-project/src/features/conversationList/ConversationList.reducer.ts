import type { ConversationListAction, ConversationListState } from './ConversationList.types';

export const initialConversationListState: ConversationListState = {
  conversations: [],
  isLoading: true,
  error: null,
};

export function conversationListReducer(
  state: ConversationListState,
  action: ConversationListAction,
): ConversationListState {
  switch (action.type) {
    case 'LOAD_START':
      return { conversations: state.conversations, isLoading: true, error: null };
    case 'LOAD_SUCCESS':
      return { conversations: action.conversations, isLoading: false, error: null };
    case 'LOAD_ERROR':
      return { conversations: [], isLoading: false, error: action.error };
    default:
      return state;
  }
}
