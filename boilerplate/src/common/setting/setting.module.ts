import { Global, Module } from '@nestjs/common';
import { SettingMiddlewareModule } from 'src/common/setting/middleware/setting.middleware.module';
import { SettingService } from './services/setting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingEntity } from './entities/setting.entity';
import { MyCacheModule } from '../cache/cache.module';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([SettingEntity]),
        SettingMiddlewareModule,
        MyCacheModule,
    ],
    exports: [SettingService],
    providers: [SettingService],
    controllers: [],
})
export class SettingModule {}
