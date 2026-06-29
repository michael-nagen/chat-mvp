import type { useProfileAvatar } from './ProfileAvatar.use';

/** Shared avatar-manager state exposed via ProfileAvatarContext and read by each child. */
export type ProfileAvatarValue = ReturnType<typeof useProfileAvatar>;
