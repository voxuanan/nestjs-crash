import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './address.entity';
import Post from '../../posts/entity/post.entity';
import PublicFile from './publicFile.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  public id?: number;

  @Field()
  @Column({ unique: true })
  public email: string;

  @Field()
  @Column({ default: false })
  public isEmailConfirmed: boolean;

  @Field()
  @Column({ nullable: true })
  public phoneNumber?: string;

  @Field()
  @Column({ default: false })
  public isPhoneNumberConfirmed: boolean;

  @Field()
  @Column()
  public name: string;

  @Column({ unique: true, nullable: true })
  public firebaseUid?: string;

  @Column({ nullable: true })
  @Exclude()
  public password?: string;

  @Column({ default: false })
  public isRegisterWithFirebase: boolean;

  @Column()
  public stripeCustomerId: string;

  @Column({ nullable: true })
  public monthlySubscriptionStatus?: string;

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];

  // @OneToMany(() => PrivateFile, (file: PrivateFile) => file.owner)
  // public files: PrivateFile[];

  @JoinColumn()
  @OneToOne(() => PublicFile, {
    eager: true,
    nullable: true,
  })
  public avatar?: PublicFile;
}

export default User;
