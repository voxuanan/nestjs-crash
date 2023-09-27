import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument, User } from './entity/user.schema';
import CreateUserDto from './dto/createUser.dto';
import PostsService from '../posts/posts.service';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly postsService: PostsService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).populate({
      path: 'posts',
      populate: {
        path: 'categories',
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id).populate({
      path: 'posts',
      populate: {
        path: 'categories',
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(userData: CreateUserDto) {
    const createdUser = new this.userModel(userData);
    await createdUser
      .populate({
        path: 'posts',
        populate: {
          path: 'categories',
        },
      })
      .execPopulate();
    return createdUser.save();
  }

  async delete(userId: string) {
    const session = await this.connection.startSession();

    console.log('session', session);
    session.startTransaction();
    console.log('session', session);
    try {
      const user = await this.userModel
        .findByIdAndDelete(userId)
        .populate('posts')
        .session(session);

      if (!user) {
        throw new NotFoundException();
      }
      const posts = user.posts;

      await this.postsService.deleteMany(
        posts.map((post) => post._id.toString()),
        session,
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async delete2(userId: string, transaction: mongoose.ClientSession) {
    const user = await this.userModel
      .findByIdAndDelete(userId)
      .populate('posts')
      .session(transaction);
    if (!user) {
      throw new NotFoundException();
    }
    const posts = user.posts;
    await this.postsService.deleteMany(
      posts.map((post) => post._id.toString() + 1, transaction),
    );
  }
}

export default UsersService;
