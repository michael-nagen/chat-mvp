import type { User } from '../../../shared/entities/User.types';
import { patch, post, put, del } from '../../../shared/api/apiClient';

// Mirrors the backend presign response: where to PUT the bytes, the object key
// to commit, and the final public URL.
export type PresignedAvatarUpload = {
  uploadUrl: string;
  key: string;
  publicUrl: string;
};

export function updateName(body: {
  firstName: string;
  lastName: string;
}): Promise<User> {
  return patch<User>('/me/name', body);
}

export function updateEmail(body: { email: string }): Promise<User> {
  return patch<User>('/me/email', body);
}

export function presignAvatar(contentType: string): Promise<PresignedAvatarUpload> {
  return post<PresignedAvatarUpload>('/me/avatar/presign', { contentType });
}

export function commitAvatar(key: string): Promise<User> {
  return put<User>('/me/avatar', { key });
}

export function removeAvatar(): Promise<User> {
  return del<User>('/me/avatar');
}

// Direct browser → S3 upload via the presigned URL. Not an API call: no auth
// header and a different host, so it bypasses the shared apiClient.
export async function uploadToStorage({
  uploadUrl,
  file,
}: {
  uploadUrl: string;
  file: File;
}): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!res.ok) {
    throw new Error('Upload failed. Please try again.');
  }
}
