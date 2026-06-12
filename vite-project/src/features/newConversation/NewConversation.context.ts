import { createContext, useContext } from 'react';

export type NewConversationContextValue = {
  isOpen: boolean;
  email: string;
  isCreating: boolean;
  submittable: boolean;
  onEmailChange: (value: string) => void;
  open: () => void;
  cancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export const NewConversationContext = createContext<NewConversationContextValue | null>(null);

export function useNewConversation(): NewConversationContextValue {
  const value = useContext(NewConversationContext);
  if (!value) {
    throw new Error('useNewConversation must be used inside NewConversationProvider');
  }

  return value;
}
