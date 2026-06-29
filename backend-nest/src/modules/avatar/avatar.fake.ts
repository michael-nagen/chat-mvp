import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { AvatarStorage } from './avatar.storage';
import { PresignedAvatarUpload } from './avatar.types';
import {
  AVATAR_CONTENT_TYPE_EXTENSIONS,
  avatarKeyPrefix,
} from './avatar.constants';

// In-memory driver for tests and the memory profile: never touches AWS. Records
// deleted keys so tests can assert replace/remove cleanup, and simulates the
// uploaded object (presence + size) so commit-time checks have something to read.
@Injectable()
export class FakeAvatarStorage extends AvatarStorage {
  private static readonly PUBLIC_BASE = 'https://fake-cdn.local';
  private static readonly DEFAULT_OBJECT_BYTES = 1024;
  readonly deletedKeys: string[] = [];
  // key → contentLength for objects the fake considers "uploaded".
  private readonly objects = new Map<string, number>();

  createUploadUrl({
    userId,
    contentType,
  }: {
    userId: string;
    contentType: string;
  }): Promise<PresignedAvatarUpload> {
    const ext = AVATAR_CONTENT_TYPE_EXTENSIONS[contentType] ?? 'bin';
    const key = `${avatarKeyPrefix(userId)}${randomUUID()}.${ext}`;
    // No real PUT happens in tests, so treat presign as a successful upload.
    this.objects.set(key, FakeAvatarStorage.DEFAULT_OBJECT_BYTES);
    return Promise.resolve({
      uploadUrl: `https://fake-upload.local/${key}?signed=1`,
      key,
      publicUrl: this.buildPublicUrl(key),
    });
  }

  buildPublicUrl(key: string): string {
    return `${FakeAvatarStorage.PUBLIC_BASE}/${key}`;
  }

  statObject(key: string): Promise<{ contentLength: number } | null> {
    const contentLength = this.objects.get(key);
    return Promise.resolve(contentLength === undefined ? null : { contentLength });
  }

  deleteObject(key: string): Promise<void> {
    this.deletedKeys.push(key);
    this.objects.delete(key);
    return Promise.resolve();
  }

  // Test seam: override a stored object's size (e.g. to exercise the size guard).
  setObjectSize(key: string, contentLength: number): void {
    this.objects.set(key, contentLength);
  }
}
