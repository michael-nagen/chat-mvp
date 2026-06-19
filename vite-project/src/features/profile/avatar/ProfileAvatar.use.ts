import { useRef, useState } from 'react';
import { useAuth } from '../../auth';
import { useToast } from '../../toast';
import {
  commitAvatar,
  presignAvatar,
  removeAvatar,
  uploadToStorage,
} from '../model/Profile.api';
import { ALLOWED_AVATAR_TYPES, MAX_AVATAR_BYTES } from '../model/Profile.constants';

/** Owns the avatar manager: upload (presign → PUT → commit), remove, loading + error. */
export function useProfileAvatar() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onSelectFile(file: File): Promise<void> {
    setError(null);
    if (!(ALLOWED_AVATAR_TYPES as readonly string[]).includes(file.type)) {
      setError('Unsupported image type. Use PNG, JPEG, WebP, or GIF.');
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setError('Image is too large (max 5 MB).');
      return;
    }
    setIsBusy(true);
    try {
      const presigned = await presignAvatar(file.type);
      await uploadToStorage({ uploadUrl: presigned.uploadUrl, file });
      updateUser(await commitAvatar(presigned.key));
      showToast('Avatar updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update avatar.');
    } finally {
      setIsBusy(false);
    }
  }

  async function onRemove(): Promise<void> {
    setIsBusy(true);
    setError(null);
    try {
      updateUser(await removeAvatar());
      showToast('Avatar removed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove avatar.');
    } finally {
      setIsBusy(false);
    }
  }

  return {
    avatarUrl: user?.avatarUrl ?? null,
    displayName: user?.displayName ?? '',
    hasAvatar: Boolean(user?.avatarUrl),
    isBusy,
    error,
    fileInputRef,
    onSelectFile,
    onRemove,
  };
}
