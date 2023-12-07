import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { SettingService } from 'src/common/setting/services/setting.service';
import {
    GetUser,
    UserProtected,
} from 'src/modules/user/decorators/user.decorator';
import {
    SettingAuthGetGuard,
    SettingAuthUpdateGuard,
} from '../decorators/setting.auth.decorator';
import { GetSetting } from '../decorators/setting.decorator';
import {
    SettingAuthGetDoc,
    SettingAuthListDoc,
    SettingAuthUpdateDoc,
} from '../docs/setting.auth.doc';
import { SettingRequestDto } from '../dtos/setting.request.dto';
import { SettingEntity } from '../entities/setting.entity';
import { SettingGetSerialization } from '../serializations/setting.get.serialization';
import { ENUM_SETTING_STATUS_CODE_ERROR } from '../constants/setting.status-code.constant';
import { SettingUpdateValueDto } from '../dtos/setting.update-value.dto';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { SettingListSerialization } from '../serializations/setting.list.serialization';
import { PaginationQuery } from 'src/common/pagination/decorators/pagination.decorator';
import {
    SETTING_DEFAULT_AVAILABLE_ORDER_BY,
    SETTING_DEFAULT_AVAILABLE_SEARCH,
    SETTING_DEFAULT_ORDER_BY,
    SETTING_DEFAULT_ORDER_DIRECTION,
    SETTING_DEFAULT_PER_PAGE,
} from '../constants/setting.list.constant';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { ENUM_CACHE_KEY } from 'src/common/cache/constants/cache.enum.constant';
import { ApplyCache } from 'src/common/cache/decorators/cache.decorator';

@ApiTags('common.auth.setting')
@Controller({
    version: '1',
    path: '/setting',
})
export class SettingAuthController {
    constructor(
        private readonly settingService: SettingService,
        private readonly paginationService: PaginationService,
    ) {}

    @SettingAuthListDoc()
    @ResponsePaging('setting.list', {
        serialization: SettingListSerialization,
    })
    @UserProtected()
    @AuthJwtAccessProtected()
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
        @GetUser() user: UserEntity,
    ): Promise<IResponsePaging> {
        const where: Record<string, any> = _search
            ? _search.map((item) => {
                  return {
                      ...item,
                      user: { id: user.id },
                  };
              })
            : { user: { id: user.id } };

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

    @SettingAuthGetDoc()
    @ApplyCache(ENUM_CACHE_KEY.SETTING, undefined, true)
    @Response('setting.get', {
        serialization: SettingGetSerialization,
    })
    @SettingAuthGetGuard()
    @UserProtected()
    @AuthJwtAccessProtected()
    @RequestParamGuard(SettingRequestDto)
    @Get('get/:setting')
    async get(@GetSetting() setting: SettingEntity): Promise<IResponse> {
        return { data: setting };
    }

    @SettingAuthUpdateDoc()
    @Response('setting.update', {
        serialization: ResponseIdSerialization,
    })
    @SettingAuthUpdateGuard()
    @UserProtected()
    @AuthJwtAccessProtected()
    @RequestParamGuard(SettingRequestDto)
    @Put('/update/:setting')
    async update(
        @GetSetting() setting: SettingEntity,
        @Body()
        body: SettingUpdateValueDto,
    ): Promise<IResponse> {
        const check = await this.settingService.checkValue(
            body.value,
            body.type,
        );
        if (!check) {
            throw new BadRequestException({
                statusCode:
                    ENUM_SETTING_STATUS_CODE_ERROR.SETTING_VALUE_NOT_ALLOWED_ERROR,
                message: 'setting.error.valueNotAllowed',
            });
        }

        await this.settingService.updateValue(setting, body);

        return {
            data: { id: setting.id },
        };
    }
}
