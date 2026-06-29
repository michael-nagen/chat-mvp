import { createContext, useContext } from 'react';
import type { ProfileEmailFormValue } from './ProfileEmailForm.types';

export const ProfileEmailFormContext = createContext<ProfileEmailFormValue | null>(null);

export function useProfileEmailFormContext(): ProfileEmailFormValue {
  const value = useContext(ProfileEmailFormContext);
  if (!value) {
    throw new Error('useProfileEmailFormContext must be used within ProfileEmailForm');
  }

  return value;
}
