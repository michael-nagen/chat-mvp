import { createContext, useContext } from 'react';
import type { ProfileNameFormValue } from './ProfileNameForm.types';

export const ProfileNameFormContext = createContext<ProfileNameFormValue | null>(null);

export function useProfileNameFormContext(): ProfileNameFormValue {
  const value = useContext(ProfileNameFormContext);
  if (!value) {
    throw new Error('useProfileNameFormContext must be used within ProfileNameForm');
  }

  return value;
}
