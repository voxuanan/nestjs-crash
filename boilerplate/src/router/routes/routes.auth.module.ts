import { Module } from '@nestjs/common';
import { AuthModule } from 'src/common/auth/auth.module';
import { FileModule } from 'src/common/file/file.module';
import { SettingAuthController } from 'src/common/setting/controllers/setting.auth.controller';
import { UserAuthController } from 'src/modules/user/controllers/user.auth.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [UserAuthController, SettingAuthController],
    providers: [],
    exports: [],
    imports: [UserModule, AuthModule, FileModule],
})
export class RoutesAuthModule {}
