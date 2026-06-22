import { useReducer } from 'react';
import { useChatSelection } from '../chatPage/ChatSelection.context';
import { useToast } from '../toast';
import {
  initialNewConversationState,
  newConversationReducer,
} from './model/NewConversation.reducer';
import { createDm, createGroup } from './model/NewConversation.api';
import {
  DM_MAX_CONTACTS,
  DM_MIN_CONTACTS,
  GROUP_MAX_CONTACTS,
} from './model/NewConversation.constants';
import type {
  ConversationMode,
  NewConversationContextValue,
} from './NewConversation.types';

/** Owns the New Conversation modal state and the create flow for DM and group. */
export function useNewConversationController(): NewConversationContextValue {
  const { selectConversation, refreshConversations } = useChatSelection();
  const { showToast } = useToast();
  const [state, dispatch] = useReducer(
    newConversationReducer,
    initialNewConversationState,
  );

  const count = state.selectedContactIds.length;
  const canContinue = count <= GROUP_MAX_CONTACTS;
  const canCreate =
    state.mode === 'dm'
      ? count >= DM_MIN_CONTACTS && count <= DM_MAX_CONTACTS
      : state.groupTitle.trim().length > 0;

  async function submit(): Promise<void> {
    if (state.isCreating) return;
    dispatch({ type: 'CREATE_START' });
    try {
      const conversation =
        state.mode === 'dm'
          ? await createDm(state.selectedContactIds)
          : await createGroup({
              participantIds: state.selectedContactIds,
              title: state.groupTitle.trim(),
            });
      refreshConversations();
      selectConversation(conversation.id, conversation);
      dispatch({ type: 'CANCEL' });
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to create conversation',
      );
    } finally {
      dispatch({ type: 'CREATE_END' });
    }
  }

  return {
    ...state,
    canContinue,
    canCreate,
    open: () => dispatch({ type: 'OPEN' }),
    cancel: () => dispatch({ type: 'CANCEL' }),
    setMode: (mode: ConversationMode) => dispatch({ type: 'SET_MODE', mode }),
    toggleContact: (contactId: string) =>
      dispatch({ type: 'TOGGLE_CONTACT', contactId }),
    continueToTitle: () => dispatch({ type: 'CONTINUE_TO_TITLE' }),
    back: () => dispatch({ type: 'BACK' }),
    setGroupTitle: (title: string) =>
      dispatch({ type: 'SET_GROUP_TITLE', title }),
    submit,
  };
}
