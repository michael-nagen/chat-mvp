import { IsOptional, IsString } from 'class-validator';

// Non-file fields of the multipart upload. conversationId is optional: when it
// refers to a tutor conversation, an upload event message is posted into it.
export class UploadKnowledgeDocumentDto {
  @IsOptional()
  @IsString()
  conversationId?: string;
}
