import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// Coarse shape guard only — the precise 0–30 bound is enforced after dedup in
// the orchestrator. An empty array is a solo group (just the creator). Title is
// optional; a name-derived fallback is applied there.
export class CreateGroupDto {
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  participantIds!: string[];

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title?: string;
}
