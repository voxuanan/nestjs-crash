import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator/getUser.decorator';
import User from 'src/users/entity/user.entity';
import CreatePostDto from './dto/createPost.dto';
import PostsService from './posts.service';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { UserTransformInterceptor } from 'src/users/transforms/user.transform';

@ApiTags('Post')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new UserTransformInterceptor())
@Controller('posts')
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @ApiBody({
    type: CreatePostDto,
  })
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto, @GetUser() user: User) {
    return this.postsService.createPost(post, user);
  }

  @ApiParam({
    name: 'id',
    type: Number,
  })
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    this.postsService.deletePost(id);
  }
}
