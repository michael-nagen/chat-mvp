import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export type CreateConversationType = 'dm' | 'group' | 'assistant' | 'tutor';

const CREATE_CONVERSATION_TYPES: readonly CreateConversationType[] = [
  'dm',
  'group',
  'assistant',
  'tutor',
];


export class CreateConversationDto {
  @IsIn(CREATE_CONVERSATION_TYPES)
  type!: CreateConversationType;

  @ValidateIf(
    (dto: CreateConversationDto) => dto.type === 'dm' || dto.type === 'group',
  )
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  contactIds?: string[];

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title?: string;
}
