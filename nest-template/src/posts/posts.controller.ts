import { number } from '@hapi/joi';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import CreatePostDto from './dto/createPost.dto';
import PostsService from './posts.service';

@ApiTags('Post')
@Controller('posts')
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @ApiParam({
    name: 'id',
    type: number,
  })
  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @ApiBody({
    type: CreatePostDto,
  })
  @Post()
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }

  @ApiParam({
    name: 'id',
    type: number,
  })
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    this.postsService.deletePost(id);
  }
}
