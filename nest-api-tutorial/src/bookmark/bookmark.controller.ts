import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: string) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Post()
  async addBookmark(
    @GetUser('id') userId: string,
    @Body() dto: CreateBookMarkDto,
  ) {
    return await this.bookmarkService.addBookmark(userId, dto);
  }

  @Patch(':id')
  async updateBookmark(
    @Param('id') bookmarkId,
    @GetUser('id') userId: string,
    @Body() dto: EditBookMarkDto,
  ) {
    return await this.bookmarkService.updateBookmark(bookmarkId, userId, dto);
  }

  @Delete(':id')
  async removeBookmark(@Param('id') bookmarkId) {
    return await this.bookmarkService.removeBookmark(bookmarkId);
  }
}
