import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import User from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    done(null, user.id);
  }

  // determines the data stored inside of the session
  async deserializeUser(userId: string, done: CallableFunction) {
    const user = await this.usersService.getById(Number(userId));
    done(null, user);
  }
}
