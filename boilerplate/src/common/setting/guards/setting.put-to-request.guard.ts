import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SettingEntity } from 'src/common/setting/entities/setting.entity';
import { SettingService } from 'src/common/setting/services/setting.service';

@Injectable()
export class SettingPutToRequestGuard implements CanActivate {
    constructor(private readonly settingService: SettingService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { params } = request;
        const { setting } = params;

        const check: SettingEntity = await this.settingService.findOne({
            where: {
                id: setting,
            },
            relations: ['user'],
            loadRelationIds: true,
        });
        request.__setting = check;

        return true;
    }
}
