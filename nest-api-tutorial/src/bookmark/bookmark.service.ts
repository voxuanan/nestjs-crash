import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BookMark } from './db/bookmark.model';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel('BookMark') private readonly BookMarkModel: Model<BookMark>,
  ) {}

  async getBookmarks(userId: string) {
    const bookmarks = this.BookMarkModel.find({ userId });
    return bookmarks;
  }

  async addBookmark(userId: string, dto: CreateBookMarkDto) {
    const newBookMark = new this.BookMarkModel({
      userId,
      ...dto,
    });
    await newBookMark.save();
    return { bookmark: newBookMark };
  }

  async updateBookmark(
    bookmarkId: number,
    userId: string,
    dto: EditBookMarkDto,
  ) {
    let bookmark: BookMark = await this.BookMarkModel.findById(bookmarkId);
    if (bookmark.userId.toString() != userId)
      throw new ForbiddenException('You are not the owner of this bookmark');
    bookmark = await this.BookMarkModel.findByIdAndUpdate(
      bookmarkId,
      { ...dto },
      { new: true },
    );
    return bookmark;
  }

  async removeBookmark(bookmarkId: number) {
    const bookmark = await this.BookMarkModel.findByIdAndDelete(bookmarkId, {
      new: true,
    });
    console.log(bookmark);
    return bookmark;
  }
}
