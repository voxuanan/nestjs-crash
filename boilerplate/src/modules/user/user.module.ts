import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';
import { MyCacheModule } from 'src/common/cache/cache.module';
import { RoleModule } from '../role/role.module';
import { AuthModule } from 'src/common/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        MyCacheModule,
        RoleModule,
        AuthModule,
    ],
    controllers: [],
    exports: [UserService],
    providers: [UserService],
})
export class UserModule {}
