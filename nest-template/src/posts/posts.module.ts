import { CacheModule, Module } from '@nestjs/common';
import PostsController from './posts.controller';
import PostsService from './posts.service';
import Post from './entity/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import PostsSearchService from './postSearch.service';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5,
      max: 100,
    }),
    TypeOrmModule.forFeature([Post]),
    SearchModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsSearchService],
})
export class PostsModule {}
