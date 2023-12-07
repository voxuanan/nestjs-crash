import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
} from '@nestjs/common';
import { ENUM_SETTING_STATUS_CODE_ERROR } from '../constants/setting.status-code.constant';

@Injectable()
export class SettingAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { __setting, __user } = context.switchToHttp().getRequest();

        if (!__setting.user || __setting.user !== __user.id) {
            throw new BadRequestException({
                statusCode: ENUM_SETTING_STATUS_CODE_ERROR.SETTING_NOT_PUBLIC,
                message: 'setting.error.notBelongToUser',
            });
        }

        return true;
    }
}
