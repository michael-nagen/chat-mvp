import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EMBEDDING_DIMENSIONS } from '../../embeddings/embeddings.constants';

export const KNOWLEDGE_CHUNKS_COLLECTION = 'knowledge_chunks';

export const KNOWLEDGE_CHUNK_VECTOR_INDEX = 'knowledge_chunk_vector_index';

export const knowledgeChunkVectorSearchIndex = {
  name: KNOWLEDGE_CHUNK_VECTOR_INDEX,
  type: 'vectorSearch' as const,
  definition: {
    fields: [
      {
        type: 'vector' as const,
        path: 'embedding',
        numDimensions: EMBEDDING_DIMENSIONS,
        similarity: 'cosine' as const,
      },
      { type: 'filter' as const, path: 'userId' },
      { type: 'filter' as const, path: 'documentId' },
    ],
  },
};

@Schema({ collection: KNOWLEDGE_CHUNKS_COLLECTION, versionKey: false })
export class KnowledgeChunkDoc {
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ type: String, required: true })
  userId!: string;

  @Prop({ type: String, required: true })
  documentId!: string;

  @Prop({ type: String, required: true })
  documentName!: string;

  @Prop({ type: Number, required: true })
  chunkIndex!: number;

  @Prop({ type: String, required: true })
  text!: string;

  @Prop({ type: [Number], required: true })
  embedding!: number[];

  @Prop({ type: Date, required: true })
  createdAt!: Date;
}

export type KnowledgeChunkDocument = HydratedDocument<KnowledgeChunkDoc>;
export const KnowledgeChunkSchema =
  SchemaFactory.createForClass(KnowledgeChunkDoc);

// Owner-wide lookups.
KnowledgeChunkSchema.index({ userId: 1 });
// Delete/count all chunks of a document.
KnowledgeChunkSchema.index({ documentId: 1 });
// Primary access path: a user's chunks for a document, in chunk order.
KnowledgeChunkSchema.index({ userId: 1, documentId: 1, chunkIndex: 1 });
