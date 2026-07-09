import { Injectable } from '@nestjs/common';
import { KnowledgeDocumentService } from '../knowledge-documents/knowledge-document.service';
import { KnowledgeChunkService } from '../knowledge-chunks/knowledge-chunk.service';
import { toKnowledgeDocumentResponse } from '../knowledge-documents/knowledge-document.mapper';
import { EmbeddingsProvider } from '../embeddings/embeddings-provider';
import { MessagesService } from '../messages/messages.service';
import { ConversationsService } from '../conversations/conversations.service';
import { TUTOR_ASSISTANT_ID } from '../assistant/assistant.catalog';
import { UnitOfWork } from '../../common/storage/unit-of-work';
import { ConflictException, ValidationException } from '../../common/errors/app.exception';
import { KnowledgeDocument } from '../../common/storage/entities';
import { parseKnowledgeUpload } from './knowledge-upload';
import { splitKnowledgeText } from './knowledge-chunking';
import type {
  UploadKnowledgeDocumentInput,
  UploadKnowledgeDocumentOutput,
} from './upload-knowledge-document.module';

@Injectable()
export class UploadKnowledgeDocumentOrchestrator {
  constructor(
    private readonly documents: KnowledgeDocumentService,
    private readonly chunks: KnowledgeChunkService,
    private readonly embeddings: EmbeddingsProvider,
    private readonly messages: MessagesService,
    private readonly conversations: ConversationsService,
    private readonly unitOfWork: UnitOfWork,
  ) {}

  async execute({
    userId,
    file,
    conversationId,
  }: UploadKnowledgeDocumentInput): Promise<UploadKnowledgeDocumentOutput> {
    const { fileName, contentType, contentHash, text } =
      parseKnowledgeUpload(file);

    // Split up-front so a document is never persisted for content that yields no
    // chunks; non-empty text was already validated in parseKnowledgeUpload.
    const texts = splitKnowledgeText({ text, contentType });
    if (texts.length === 0) {
      throw new ValidationException('File produced no chunks.');
    }

    const { document, alreadyExisted } = await this.upsert({
      userId,
      fileName,
      contentType,
      contentHash,
      texts,
    });

    // Optionally announce the upload inside a tutor conversation (UI event only;
    // no file text/embeddings are stored in the messages collection).
    if (conversationId) {
      await this.postUploadEvent({ userId, conversationId, document });
    }

    return {
      document: toKnowledgeDocumentResponse(document),
      alreadyExisted,
    };
  }

  private async upsert({
    userId,
    fileName,
    contentType,
    contentHash,
    texts,
  }: {
    userId: string;
    fileName: string;
    contentType: string;
    contentHash: string;
    texts: string[];
  }): Promise<{ document: KnowledgeDocument; alreadyExisted: boolean }> {
    // Idempotent get: identical content for this user returns the existing
    // document and never re-ingests (no duplicate chunks).
    const existing = await this.documents.findByUserAndHash({
      userId,
      contentHash,
    });
    if (existing) {
      return { document: existing, alreadyExisted: true };
    }

    const embeddings = await this.embeddings.embedDocuments(texts);
    try {
      const document = await this.ingest({
        userId,
        fileName,
        contentType,
        contentHash,
        texts,
        embeddings,
      });
      return { document, alreadyExisted: false };
    } catch (error) {
      if (error instanceof ConflictException) {
        const raced = await this.documents.findByUserAndHash({
          userId,
          contentHash,
        });
        if (raced) {
          return { document: raced, alreadyExisted: true };
        }
      }
      throw error;
    }
  }

  // Best-effort UI event: only for a tutor conversation the user participates in.
  // Persisted on the DEFAULT (messages) connection — separate from the Knowledge
  // Atlas connection — and carries only references, never chunk text/embeddings.
  private async postUploadEvent({
    userId,
    conversationId,
    document,
  }: {
    userId: string;
    conversationId: string;
    document: KnowledgeDocument;
  }): Promise<void> {
    const conversation = await this.conversations.getById(conversationId);
    if (
      !conversation ||
      conversation.type !== 'tutor' ||
      !conversation.participantIds.includes(userId)
    ) {
      return;
    }
    const content = `Uploaded knowledge file: ${document.fileName}`;
    const message = await this.messages.create({
      conversationId,
      userId: TUTOR_ASSISTANT_ID,
      content,
      metadata: {
        kind: 'knowledge_upload',
        documentId: document.id,
        documentName: document.fileName,
        status: 'completed',
      },
    });
    await this.conversations.updateLastMessage({
      id: conversationId,
      lastMessage: content,
      updatedAt: message.createdAt,
    });
  }

  // Document + chunks + chunkCount commit together (or roll back together).
  private ingest({
    userId,
    fileName,
    contentType,
    contentHash,
    texts,
    embeddings,
  }: {
    userId: string;
    fileName: string;
    contentType: string;
    contentHash: string;
    texts: string[];
    embeddings: number[][];
  }): Promise<KnowledgeDocument> {
    return this.unitOfWork.run(async (tx) => {
      const created = await this.documents.create(
        { userId, fileName, contentType, contentHash },
        tx,
      );
      const chunks = await this.chunks.createForDocument(
        {
          userId,
          documentId: created.id,
          documentName: created.fileName,
          texts,
          embeddings,
        },
        tx,
      );
      return this.documents.updateChunkCount(
        { id: created.id, userId, chunkCount: chunks.length },
        tx,
      );
    });
  }
}
