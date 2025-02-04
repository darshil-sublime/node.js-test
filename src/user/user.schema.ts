import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Bookmark } from 'src/bookmark/bookmark.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  hash: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Bookmark' }] })
  bookmarks: Bookmark[];
}

export const UserSchema = SchemaFactory.createForClass(User);
