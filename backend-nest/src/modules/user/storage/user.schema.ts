import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// The one place that names the MongoDB collection these documents live in.
export const USERS_COLLECTION = 'users';

// Persistence schema for the `users` collection. Kept separate from the plain
// domain entity (modules/memory/entities.ts): only repositories touch this type.
@Schema({ collection: USERS_COLLECTION, versionKey: false })
export class UserDoc {
  // Custom string id (e.g. `u-<uuid>`), not a Mongo ObjectId.
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({ type: String, required: true })
  firstName!: string;

  @Prop({ type: String, required: true })
  lastName!: string;

  // Internal only — never mapped into any DTO.
  @Prop({ type: String, required: true })
  passwordHash!: string;

  // Public URL of the current avatar; absent when the user has none.
  @Prop({ type: String, required: false, default: null })
  avatarUrl?: string | null;

  // Internal S3 object key for the current avatar — never mapped into any DTO.
  @Prop({ type: String, required: false, default: null })
  avatarKey?: string | null;

  @Prop({ type: Date, required: true })
  createdAt!: Date;
}

export type UserDocument = HydratedDocument<UserDoc>;
export const UserSchema = SchemaFactory.createForClass(UserDoc);
