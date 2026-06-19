import { Module } from '@nestjs/common';
import { AvatarStorage } from './avatar.storage';
import { AvatarService } from './avatar.service';
import { S3AvatarStorage } from './avatar.s3';
import { FakeAvatarStorage } from './avatar.fake';

// Avatar object storage driver, independent of the DB STORAGE_DRIVER: "s3"
// (real AWS, default) or "fake" (in-memory; tests force this via setup-env).
export type AvatarStorageDriver = 's3' | 'fake';

function resolveAvatarStorageDriver(): AvatarStorageDriver {
  const raw = process.env.AVATAR_STORAGE ?? 's3';
  if (raw !== 's3' && raw !== 'fake') {
    throw new Error(`Invalid AVATAR_STORAGE "${raw}" (expected "s3" or "fake").`);
  }
  return raw;
}

@Module({
  providers: [
    AvatarService,
    {
      provide: AvatarStorage,
      useClass:
        resolveAvatarStorageDriver() === 's3'
          ? S3AvatarStorage
          : FakeAvatarStorage,
    },
  ],
  // AvatarService is the consumer-facing seam; AvatarStorage stays exported so
  // e2e tests can fetch the fake driver and assert delete cleanup.
  exports: [AvatarService, AvatarStorage],
})
export class AvatarModule {}
