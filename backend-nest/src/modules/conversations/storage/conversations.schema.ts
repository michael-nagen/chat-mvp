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

  @Prop({ type: String, required: true, enum: ['dm', 'group'] })
  type!: 'dm' | 'group';

  // Set only on DMs. The partial unique index below makes it the single source
  // of truth for "one DM per pair"; groups omit it and are excluded from the index.
  @Prop({ type: String })
  dmKey?: string;

  // Empty until set: a DM's title can derive empty (self-DM) and a fresh
  // conversation has no preview yet, so '' is valid — `required` would reject it.
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

// Enforces "one DM per pair". Partial (not plain unique) so group conversations,
// which carry no `dmKey`, are excluded — a plain unique index would collide all
// of them on the missing/`null` value.
ConversationSchema.index(
  { dmKey: 1 },
  { unique: true, partialFilterExpression: { dmKey: { $exists: true } } },
);
