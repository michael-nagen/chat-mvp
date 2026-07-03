import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MAX_CONTACTS_PER_USER } from '../user.constants';

export const USERS_COLLECTION = 'users';

@Schema({ collection: USERS_COLLECTION, versionKey: false })
export class UserDoc {
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ type: String, required: true, unique: true })
  email!: string;

  @Prop({ type: String, required: true })
  firstName!: string;

  @Prop({ type: String, required: true })
  lastName!: string;

  @Prop({ type: String, required: true })
  passwordHash!: string;

  @Prop({
    type: [String],
    default: [],
    validate: {
      validator: (ids: string[]) => ids.length <= MAX_CONTACTS_PER_USER,
      message: `A user cannot have more than ${MAX_CONTACTS_PER_USER} contacts.`,
    },
  })
  contactIds!: string[];

  @Prop({ type: String, required: false, default: null })
  avatarUrl?: string | null;

  @Prop({ type: String, required: false, default: null })
  avatarKey?: string | null;

  @Prop({ type: Date, required: true })
  createdAt!: Date;
}

export type UserDocument = HydratedDocument<UserDoc>;
export const UserSchema = SchemaFactory.createForClass(UserDoc);
