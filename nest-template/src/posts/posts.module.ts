import { Module } from '@nestjs/common';
import PostsController from './posts.controller';
import PostsService from './posts.service';
import Post from './entity/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostsSearchService from './postSearch.service';
import { SearchModule } from 'src/search/search.module';
import { PostsResolver } from './posts.resolver';
import { UsersModule } from 'src/users/users.module';
import PostsLoaders from './loaders/posts.loaders';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Post]), SearchModule],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService, PostsResolver, PostsLoaders],
})
export class PostsModule {}
