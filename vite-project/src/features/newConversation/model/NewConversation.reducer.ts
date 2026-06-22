import type {
  NewConversationAction,
  NewConversationState,
} from '../NewConversation.types';

export const initialNewConversationState: NewConversationState = {
  isOpen: false,
  mode: 'dm',
  selectedContactIds: [],
  step: 'selectParticipants',
  groupTitle: '',
  isCreating: false,
};

export function newConversationReducer(
  state: NewConversationState,
  action: NewConversationAction,
): NewConversationState {
  switch (action.type) {
    case 'OPEN':
      return { ...initialNewConversationState, isOpen: true };
    case 'CANCEL':
      return initialNewConversationState;
    case 'SET_MODE':
      // Selection is kept across a mode switch; steps live on step 1 only.
      return { ...state, mode: action.mode, step: 'selectParticipants' };
    case 'TOGGLE_CONTACT': {
      const isSelected = state.selectedContactIds.includes(action.contactId);
      return {
        ...state,
        selectedContactIds: isSelected
          ? state.selectedContactIds.filter((id) => id !== action.contactId)
          : [...state.selectedContactIds, action.contactId],
      };
    }
    case 'CONTINUE_TO_TITLE':
      return { ...state, step: 'groupTitle' };
    case 'BACK':
      return { ...state, step: 'selectParticipants' };
    case 'SET_GROUP_TITLE':
      return { ...state, groupTitle: action.title };
    case 'CREATE_START':
      return { ...state, isCreating: true };
    case 'CREATE_END':
      return { ...state, isCreating: false };
    default:
      return state;
  }
}
