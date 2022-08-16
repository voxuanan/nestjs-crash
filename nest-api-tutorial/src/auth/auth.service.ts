import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/db/user.model';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<User>,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signup(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
  ) {
    const hash = await argon.hash(password);
    const newUser = new this.UserModel({
      email,
      hash,
      firstname,
      lastname,
    });
    await newUser.save();
    return this.signToken(newUser._id, newUser.email);
  }

  async login(email: string, password: string) {
    const user = await this.UserModel.findOne({
      email,
    }).exec();
    if (!user) throw new ForbiddenException('No user found!');
    const isPasswordMatch = await argon.verify(user.hash, password);
    if (!isPasswordMatch)
      throw new ForbiddenException('Password is incorrect!');
    return this.signToken(user._id, user.email);
  }

  async signToken(userId: number, email: string) {
    const secret = this.config.get('JWT_SECRET');
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
    return {
      access_token: token,
    };
  }
}
