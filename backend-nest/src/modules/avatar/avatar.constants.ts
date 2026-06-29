// Image content types accepted for avatars, mapped to the file extension used
// in the object key. The DTO validates against these keys.
export const AVATAR_CONTENT_TYPE_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export const ALLOWED_AVATAR_CONTENT_TYPES = Object.keys(
  AVATAR_CONTENT_TYPE_EXTENSIONS,
);

// Presigned upload URLs are short-lived.
export const AVATAR_UPLOAD_URL_TTL_SECONDS = 300;

// Hard upper bound enforced server-side on commit. The client also checks before
// uploading, but a presigned PUT can't express a size limit, so we verify after.
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB

// Every user's avatars live under their own prefix. The presign endpoint only
// ever mints keys here, and commit only accepts keys under the caller's prefix.
export const avatarKeyPrefix = (userId: string): string =>
  `avatars/${userId}/`;
