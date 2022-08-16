import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://voxuanan0307:PCyULGQMfceu7SKA@cluster0.klgfjer.mongodb.net/?retryWrites=true&w=majority',
    ),
    AuthModule,
    UserModule,
    BookmarkModule,
  ],
  controllers: [],
})
export class AppModule {}
