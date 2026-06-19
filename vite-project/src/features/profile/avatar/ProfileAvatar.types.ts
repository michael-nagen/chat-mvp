/** Shared avatar-manager state exposed via ProfileAvatarContext and read by each child. */
export type ProfileAvatarValue = {
  avatarUrl: string | null;
  displayName: string;
  hasAvatar: boolean;
  isBusy: boolean;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSelectFile: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
};
