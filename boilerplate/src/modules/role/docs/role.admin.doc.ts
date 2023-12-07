import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocGuard,
    DocResponse,
    DocResponsePaging,
} from 'src/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { RoleCreateDto } from 'src/modules/role/dtos/role.create.dto';
import { RoleUpdateDto } from 'src/modules/role/dtos/role.update.dto';
import { RoleGetSerialization } from 'src/modules/role/serializations/role.get.serialization';
import { RoleListSerialization } from 'src/modules/role/serializations/role.list.serialization';
import {
    RoleDocParamsId,
    RoleDocQueryIsActive,
    RoleDocQueryType,
} from '../constants/role.doc.constant';
import { RoleUpdatePermissionDto } from '../dtos/role.update-permission.dto';

export function RoleAdminListDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.admin.role',
        }),
        DocRequest({
            queries: [...RoleDocQueryIsActive, ...RoleDocQueryType],
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponsePaging<RoleListSerialization>('role.list', {
            serialization: RoleListSerialization,
        }),
    );
}

export function RoleAdminGetDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.admin.role',
        }),
        DocRequest({
            params: RoleDocParamsId,
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<RoleGetSerialization>('role.get', {
            serialization: RoleGetSerialization,
        }),
    );
}

export function RoleAdminCreateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.admin.role',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: RoleCreateDto,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('role.create', {
            httpStatus: HttpStatus.CREATED,
            serialization: ResponseIdSerialization,
        }),
    );
}

export function RoleAdminActiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.admin.role',
        }),
        DocRequest({
            params: RoleDocParamsId,
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse('role.active'),
    );
}

export function RoleAdminInactiveDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.admin.role',
        }),
        DocRequest({
            params: RoleDocParamsId,
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse('role.inactive'),
    );
}

export function RoleAdminUpdateDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.admin.role',
        }),
        DocRequest({
            params: RoleDocParamsId,
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: RoleUpdateDto,
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('role.update', {
            serialization: ResponseIdSerialization,
        }),
    );
}
export function RoleAdminUpdatePermisionDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.admin.role',
        }),
        DocRequest({
            params: RoleDocParamsId,
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: RoleUpdatePermissionDto,
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse<ResponseIdSerialization>('role.updatePermission', {
            serialization: ResponseIdSerialization,
        }),
    );
}

export function RoleAdminDeleteDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.admin.role',
        }),
        DocRequest({
            params: RoleDocParamsId,
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocGuard({ role: true, policy: true }),
        DocResponse('role.delete'),
    );
}
