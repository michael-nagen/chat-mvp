import { IsOptional, IsString } from 'class-validator';

export class SearchMessagesQueryDto {
  @IsOptional()
  @IsString()
  q?: string;
}
