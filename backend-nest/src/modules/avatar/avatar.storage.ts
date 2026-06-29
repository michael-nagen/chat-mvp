import { PresignedAvatarUpload } from './avatar.types';

// Storage-agnostic port for avatar object storage. The S3 driver implements it
// in production; a fake in-memory driver backs tests and the memory profile.
export abstract class AvatarStorage {
  // Issues a presigned PUT for a brand-new object under the user's own prefix.
  abstract createUploadUrl(params: {
    userId: string;
    contentType: string;
  }): Promise<PresignedAvatarUpload>;

  // Derives the public URL for an already-known key (used on commit).
  abstract buildPublicUrl(key: string): string;

  // Object metadata for an already-uploaded key, or null when it does not exist.
  // Used on commit to confirm the upload happened and is within the size limit.
  abstract statObject(key: string): Promise<{ contentLength: number } | null>;

  // Removes an object; used when replacing or removing an avatar.
  abstract deleteObject(key: string): Promise<void>;
}
