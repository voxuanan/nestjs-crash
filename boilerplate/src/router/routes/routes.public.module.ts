import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/common/auth/auth.module';
import { FilePublicController } from 'src/common/file/controllers/file.public.controller';
import { FileModule } from 'src/common/file/file.module';
import { MailModule } from 'src/common/mail/mail.module';
import { MessagePublicController } from 'src/common/message/controllers/message.public.controller';
import { SettingPublicController } from 'src/common/setting/controllers/setting.public.controller';
import { HealthPublicController } from 'src/health/controllers/health.public.controller';
import { HealthModule } from 'src/health/health.module';
import { RoleModule } from 'src/modules/role/role.module';
import { SavedSearchController } from 'src/modules/saved-search/controllers/saved-search.controller';
import { SavedSearchModule } from 'src/modules/saved-search/saved-search.module';
import { UserPublicController } from 'src/modules/user/controllers/user.public.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [
        MessagePublicController,
        UserPublicController,
        HealthPublicController,
        SettingPublicController,
        FilePublicController,
        SavedSearchController,
    ],
    providers: [],
    exports: [],
    imports: [
        TerminusModule,
        HealthModule,
        FileModule,
        UserModule,
        AuthModule,
        RoleModule,
        MailModule,
        SavedSearchModule,
    ],
})
export class RoutesPublicModule {}
