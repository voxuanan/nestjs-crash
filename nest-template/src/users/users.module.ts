import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import User from './entity/user.entity';
import Address from './entity/address.entity';
import PrivateFile from './entity/publicFile.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, PrivateFile]),
    CloudinaryModule,
    StripeModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
