export type ConversationMode = 'dm' | 'group';
export type NewConversationStep = 'selectParticipants' | 'groupTitle';

export type NewConversationState = {
  isOpen: boolean;
  mode: ConversationMode;
  selectedContactIds: string[];
  step: NewConversationStep;
  groupTitle: string;
  isCreating: boolean;
};

export type NewConversationAction =
  | { type: 'OPEN' }
  | { type: 'CANCEL' }
  | { type: 'SET_MODE'; mode: ConversationMode }
  | { type: 'TOGGLE_CONTACT'; contactId: string }
  | { type: 'CONTINUE_TO_TITLE' }
  | { type: 'BACK' }
  | { type: 'SET_GROUP_TITLE'; title: string }
  | { type: 'CREATE_START' }
  | { type: 'CREATE_END' };

export type NewConversationContextValue = NewConversationState & {
  // Step-1 "Continue" (group) is allowed up to the max; "Create" (dm) needs the
  // DM range; "Create" (group, step 2) needs a non-empty title.
  canContinue: boolean;
  canCreate: boolean;
  open: () => void;
  cancel: () => void;
  setMode: (mode: ConversationMode) => void;
  toggleContact: (contactId: string) => void;
  continueToTitle: () => void;
  back: () => void;
  setGroupTitle: (title: string) => void;
  submit: () => Promise<void>;
};
