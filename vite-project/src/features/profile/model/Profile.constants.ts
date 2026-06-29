// Image types accepted for an avatar (mirrors the backend allowlist).
export const ALLOWED_AVATAR_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const;

// Client-side guard before requesting a presigned upload.
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB
