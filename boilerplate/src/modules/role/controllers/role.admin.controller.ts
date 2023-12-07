import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { ENUM_CACHE_KEY } from 'src/common/cache/constants/cache.enum.constant';
import { ApplyCache } from 'src/common/cache/decorators/cache.decorator';
import {
    PaginationQuery,
    PaginationQueryFilterInBoolean,
    PaginationQueryFilterInEnum,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
    Response,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import {
    IResponse,
    IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/services/user.service';
import { ENUM_ROLE_TYPE } from '../constants/role.enum.constant';
import {
    ROLE_DEFAULT_AVAILABLE_ORDER_BY,
    ROLE_DEFAULT_AVAILABLE_SEARCH,
    ROLE_DEFAULT_IS_ACTIVE,
    ROLE_DEFAULT_ORDER_BY,
    ROLE_DEFAULT_ORDER_DIRECTION,
    ROLE_DEFAULT_PER_PAGE,
    ROLE_DEFAULT_TYPE,
} from '../constants/role.list.constant';
import { ENUM_ROLE_STATUS_CODE_ERROR } from '../constants/role.status-code.constant';
import {
    RoleAdminDeleteGuard,
    RoleAdminGetGuard,
    RoleAdminUpdateActiveGuard,
    RoleAdminUpdateGuard,
    RoleAdminUpdateInactiveGuard,
} from '../decorators/role.admin.decorator';
import { GetRole } from '../decorators/role.decorator';
import {
    RoleAdminActiveDoc,
    RoleAdminCreateDoc,
    RoleAdminDeleteDoc,
    RoleAdminGetDoc,
    RoleAdminInactiveDoc,
    RoleAdminListDoc,
    RoleAdminUpdateDoc,
    RoleAdminUpdatePermisionDoc,
} from '../docs/role.admin.doc';
import { RoleCreateDto } from '../dtos/role.create.dto';
import { RoleRequestDto } from '../dtos/role.request.dto';
import { RoleUpdatePermissionDto } from '../dtos/role.update-permission.dto';
import { RoleUpdateDto } from '../dtos/role.update.dto';
import { RoleEntity } from '../entities/role.entity';
import { RolePermissionsPipe } from '../pipes/role.permisssions.pipe';
import { RoleGetSerialization } from '../serializations/role.get.serialization';
import { RoleListSerialization } from '../serializations/role.list.serialization';
import { RoleService } from '../services/role.service';

@ApiTags('modules.admin.role')
@Controller({
    version: '1',
    path: '/role',
})
export class RoleAdminController {
    constructor(
        private readonly roleService: RoleService,
        private readonly userService: UserService,
        private readonly paginationService: PaginationService,
    ) {}

    @RoleAdminListDoc()
    @ApplyCache(ENUM_CACHE_KEY.ROLE, undefined, false)
    @ResponsePaging('role.list', {
        serialization: RoleListSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.ROLE,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @Get('/list')
    async list(
        @PaginationQuery(
            ROLE_DEFAULT_PER_PAGE,
            ROLE_DEFAULT_ORDER_BY,
            ROLE_DEFAULT_ORDER_DIRECTION,
            ROLE_DEFAULT_AVAILABLE_SEARCH,
            ROLE_DEFAULT_AVAILABLE_ORDER_BY,
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInBoolean('isActive', ROLE_DEFAULT_IS_ACTIVE)
        isActive: Record<string, any>,
        @PaginationQueryFilterInEnum('type', ROLE_DEFAULT_TYPE, ENUM_ROLE_TYPE)
        type: Record<string, any>,
    ): Promise<IResponsePaging> {
        const find: Record<string, any> = {
            ...isActive,
            ...type,
        };

        const where: Record<string, any> = _search
            ? _search.map((item) => {
                  return {
                      ...item,
                      ...find,
                  };
              })
            : { ...find };

        const [roles, total] = await this.roleService.findAndCount({
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
            data: roles,
        };
    }

    @RoleAdminGetDoc()
    @ApplyCache(ENUM_CACHE_KEY.ROLE, undefined, false)
    @Response('role.get', {
        serialization: RoleGetSerialization,
    })
    @RoleAdminGetGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.ROLE,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(RoleRequestDto)
    @Get('get/:role')
    async get(@GetRole() role: RoleEntity): Promise<IResponse> {
        return { data: role };
    }

    @RoleAdminCreateDoc()
    @Response('role.create', {
        serialization: ResponseIdSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.ROLE,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    })
    @AuthJwtAdminAccessProtected()
    @UsePipes(new RolePermissionsPipe<RoleCreateDto>())
    @Post('/create')
    async create(
        @Body()
        {
            name,
            description,
            type,
            permissions,
        }: Omit<RoleCreateDto, 'permissions'> & {
            permissions: string;
        },
    ): Promise<IResponse> {
        const exist: boolean = await this.roleService.exist({
            where: { name },
        });
        if (exist) {
            throw new ConflictException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_EXIST_ERROR,
                message: 'role.error.exist',
            });
        }

        const create = await this.roleService.create({
            name,
            description,
            type,
            permissions,
        });

        return {
            data: { id: create.id },
        };
    }

    @RoleAdminUpdateDoc()
    @Response('role.update', {
        serialization: ResponseIdSerialization,
    })
    @RoleAdminUpdateGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.ROLE,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(RoleRequestDto)
    @Put('/update/:role')
    async update(
        @GetRole() role: RoleEntity,
        @Body()
        { description }: RoleUpdateDto,
    ): Promise<IResponse> {
        await this.roleService.update(role, { description });

        return {
            data: { id: role.id },
        };
    }

    @RoleAdminUpdatePermisionDoc()
    @Response('role.updatePermission', {
        serialization: ResponseIdSerialization,
    })
    @RoleAdminUpdateGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.ROLE,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(RoleRequestDto)
    @UsePipes(new RolePermissionsPipe<RoleUpdatePermissionDto>())
    @Put('/update/:role/permission')
    async updatePermission(
        @GetRole() role: RoleEntity,
        @Body()
        data: Omit<RoleUpdatePermissionDto, 'permissions'> & {
            permissions: string;
        },
    ): Promise<IResponse> {
        await this.roleService.updatePermissions(role, data);

        return {
            data: { id: role.id },
        };
    }

    @RoleAdminDeleteDoc()
    @Response('role.delete')
    @RoleAdminDeleteGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.ROLE,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(RoleRequestDto)
    @Delete('/delete/:role')
    async delete(@GetRole() role: RoleEntity): Promise<void> {
        const used: UserEntity = await this.userService.findOneBy({
            role: {
                id: role.id,
            },
        });
        if (used) {
            throw new ConflictException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_USED_ERROR,
                message: 'role.error.used',
            });
        }

        await this.roleService.remove(role);

        return;
    }

    @RoleAdminInactiveDoc()
    @Response('role.inactive')
    @RoleAdminUpdateInactiveGuard()
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(RoleRequestDto)
    @Patch('/update/:role/inactive')
    async inactive(@GetRole() role: RoleEntity): Promise<void> {
        await this.roleService.inactive(role);

        return;
    }

    @RoleAdminActiveDoc()
    @Response('role.active')
    @RoleAdminUpdateActiveGuard()
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(RoleRequestDto)
    @Patch('/update/:role/active')
    async active(@GetRole() role: RoleEntity): Promise<void> {
        await this.roleService.active(role);

        return;
    }
}
