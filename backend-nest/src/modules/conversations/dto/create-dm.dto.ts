import { ArrayMaxSize, ArrayNotEmpty, IsArray, IsString } from 'class-validator';

// Coarse shape guard only — the current user id is added server-side and the
// precise 1–15 bound is enforced after dedup in the orchestrator. ArrayMaxSize
// is an abuse cap so an oversized body never reaches the lookup.
export class CreateDmDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  participantIds!: string[];
}
