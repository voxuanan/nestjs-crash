import { UseGuards, applyDecorators } from '@nestjs/common';
import { SettingNotFoundGuard } from 'src/common/setting/guards/setting.not-found.guard';
import { SettingPutToRequestGuard } from 'src/common/setting/guards/setting.put-to-request.guard';
import { SettingPublicGuard } from '../guards/setting.public.guard';

export function SettingPublicGetGuard(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            SettingPutToRequestGuard,
            SettingNotFoundGuard,
            SettingPublicGuard,
        ),
    );
}
