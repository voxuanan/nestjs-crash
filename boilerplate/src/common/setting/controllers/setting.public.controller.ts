import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import { SettingService } from 'src/common/setting/services/setting.service';
import { SettingGetSerialization } from '../serializations/setting.get.serialization';
import { SettingPublicGetGuard } from '../decorators/setting.public.decorator';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { SettingRequestDto } from '../dtos/setting.request.dto';
import { GetSetting } from '../decorators/setting.decorator';
import { SettingEntity } from '../entities/setting.entity';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import {
    SettingPublicGetDoc,
    SettingPublicListDoc,
} from '../docs/setting.public.doc';
import { SettingListSerialization } from '../serializations/setting.list.serialization';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';

import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import {
    SETTING_DEFAULT_PER_PAGE,
    SETTING_DEFAULT_ORDER_BY,
    SETTING_DEFAULT_ORDER_DIRECTION,
    SETTING_DEFAULT_AVAILABLE_SEARCH,
    SETTING_DEFAULT_AVAILABLE_ORDER_BY,
} from '../constants/setting.list.constant';
import { IsNull } from 'typeorm';
import { ApplyCache } from 'src/common/cache/decorators/cache.decorator';
import { ENUM_CACHE_KEY } from 'src/common/cache/constants/cache.enum.constant';

@ApiTags('common.public.setting')
@Controller({
    version: '1',
    path: '/setting',
})
export class SettingPublicController {
    constructor(
        private readonly settingService: SettingService,
        private readonly paginationService: PaginationService,
    ) {}

    @SettingPublicListDoc()
    @ResponsePaging('setting.list', {
        serialization: SettingListSerialization,
    })
    @Get('/list')
    async list(
        @PaginationQuery(
            SETTING_DEFAULT_PER_PAGE,
            SETTING_DEFAULT_ORDER_BY,
            SETTING_DEFAULT_ORDER_DIRECTION,
            SETTING_DEFAULT_AVAILABLE_SEARCH,
            SETTING_DEFAULT_AVAILABLE_ORDER_BY,
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
    ): Promise<IResponsePaging> {
        const where: Record<string, any> = _search
            ? _search.map((item) => {
                  return {
                      ...item,
                      user: IsNull(),
                  };
              })
            : { user: IsNull() };

        const [settings, total] = await this.settingService.findAndCount({
            where,
            take: _limit,
            skip: _offset,
            order: _order,
        });

        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit,
        );

        return {
            _pagination: { total, totalPage },
            data: settings,
        };
    }

    @SettingPublicGetDoc()
    @ApplyCache(ENUM_CACHE_KEY.SETTING, undefined, false)
    @Response('setting.get', {
        serialization: SettingGetSerialization,
    })
    @SettingPublicGetGuard()
    @RequestParamGuard(SettingRequestDto)
    @Get('get/:setting')
    async get(@GetSetting() setting: SettingEntity): Promise<IResponse> {
        return { data: setting };
    }
}
