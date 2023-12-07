import {
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Patch,
    Post,
    Put,
    UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthJwtAdminAccessProtected } from 'src/common/auth/decorators/auth.jwt.decorator';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthService } from 'src/common/auth/services/auth.service';
import { IFileExtract } from 'src/common/file/interfaces/file.interface';
import { FileExtractPipe } from 'src/common/file/pipes/file.extract.pipe';
import { FileRequiredPipe } from 'src/common/file/pipes/file.required.pipe';
import { FileSizeExcelPipe } from 'src/common/file/pipes/file.size.pipe';
import { FileTypeExcelPipe } from 'src/common/file/pipes/file.type.pipe';
import { FileValidationPipe } from 'src/common/file/pipes/file.validation.pipe';
import { ENUM_HELPER_FILE_TYPE } from 'src/common/helper/constants/helper.enum.constant';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import { PolicyAbilityProtected } from 'src/common/policy/decorators/policy.decorator';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import {
    Response,
    ResponseFile,
    ResponsePaging,
} from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { RoleService } from 'src/modules/role/services/role.service';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/user/constants/user.enum.constant';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/constants/user.status-code.constant';
import {
    UserAdminDeleteGuard,
    UserAdminGetGuard,
    UserAdminUpdateActiveGuard,
    UserAdminUpdateBlockedGuard,
    UserAdminUpdateGuard,
    UserAdminUpdateInactiveGuard,
    UserAdminUpdateUnblockGuard,
} from 'src/modules/user/decorators/user.admin.decorator';
import { GetUser } from 'src/modules/user/decorators/user.decorator';
import { UserCreateDto } from 'src/modules/user/dtos/user.create.dto';
import { UserRequestDto } from 'src/modules/user/dtos/user.request.dto';
import { UserGetSerialization } from 'src/modules/user/serializations/user.get.serialization';
import { UserService } from 'src/modules/user/services/user.service';
import { UploadFileSingle } from '../../../common/file/decorators/file.decorator';
import {
    UserAdminActiveDoc,
    UserAdminBlockedDoc,
    UserAdminCreateDoc,
    UserAdminDeleteDoc,
    UserAdminExportDoc,
    UserAdminGetDoc,
    UserAdminImportDoc,
    UserAdminInactiveDoc,
    UserAdminListDoc,
    UserAdminUnblockDoc,
    UserAdminUpdateDoc,
} from '../docs/user.admin.doc';
import { UserImportDto } from '../dtos/user.import.dto';
import { UserUpdateProfileDto } from '../dtos/user.update-profile.dto';
import { UserEntity } from '../entities/user.entity';
import { UserListSerialization } from '../serializations/user.list.serialization';
import {
    USER_DEFAULT_AVAILABLE_ORDER_BY,
    USER_DEFAULT_AVAILABLE_SEARCH,
    USER_DEFAULT_BLOCKED,
    USER_DEFAULT_INACTIVE_PERMANENT,
    USER_DEFAULT_IS_ACTIVE,
    USER_DEFAULT_ORDER_BY,
    USER_DEFAULT_ORDER_DIRECTION,
    USER_DEFAULT_PER_PAGE,
} from '../constants/user.list.constant';
import { PaginationListDto } from 'src/common/pagination/dtos/pagination.list.dto';
import {
    PaginationQuery,
    PaginationQueryFilterEqualId,
    PaginationQueryFilterInBoolean,
} from 'src/common/pagination/decorators/pagination.decorator';
import { PaginationService } from 'src/common/pagination/services/pagination.service';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/modules/role/constants/role.status-code.constant';
import { ApplyCache } from 'src/common/cache/decorators/cache.decorator';
import { ENUM_CACHE_KEY } from 'src/common/cache/constants/cache.enum.constant';

