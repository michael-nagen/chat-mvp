import { IsString, MinLength } from 'class-validator';

export class SetAvatarDto {
  // The object key returned by the presign step; prefix is re-validated server-side.
  @IsString()
  @MinLength(1)
  key!: string;
}
