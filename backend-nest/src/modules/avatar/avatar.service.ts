import { Injectable } from '@nestjs/common';
import { AvatarStorage } from './avatar.storage';
import { PresignedAvatarUpload } from './avatar.types';
import { MAX_AVATAR_BYTES } from './avatar.constants';
import { ValidationException } from '../../common/errors/app.exception';

// Owns avatar operations and is the only seam feature orchestrators touch;
// it delegates the storage details to the configured AvatarStorage driver.
@Injectable()
export class AvatarService {
  constructor(private readonly storage: AvatarStorage) {}

  createUploadUrl(params: {
    userId: string;
    contentType: string;
  }): Promise<PresignedAvatarUpload> {
    return this.storage.createUploadUrl(params);
  }

  buildPublicUrl(key: string): string {
    return this.storage.buildPublicUrl(key);
  }

  // Authoritative commit-time check: the object must actually exist and be within
  // the size limit (a presigned PUT can't enforce size). Oversized uploads are
  // deleted as best-effort cleanup before rejecting.
  async assertUploaded(key: string): Promise<void> {
    const stat = await this.storage.statObject(key);
    if (!stat) {
      throw new ValidationException('No uploaded avatar found for this key.');
    }
    if (stat.contentLength > MAX_AVATAR_BYTES) {
      await this.storage.deleteObject(key).catch(() => undefined);
      throw new ValidationException('Avatar exceeds the maximum allowed size.');
    }
  }

  deleteObject(key: string): Promise<void> {
    return this.storage.deleteObject(key);
  }
}
