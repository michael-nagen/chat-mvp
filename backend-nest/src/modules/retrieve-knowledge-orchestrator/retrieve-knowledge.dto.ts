import { IsString, MaxLength, MinLength } from 'class-validator';

// Request body for POST /knowledge/retrieval.
export class RetrieveKnowledgeDto {
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  query!: string;
}
