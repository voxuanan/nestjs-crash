import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { RoleModule } from 'src/modules/role/role.module';
import { MigrationRoleSeed } from 'src/migration/seeds/migration.role.seed';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/modules/user/user.module';
import { MigrationUserSeed } from './seeds/migration.user.seed';
import { AuthModule } from 'src/common/auth/auth.module';
import { MigrationSettingSeed } from './seeds/migration.setting.seed';

@Module({
    imports: [CommandModule, CommonModule, AuthModule, RoleModule, UserModule],
    providers: [MigrationRoleSeed, MigrationUserSeed, MigrationSettingSeed],
    exports: [],
})
export class MigrationModule {}
