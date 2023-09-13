import {
  Args,
  Context,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import PostsService from './posts.service';
import Post from './entity/post.entity';
import { Global, Inject, UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from 'src/authentication/guard/graphql-jwt-auth.guard';
import { CreatePostInput } from './inputs/post.input';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';
import PostsLoaders from './loaders/posts.loaders';
import { GraphQLResolveInfo } from 'graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';
import { PUB_SUB } from 'src/pub-sub/pub-sub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import User from 'src/users/entity/user.entity';

const POST_ADDED_EVENT = 'postAdded';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
    private postsLoaders: PostsLoaders,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
  ) {}

  // // Deadling with N+1 problem (way2)
  // @Query(() => [Post])
  // async posts(@Info() info: GraphQLResolveInfo) {
  //   const parsedInfo = parseResolveInfo(info) as ResolveTree;
  //   const simplifiedInfo = simplifyParsedResolveInfoFragmentWithType(
  //     parsedInfo,
  //     info.returnType,
  //   );

  //   const posts =
  //     'author' in simplifiedInfo.fields
  //       ? await this.postsService.getPostsWithAuthors()
  //       : await this.postsService.getPosts();

  //   return posts.items;
  // }

  //  Dealing with N+1 problem (way1)
  @Query(() => [Post])
  async posts() {
    const posts = await this.postsService.getPosts();
    return posts.items;
  }

  // Dealing with N+1 problem (way1)
  @ResolveField('author', () => User)
  async getAuthor(@Parent() post: Post) {
    const { authorId } = post;

    return this.postsLoaders.batchAuthors.load(authorId);
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    const newPost = await this.postsService.createPost(
      createPostInput,
      context.req.user,
    );
    this.pubSub.publish(POST_ADDED_EVENT, { postAdded: newPost });
    return newPost;
  }
}
