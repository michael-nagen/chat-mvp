import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { UploadedFileLike } from '../knowledge-documents/knowledge-document.types';
import { UploadKnowledgeDocumentOrchestrator } from '../upload-knowledge-document-orchestrator/upload-knowledge-document.orchestrator';
import { UploadKnowledgeDocumentDto } from '../upload-knowledge-document-orchestrator/upload-knowledge-document.dto';
import type { UploadKnowledgeDocumentOutput } from '../upload-knowledge-document-orchestrator/upload-knowledge-document.module';
import { ListKnowledgeDocumentsOrchestrator } from '../list-knowledge-documents-orchestrator/list-knowledge-documents.orchestrator';
import type { ListKnowledgeDocumentsOutput } from '../list-knowledge-documents-orchestrator/list-knowledge-documents.module';
import { DeleteKnowledgeDocumentOrchestrator } from '../delete-knowledge-document-orchestrator/delete-knowledge-document.orchestrator';

@UseGuards(JwtAuthGuard)
@Controller('knowledge/documents')
export class KnowledgeController {
  constructor(
    private readonly uploadDocument: UploadKnowledgeDocumentOrchestrator,
    private readonly listDocuments: ListKnowledgeDocumentsOrchestrator,
    private readonly deleteDocument: DeleteKnowledgeDocumentOrchestrator,
  ) {}

  
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: UploadedFileLike | undefined,
    @Body() body: UploadKnowledgeDocumentDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UploadKnowledgeDocumentOutput> {
    const result = await this.uploadDocument.execute({
      userId: user.userId,
      file,
      conversationId: body.conversationId,
    });
    res.status(result.alreadyExisted ? HttpStatus.OK : HttpStatus.CREATED);
    return result;
  }

  @Get()
  list(@CurrentUser() user: AuthUser): Promise<ListKnowledgeDocumentsOutput> {
    return this.listDocuments.execute({ userId: user.userId });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ): Promise<void> {
    await this.deleteDocument.execute({ userId: user.userId, id });
  }
}
