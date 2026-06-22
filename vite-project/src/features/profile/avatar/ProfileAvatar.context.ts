import { createContext, useContext } from 'react';
import type { ProfileAvatarValue } from './ProfileAvatar.types';

export const ProfileAvatarContext = createContext<ProfileAvatarValue | null>(null);

export function useProfileAvatarContext(): ProfileAvatarValue {
  const value = useContext(ProfileAvatarContext);
  if (!value) {
    throw new Error('useProfileAvatarContext must be used within ProfileAvatar');
  }

  return value;
}
