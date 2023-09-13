import { Inject } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { PUB_SUB } from 'src/pub-sub/pub-sub.module';
import Post from './entity/post.entity';

const POST_ADDED_EVENT = 'postAdded';

// Posts.resolver.ts import PostsLoaders which is Request scoped
// Nestjs throws error "PostsResolver" resolver is request or transient-scoped. Resolvers that register subscriptions with the "@Subscription()" decorator must be static (singleton).
// So that create postResolverSubscription.resolver.ts to avoid this error
@Resolver(() => Post)
export class PostsResolverSubscription {
  constructor(@Inject(PUB_SUB) private pubSub: RedisPubSub) {}

  // @Subscription(() => Post, {
  //   filter: (payload, variables) => {
  //     return payload.postAdded.title === 'Hello world!';
  //   },
  // })
  // @Subscription(() => Post, {
  //   resolve: (value) => {
  //     return {
  //       ...value.postAdded,
  //       title: `Title: ${value.postAdded.title}`,
  //     };
  //   },
  // })
  // @Subscription(() => Post, {
  //   filter: function (this: PostsResolver, payload, variables) {
  //     const postsService = this.postsService;
  //     return true;
  //   },
  //   resolve: function (this: PostsResolver, value) {
  //     const postsService = this.postsService;
  //     return {
  //       ...value.postAdded,
  //       title: `Title: ${value.postAdded.title}`,
  //     };
  //   },
  // })
  @Subscription(() => Post)
  postAdded() {
    return this.pubSub.asyncIterator(POST_ADDED_EVENT);
  }
}
