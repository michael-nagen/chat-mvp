import { useCallback, useReducer } from 'react';
import type { Message, MessageCitation } from '../../shared/entities/Message.types';
import type { MessageThreadContextValue } from './MessageThread.types';
import { messageThreadReducer, initialMessageThreadState } from './model/MessageThread.reducer';

/** Owns the thread's message array and exposes the only writes allowed against it. */
export function useMessageThreadController(): MessageThreadContextValue {
  const [messages, dispatch] = useReducer(messageThreadReducer, initialMessageThreadState);

  // dispatch is stable, so these actions keep a stable identity across renders —
  // consumers can safely list them as effect dependencies.
  const replaceMessages = useCallback(
    (next: Message[]) => dispatch({ type: 'REPLACE', messages: next }),
    [],
  );
  const addOptimisticMessage = useCallback(
    (message: Message) => dispatch({ type: 'ADD_OPTIMISTIC', message }),
    [],
  );
  const confirmMessage = useCallback(
    (tempId: string, message: Message) => dispatch({ type: 'CONFIRM', tempId, message }),
    [],
  );
  const rollbackMessage = useCallback(
    (tempId: string) => dispatch({ type: 'ROLLBACK', tempId }),
    [],
  );
  const setAssistantStatus = useCallback(
    (tempId: string, label: string) =>
      dispatch({ type: 'SET_ASSISTANT_STATUS', tempId, label }),
    [],
  );
  const appendAssistantDelta = useCallback(
    (tempId: string, delta: string) =>
      dispatch({ type: 'APPEND_ASSISTANT_DELTA', tempId, delta }),
    [],
  );
  const finishAssistant = useCallback(
    (tempId: string, messageId: string, citations: MessageCitation[]) =>
      dispatch({ type: 'FINISH_ASSISTANT', tempId, messageId, citations }),
    [],
  );

  return {
    messages,
    replaceMessages,
    addOptimisticMessage,
    confirmMessage,
    rollbackMessage,
    setAssistantStatus,
    appendAssistantDelta,
    finishAssistant,
  };
}
