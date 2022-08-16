import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BookMarkSchema } from './db/bookmark.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'BookMark', schema: BookMarkSchema }]),
  ],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
