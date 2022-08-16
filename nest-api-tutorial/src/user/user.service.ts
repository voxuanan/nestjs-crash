import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './db/user.model';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly UserModel: Model<User>) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.UserModel.findByIdAndUpdate(
      userId,
      { ...dto },
      { new: true },
    );
    user.hash = '';
    return user;
  }
}
