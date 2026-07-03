import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const KNOWLEDGE_DOCUMENTS_COLLECTION = 'knowledge_documents';

@Schema({ collection: KNOWLEDGE_DOCUMENTS_COLLECTION, versionKey: false })
export class KnowledgeDocumentDoc {
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ type: String, required: true })
  userId!: string;

  @Prop({ type: String, required: true })
  fileName!: string;

  @Prop({ type: String, required: true })
  contentType!: string;

  @Prop({ type: String, required: true })
  contentHash!: string;

  @Prop({ type: String, required: true, enum: ['ready', 'failed'] })
  status!: 'ready' | 'failed';

  @Prop({ type: Number, required: true, default: 0 })
  chunkCount!: number;

  @Prop({ type: Date, required: true })
  createdAt!: Date;
}

export type KnowledgeDocumentDocument = HydratedDocument<KnowledgeDocumentDoc>;
export const KnowledgeDocumentSchema =
  SchemaFactory.createForClass(KnowledgeDocumentDoc);

// Backs "list my documents, newest first".
KnowledgeDocumentSchema.index({ userId: 1, createdAt: -1 });

// Per-user content dedup: the same user cannot store the same content twice,
// while different users may each store identical content independently.
KnowledgeDocumentSchema.index({ userId: 1, contentHash: 1 }, { unique: true });
