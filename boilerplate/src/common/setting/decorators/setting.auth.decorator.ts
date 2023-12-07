import { UseGuards, applyDecorators } from '@nestjs/common';
import { SettingNotFoundGuard } from 'src/common/setting/guards/setting.not-found.guard';
import { SettingPutToRequestGuard } from 'src/common/setting/guards/setting.put-to-request.guard';
import { SettingAuthGuard } from '../guards/setting.auth.guard';

export function SettingAuthGetGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            SettingPutToRequestGuard,
            SettingNotFoundGuard,
            SettingAuthGuard,
        ),
    );
}

export function SettingAuthUpdateGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            SettingPutToRequestGuard,
            SettingNotFoundGuard,
            SettingAuthGuard,
        ),
    );
}
