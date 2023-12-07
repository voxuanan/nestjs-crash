import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
    DocAuth,
    DocDefault,
    DocGuard,
} from 'src/common/doc/decorators/doc.decorator';
import {
    Doc,
    DocErrorGroup,
    DocRequest,
    DocResponse,
    DocResponsePaging,
} from 'src/common/doc/decorators/doc.decorator';

import { SettingGetSerialization } from 'src/common/setting/serializations/setting.get.serialization';
import { SettingListSerialization } from 'src/common/setting/serializations/setting.list.serialization';
import { SettingDocParamsId } from '../constants/setting.doc.constant';
import { ENUM_SETTING_STATUS_CODE_ERROR } from '../constants/setting.status-code.constant';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';

export function SettingAuthListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'common.auth.setting',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocResponsePaging<SettingListSerialization>('setting.list', {
            serialization: SettingListSerialization,
        }),
    );
}

export function SettingAuthGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.auth.setting' }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            params: SettingDocParamsId,
        }),
        DocResponse<SettingGetSerialization>('setting.get', {
            serialization: SettingGetSerialization,
        }),
        DocErrorGroup([
            DocDefault({
                httpStatus: HttpStatus.NOT_FOUND,
                statusCode:
                    ENUM_SETTING_STATUS_CODE_ERROR.SETTING_NOT_FOUND_ERROR,
                messagePath: 'setting.error.notFound',
            }),
        ]),
    );
}

export function SettingAuthUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({ operation: 'common.admin.setting' }),
        DocRequest({
            params: SettingDocParamsId,
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocResponse<ResponseIdSerialization>('setting.update', {
            serialization: ResponseIdSerialization,
        }),
        DocErrorGroup([
            DocDefault({
                httpStatus: HttpStatus.NOT_FOUND,
                statusCode:
                    ENUM_SETTING_STATUS_CODE_ERROR.SETTING_NOT_FOUND_ERROR,
                messagePath: 'setting.error.notFound',
            }),
            DocDefault({
                httpStatus: HttpStatus.BAD_REQUEST,
                statusCode:
                    ENUM_SETTING_STATUS_CODE_ERROR.SETTING_VALUE_NOT_ALLOWED_ERROR,
                messagePath: 'setting.error.valueNotAllowed',
            }),
        ]),
    );
}
