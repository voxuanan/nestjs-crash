import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { SettingEntity } from '../entities/setting.entity';

export const GetSetting = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): SettingEntity => {
        const { __setting } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __setting: SettingEntity }>();
        return __setting;
    },
);
