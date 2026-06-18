import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// The one place that names the MongoDB collection these documents live in.
export const CONVERSATIONS_COLLECTION = 'conversations';

// Persistence schema for the `conversations` collection. `title`/`lastMessage`
// are denormalized previews kept fresh on send; `lastMessageAt` maps to the
// DTO's `updatedAt`. Separate from the plain domain entity by design.
@Schema({ collection: CONVERSATIONS_COLLECTION, versionKey: false })
export class ConversationDoc {
  // Custom string id (e.g. `c-<uuid>`), not a Mongo ObjectId.
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ type: [String], required: true })
  participantIds!: string[];

  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true })
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
