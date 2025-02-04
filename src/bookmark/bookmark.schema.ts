import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookmarkDocument = Bookmark & Document;

@Schema({ timestamps: true })
export class Bookmark extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  link: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
