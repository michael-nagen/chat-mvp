import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const CONVERSATIONS_COLLECTION = 'conversations';

@Schema({ collection: CONVERSATIONS_COLLECTION, versionKey: false })
export class ConversationDoc {
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ type: [String], required: true })
  participantIds!: string[];

  @Prop({ type: String, required: true, enum: ['dm', 'group', 'assistant'] })
  type!: 'dm' | 'group' | 'assistant';

  @Prop({ type: String, required: true })
  conversationKey!: string;

  @Prop({ type: String, default: '' })
  title!: string;

  @Prop({ type: String, default: '' })
  lastMessage!: string;

  @Prop({ type: Date, required: true })
  lastMessageAt!: Date;

  @Prop({ type: Date, required: true })
  createdAt!: Date;
}

export type ConversationDocument = HydratedDocument<ConversationDoc>;
export const ConversationSchema = SchemaFactory.createForClass(ConversationDoc);

// Backs "list my conversations sorted by last activity".
ConversationSchema.index({ participantIds: 1, lastMessageAt: -1 });

// conversationKey is identity for ALL types; uniqueness is a DM-only policy, so
// the unique index is partial-filtered to DMs. Groups/assistants may share a key.
ConversationSchema.index(
  { conversationKey: 1 },
  { unique: true, partialFilterExpression: { type: 'dm' } },
);
