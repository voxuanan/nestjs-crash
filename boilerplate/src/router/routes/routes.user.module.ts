import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';

@Module({
    controllers: [],
    providers: [],
    exports: [],
    imports: [UserModule],
})
export class RoutesUserModule {}
