import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { MyCacheModule } from 'src/common/cache/cache.module';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity]), MyCacheModule],
    controllers: [],
    exports: [RoleService],
    providers: [RoleService],
})
export class RoleModule {}
