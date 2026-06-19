import { Injectable } from '@nestjs/common';
import { AvatarService } from '../avatar/avatar.service';
import type {
  RequestAvatarUploadInput,
  RequestAvatarUploadOutput,
} from './request-avatar-upload.module';

@Injectable()
export class RequestAvatarUploadOrchestrator {
  constructor(private readonly avatars: AvatarService) {}

  run({
    userId,
    contentType,
  }: RequestAvatarUploadInput): Promise<RequestAvatarUploadOutput> {
    // The key is minted server-side under the caller's own prefix.
    return this.avatars.createUploadUrl({ userId, contentType });
  }
}