@ApiTags('modules.admin.user')
@Controller({
    version: '1',
    path: '/user',
})
export class UserAdminController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly paginationService: PaginationService,
    ) {}

    @UserAdminListDoc()
    @ApplyCache(ENUM_CACHE_KEY.USER, undefined, false)
    @ResponsePaging('user.list', {
        serialization: UserListSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @Get('/list')
    async list(
        @PaginationQuery(
            USER_DEFAULT_PER_PAGE,
            USER_DEFAULT_ORDER_BY,
            USER_DEFAULT_ORDER_DIRECTION,
            USER_DEFAULT_AVAILABLE_SEARCH,
            USER_DEFAULT_AVAILABLE_ORDER_BY,
        )
        { _search, _limit, _offset, _order }: PaginationListDto,
        @PaginationQueryFilterInBoolean('isActive', USER_DEFAULT_IS_ACTIVE)
        isActive: Record<string, any>,
        @PaginationQueryFilterInBoolean('blocked', USER_DEFAULT_BLOCKED)
        blocked: Record<string, any>,
        @PaginationQueryFilterInBoolean(
            'inactivePermanent',
            USER_DEFAULT_INACTIVE_PERMANENT,
        )
        inactivePermanent: Record<string, any>,
        @PaginationQueryFilterEqualId('role')
        role: Record<string, any>,
    ): Promise<any> {
        const find: Record<string, any> = {
            ...isActive,
            ...blocked,
            ...inactivePermanent,
            ...role,
        };

        const where: Record<string, any> = _search
            ? _search.map((item) => {
                  return {
                      ...item,
                      ...find,
                  };
              })
            : { ...find };

        const [users, total] = await this.userService.findAndCount({
            where,
            take: _limit,
            skip: _offset,
            order: _order,
            relations: ['role'],
        });
        const totalPage: number = this.paginationService.totalPage(
            total,
            _limit,
        );

        return {
            _pagination: { total: total, totalPage },
            data: users,
        };
    }

    @UserAdminGetDoc()
    @ApplyCache(ENUM_CACHE_KEY.USER, undefined, false)
    @Response('user.get', {
        serialization: UserGetSerialization,
    })
    @UserAdminGetGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @Get('/get/:user')
    async get(@GetUser() user: UserEntity): Promise<IResponse> {
        const userWithRole: UserEntity = await this.userService.joinWithRole(
            user,
        );
        return { data: userWithRole };
    }

    @UserAdminCreateDoc()
    @Response('user.create', {
        serialization: ResponseIdSerialization,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.CREATE],
    })
    @AuthJwtAdminAccessProtected()
    @Post('/create')
    async create(
        @Body()
        { email, mobileNumber, role, ...body }: UserCreateDto,
    ): Promise<IResponse> {
        const promises: Promise<any>[] = [
            this.roleService.findOneBy({ id: role }),
            this.userService.exist({ where: { email } }),
        ];

        if (mobileNumber) {
            promises.push(this.userService.exist({ where: { mobileNumber } }));
        }

        const [checkRole, emailExist, mobileNumberExist] = await Promise.all(
            promises,
        );

        if (!checkRole) {
            throw new NotFoundException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_NOT_FOUND_ERROR,
                message: 'role.error.notFound',
            });
        } else if (emailExist) {
            throw new ConflictException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
                message: 'user.error.emailExist',
            });
        } else if (mobileNumberExist) {
            throw new ConflictException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
                message: 'user.error.mobileNumberExist',
            });
        }

        const password: IAuthPassword = await this.authService.createPassword(
            body.password,
        );

        const created: UserEntity = await this.userService.create(
            {
                email,
                mobileNumber,
                signUpFrom: ENUM_USER_SIGN_UP_FROM.ADMIN,
                role,
                ...body,
            },
            password,
        );

        return {
            data: { id: created.id },
        };
    }

    @UserAdminUpdateDoc()
    @Response('user.update', {
        serialization: ResponseIdSerialization,
    })
    @UserAdminUpdateGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @Put('/update/:user')
    async update(
        @GetUser() user: UserEntity,
        @Body()
        body: UserUpdateProfileDto,
    ): Promise<IResponse> {
        await this.userService.updateProfile(user, body);

        return {
            data: { id: user.id },
        };
    }

    @UserAdminInactiveDoc()
    @Response('user.inactive')
    @UserAdminUpdateInactiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @Patch('/update/:user/inactive')
    async inactive(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.inactive(user);

        return;
    }

    @UserAdminActiveDoc()
    @Response('user.active')
    @UserAdminUpdateActiveGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @Patch('/update/:user/active')
    async active(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.active(user);

        return;
    }

    @UserAdminBlockedDoc()
    @Response('user.blocked')
    @UserAdminUpdateBlockedGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @Patch('/update/:user/blocked')
    async blocked(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.blocked(user);

        return;
    }

    @UserAdminUnblockDoc()
    @Response('user.unblocked')
    @UserAdminUpdateUnblockGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.UPDATE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @Patch('/update/:user/unblocked')
    async unblocked(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.unblocked(user);

        return;
    }

    @UserAdminDeleteDoc()
    @Response('user.delete')
    @UserAdminDeleteGuard()
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.DELETE],
    })
    @AuthJwtAdminAccessProtected()
    @RequestParamGuard(UserRequestDto)
    @Delete('/delete/:user')
    async delete(@GetUser() user: UserEntity): Promise<void> {
        await this.userService.remove(user);

        return;
    }

    @UserAdminImportDoc()
    @Response('user.import')
    @UploadFileSingle('file')
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [
            ENUM_POLICY_ACTION.READ,
            ENUM_POLICY_ACTION.CREATE,
            ENUM_POLICY_ACTION.IMPORT,
        ],
    })
    @AuthJwtAdminAccessProtected()
    @Post('/import')
    async import(
        @UploadedFile(
            FileRequiredPipe,
            FileSizeExcelPipe,
            FileTypeExcelPipe,
            FileExtractPipe,
            new FileValidationPipe<UserImportDto>(UserImportDto),
        )
        file: IFileExtract<UserImportDto>,
    ): Promise<void> {
        const role: RoleEntity = await this.roleService.findOneBy({
            name: 'user',
        });

        const passwordString: string =
            await this.authService.createPasswordRandom();
        const password: IAuthPassword = await this.authService.createPassword(
            passwordString,
        );

        await this.userService.import(file.dto, role.id, password);

        return;
    }

    @UserAdminExportDoc()
    @ResponseFile({
        serialization: UserListSerialization,
        fileType: ENUM_HELPER_FILE_TYPE.CSV,
    })
    @PolicyAbilityProtected({
        subject: ENUM_POLICY_SUBJECT.USER,
        action: [ENUM_POLICY_ACTION.READ, ENUM_POLICY_ACTION.EXPORT],
    })
    @AuthJwtAdminAccessProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/export')
    async export(): Promise<IResponse> {
        const users: UserEntity[] = await this.userService.findAll({});

        return { data: users };
    }
}
