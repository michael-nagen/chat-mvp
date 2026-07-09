import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// An assistant conversation has no other participants — the assistant is
// implicit from the type. Only an optional title is accepted; a default is
// applied in the orchestrator when omitted.
export class CreateAssistantDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title?: string;
}
