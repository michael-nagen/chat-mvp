import { describe, expect, it } from 'vitest';
import {
  initialNewConversationState,
  newConversationReducer,
} from '../model/NewConversation.reducer';
import type { NewConversationState } from '../NewConversation.types';

const open: NewConversationState = { ...initialNewConversationState, isOpen: true };

describe('newConversationReducer', () => {
  it('opens from a clean slate', () => {
    const dirty: NewConversationState = {
      ...open,
      mode: 'group',
      selectedContactIds: ['u2'],
      groupTitle: 'x',
    };
    expect(newConversationReducer(dirty, { type: 'OPEN' })).toEqual(open);
  });

  it('toggles a contact on and off', () => {
    const added = newConversationReducer(open, {
      type: 'TOGGLE_CONTACT',
      contactId: 'u2',
    });
    expect(added.selectedContactIds).toEqual(['u2']);

    const removed = newConversationReducer(added, {
      type: 'TOGGLE_CONTACT',
      contactId: 'u2',
    });
    expect(removed.selectedContactIds).toEqual([]);
  });

  it('keeps the selection but resets the step when the mode changes', () => {
    const onTitle: NewConversationState = {
      ...open,
      mode: 'group',
      selectedContactIds: ['u2'],
      step: 'groupTitle',
    };
    const next = newConversationReducer(onTitle, { type: 'SET_MODE', mode: 'dm' });
    expect(next.mode).toBe('dm');
    expect(next.step).toBe('selectParticipants');
    expect(next.selectedContactIds).toEqual(['u2']);
  });

  it('moves between steps with CONTINUE_TO_TITLE and BACK', () => {
    const onTitle = newConversationReducer(open, { type: 'CONTINUE_TO_TITLE' });
    expect(onTitle.step).toBe('groupTitle');
    expect(newConversationReducer(onTitle, { type: 'BACK' }).step).toBe(
      'selectParticipants',
    );
  });

  it('resets everything on cancel', () => {
    const dirty: NewConversationState = {
      ...open,
      selectedContactIds: ['u2'],
      groupTitle: 'team',
      step: 'groupTitle',
    };
    expect(newConversationReducer(dirty, { type: 'CANCEL' })).toEqual(
      initialNewConversationState,
    );
  });
});
