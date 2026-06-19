import { IsIn } from 'class-validator';
import { ALLOWED_AVATAR_CONTENT_TYPES } from '../../avatar/avatar.constants';

export class PresignAvatarDto {
  @IsIn(ALLOWED_AVATAR_CONTENT_TYPES)
  contentType!: string;
}
