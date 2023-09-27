import { Controller, Delete, Param, UseInterceptors } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { MongoTransactionInterceptor } from 'src/utils/mongoTransaction.interceptor';
import { MongoTransactionParam } from 'src/utils/mongoTransaction.param';
import ParamsWithId from 'src/utils/paramsWithId';
import UsersService from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete(':id')
  async deletePost(@Param() { id }: ParamsWithId) {
    return this.usersService.delete(id);
  }

  @UseInterceptors(MongoTransactionInterceptor)
  @Delete('/delete2/:id')
  async deletePost2(
    @MongoTransactionParam() transaction: ClientSession,
    @Param() { id }: ParamsWithId,
  ) {
    console.log(transaction, id);
    return this.usersService.delete2(id, transaction);
  }
}
