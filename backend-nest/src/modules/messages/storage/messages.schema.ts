import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MessageMetadata } from '../../../common/storage/entities';

// The one place that names the MongoDB collection these documents live in.
export const MESSAGES_COLLECTION = 'messages';

// Persistence schema for the `messages` collection. Referenced (not embedded)
// from conversations so threads grow unbounded with index-backed pagination.
@Schema({ collection: MESSAGES_COLLECTION, versionKey: false })
export class MessageDoc {
  // Custom string id (e.g. `m-<uuid>`), not a Mongo ObjectId.
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ type: String, required: true })
  conversationId!: string;

  @Prop({ type: String, required: true })
  senderId!: string;

  @Prop({ type: String, required: true })
  content!: string;

  @Prop({ type: Date, required: true })
  createdAt!: Date;

  // Optional, schemaless bag for extra per-message data (currently tutor
  // citations). Stored as-is; kept flexible for future metadata.
  @Prop({ type: Object, required: false })
  metadata?: MessageMetadata;
}

export type MessageDocument = HydratedDocument<MessageDoc>;
export const MessageSchema = SchemaFactory.createForClass(MessageDoc);

// Compound key backs both cursor pagination and latest-message reads.
// `_id` is the tiebreak when two messages share a createdAt (keyset cursor).
MessageSchema.index({ conversationId: 1, createdAt: 1, _id: 1 });
