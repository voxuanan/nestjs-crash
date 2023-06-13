import Category from '../../categories/entity/category';
import User from '../../users/entity/user.entity';
import Comment from '../../comments/entity/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
class Post {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public title: string;

  @Field(() => [String])
  @Column('text', { array: true })
  public paragraphs: string[];

  @Field(() => Int)
  @RelationId((post: Post) => post.author)
  public authorId: number;

  @Field(() => User)
  @Index('post_authorId_index')
  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[];

  @OneToMany(() => Comment, (comment: Comment) => comment.post)
  public comments: Comment[];

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Field({ nullable: true })
  @Column({
    type: 'timestamp',
    nullable: true,
  })
  scheduledDate?: Date;
}

export default Post;
