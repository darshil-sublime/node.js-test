import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bookmark, BookmarkSchema } from './bookmark.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bookmark.name, schema: BookmarkSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class BookmarkModule {}
