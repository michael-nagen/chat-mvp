import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AvatarStorage } from './avatar.storage';
import { PresignedAvatarUpload } from './avatar.types';
import {
  AVATAR_CONTENT_TYPE_EXTENSIONS,
  AVATAR_UPLOAD_URL_TTL_SECONDS,
  avatarKeyPrefix,
} from './avatar.constants';

// Real driver: presigns PUTs against an AWS S3 bucket and serves objects via a
// stable public URL. Objects are made readable through a bucket policy on the
// `avatars/` prefix (not per-object ACLs), so no ACL is signed into the PUT.
@Injectable()
export class S3AvatarStorage extends AvatarStorage {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(config: ConfigService) {
    super();
    const region = config.getOrThrow<string>('AWS_REGION');
    this.bucket = config.getOrThrow<string>('AWS_S3_BUCKET');
    // Defaults to the virtual-hosted–style bucket URL; override for a CDN/custom domain.
    this.publicBaseUrl =
      config.get<string>('AVATAR_PUBLIC_BASE_URL') ??
      `https://${this.bucket}.s3.${region}.amazonaws.com`;
    // Credentials come from the default AWS provider chain (env vars / role).
    this.client = new S3Client({ region });
  }

  async createUploadUrl({
    userId,
    contentType,
  }: {
    userId: string;
    contentType: string;
  }): Promise<PresignedAvatarUpload> {
    const ext = AVATAR_CONTENT_TYPE_EXTENSIONS[contentType];
    const key = `${avatarKeyPrefix(userId)}${randomUUID()}.${ext}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: AVATAR_UPLOAD_URL_TTL_SECONDS,
    });
    return { uploadUrl, key, publicUrl: this.buildPublicUrl(key) };
  }

  buildPublicUrl(key: string): string {
    return `${this.publicBaseUrl}/${key}`;
  }

  // Requires s3:GetObject on the avatars/* prefix for the app's IAM principal.
  async statObject(key: string): Promise<{ contentLength: number } | null> {
    try {
      const head = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return { contentLength: head.ContentLength ?? 0 };
    } catch (error) {
      if (isNotFound(error)) {
        return null;
      }
      throw error;
    }
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}

// HeadObject signals a missing key via a NotFound error / 404, not an empty result.
function isNotFound(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return e.name === 'NotFound' || e.$metadata?.httpStatusCode === 404;
}
