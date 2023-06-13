import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator/getUser.decorator';
import User from 'src/users/entity/user.entity';
import CreatePostDto from './dto/createPost.dto';
import PostsService from './posts.service';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
// import { UserTransformInterceptor } from 'src/users/transforms/user.transform';
import { PaginationParams } from 'src/utils/types/paginationParams';
import { GET_POSTS_CACHE_KEY } from './constant/postsCacheKey.constant';
import { HttpCacheInterceptor } from 'src/utils/interceptors/httpCache.interceptor';

@ApiTags('Post')
@UseInterceptors(ClassSerializerInterceptor)
// @UseInterceptors(new UserTransformInterceptor())
@Controller('posts')
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'offset', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'startId', type: Number, required: false })
  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
  @Get()
  getAllPosts(
    @Query('search') search: string,
    @Query() { offset, limit, startId }: PaginationParams,
  ) {
    if (search) {
      return this.postsService.searchForPosts(search, offset, limit, startId);
    }
    return this.postsService.getPosts(offset, limit, startId);
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
