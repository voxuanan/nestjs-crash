import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Patch,
    Post,
    UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import {
    AuthJwtAccessProtected,
    AuthJwtPayload,
    AuthJwtRefreshProtected,
    AuthJwtToken,
} from 'src/common/auth/decorators/auth.jwt.decorator';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthAccessPayloadSerialization } from 'src/common/auth/serializations/auth.access-payload.serialization';
import { AuthRefreshPayloadSerialization } from 'src/common/auth/serializations/auth.refresh-payload.serialization';
import { AuthService } from 'src/common/auth/services/auth.service';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { FileRequiredPipe } from 'src/common/file/pipes/file.required.pipe';
import { FileSizeImagePipe } from 'src/common/file/pipes/file.size.pipe';
import { FileTypeImagePipe } from 'src/common/file/pipes/file.type.pipe';
import { FileService } from 'src/common/file/services/file.service';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { SettingService } from 'src/common/setting/services/setting.service';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/modules/role/constants/role.status-code.constant';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/constants/user.status-code.constant';
import { UserService } from 'src/modules/user/services/user.service';
import { DataSource } from 'typeorm';
import { UploadFileSingle } from '../../../common/file/decorators/file.decorator';
import {
    GetUser,
    UserAuthProtected,
    UserProtected,
} from '../decorators/user.decorator';
import {
    UserAuthChangePasswordDoc,
    UserAuthClaimUsernameDoc,
    UserAuthLoginGoogleDoc,
    UserAuthProfileDoc,
    UserAuthRefreshDoc,
    UserAuthUpdateProfileDoc,
    UserAuthUploadProfileDoc,
} from '../docs/user.auth.doc';
import { UserChangePasswordDto } from '../dtos/user.change-password.dto';
import { UserUpdateProfileDto } from '../dtos/user.update-profile.dto';
import { UserUpdateUsernameDto } from '../dtos/user.update-username.dto';
import { UserEntity } from '../entities/user.entity';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { UserProfileSerialization } from '../serializations/user.profile.serialization';
import { UserRefreshSerialization } from '../serializations/user.refresh.serialization';
import { ApplyCache } from 'src/common/cache/decorators/cache.decorator';
import { ENUM_CACHE_KEY } from 'src/common/cache/constants/cache.enum.constant';
import {
    ENUM_AUTH_LOGIN_FROM,
    ENUM_AUTH_LOGIN_WITH,
} from 'src/common/auth/constants/auth.enum.constant';
import { AuthGooglePayloadSerialization } from 'src/common/auth/serializations/auth.google-payload.serialization';
import { AuthGoogleOAuth2Protected } from 'src/common/auth/decorators/auth.google.decorator';

@ApiTags('modules.auth.user')
@Controller({
    version: '1',
    path: '/user',
})
export class UserAuthController {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly settingService: SettingService,
        private readonly fileService: FileService,
    ) {}

    @UserAuthRefreshDoc()
    @Response('user.refresh', { serialization: UserRefreshSerialization })
    @UserAuthProtected()
    @UserProtected()
    @AuthJwtRefreshProtected()
    @HttpCode(HttpStatus.OK)
    @Post('/refresh')
    async refresh(
        @AuthJwtToken() refreshToken: string,
        @AuthJwtPayload<AuthRefreshPayloadSerialization>()
        refreshPayload: AuthRefreshPayloadSerialization,
        @GetUser() user: UserEntity,
    ): Promise<IResponse> {
        const userWithRole: UserEntity = await this.userService.joinWithRole(
            user,
        );
        if (!userWithRole.role.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
                message: 'role.error.inactive',
            });
        }

        const checkPasswordExpired: boolean =
            await this.authService.checkPasswordExpired(user.passwordExpired);

        if (checkPasswordExpired) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_EXPIRED_ERROR,
                message: 'user.error.passwordExpired',
            });
        }

        const payload: UserPayloadSerialization =
            await this.userService.payloadSerialization(userWithRole);
        const tokenType: string = await this.authService.getTokenType();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const payloadAccessToken: AuthAccessPayloadSerialization =
            await this.authService.createPayloadAccessToken(payload, {
                loginDate: refreshPayload.loginDate,
                loginFrom: refreshPayload.loginFrom,
                loginWith: refreshPayload.loginWith,
            });

        const payloadEncryption = await this.authService.getPayloadEncryption();
        let payloadHashedAccessToken: AuthAccessPayloadSerialization | string =
            payloadAccessToken;

        if (payloadEncryption) {
            payloadHashedAccessToken =
                await this.authService.encryptAccessToken(payloadAccessToken);
        }

        const roleType = userWithRole.role.type;
        const accessToken: string = await this.authService.createAccessToken(
            payloadHashedAccessToken,
        );

        return {
            data: {
                tokenType,
                roleType,
                expiresIn,
                accessToken,
                refreshToken,
            },
        };
    }

    @UserAuthChangePasswordDoc()
    @Response('user.changePassword')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/change-password')
    async changePassword(
        @Body() body: UserChangePasswordDto,
        @GetUser() user: UserEntity,
    ): Promise<void> {
        const passwordAttempt: boolean =
            await this.settingService.getPasswordAttempt();
        const maxPasswordAttempt: number =
            await this.settingService.getMaxPasswordAttempt();
        if (passwordAttempt && user.passwordAttempt >= maxPasswordAttempt) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_ATTEMPT_MAX_ERROR,
                message: 'user.error.passwordAttemptMax',
            });
        }

        const matchPassword: boolean = await this.authService.validateUser(
            body.oldPassword,
            user.password,
        );
        if (!matchPassword) {
            await this.userService.increasePasswordAttempt(user);

            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
                message: 'user.error.passwordNotMatch',
            });
        }

        const newMatchPassword: boolean = await this.authService.validateUser(
            body.newPassword,
            user.password,
        );
        if (newMatchPassword) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NEW_MUST_DIFFERENCE_ERROR,
                message: 'user.error.newPasswordMustDifference',
            });
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this.userService.resetPasswordAttempt(user, queryRunner);

            const password: IAuthPassword =
                await this.authService.createPassword(body.newPassword);
            await this.userService.updatePassword(user, password, queryRunner);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException({
                statusCode: ENUM_ERROR_STATUS_CODE_ERROR.ERROR_UNKNOWN,
                message: 'http.serverError.internalServerError',
                _error: err.message,
            });
        } finally {
            await queryRunner.release();
        }

        return;
    }

    @UserAuthProfileDoc()
    @ApplyCache(ENUM_CACHE_KEY.USER, undefined, true)
    @Response('user.profile', {
        serialization: UserProfileSerialization,
    })
    @UserProtected()
    @AuthJwtAccessProtected()
    @Get('/profile')
    async profile(@GetUser() user: UserEntity): Promise<IResponse> {
        const userWithRole: UserEntity = await this.userService.joinWithRole(
            user,
        );
        return { data: userWithRole };
    }

    @UserAuthUpdateProfileDoc()
    @Response('user.updateProfile')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/profile/update')
    async updateProfile(
        @GetUser() user: UserEntity,
        @Body() body: UserUpdateProfileDto,
    ): Promise<void> {
        await this.userService.updateProfile(user, body);

        return;
    }

    @UserAuthClaimUsernameDoc()
    @Response('user.claimUsername')
    @UserProtected()
    @AuthJwtAccessProtected()
    @Patch('/profile/claim-username')
    async claimUsername(
        @GetUser() user: UserEntity,
        @Body() { username }: UserUpdateUsernameDto,
    ): Promise<void> {
        const checkUsername: boolean = await this.userService.exist({
            where: {
                username,
            },
        });
        if (checkUsername) {
            throw new ConflictException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_USERNAME_EXISTS_ERROR,
                message: 'user.error.usernameExist',
            });
        }

        await this.userService.updateUsername(user, { username });

        return;
    }

    @UserAuthUploadProfileDoc()
    @Response('user.upload')
    @UserProtected()
    @AuthJwtAccessProtected()
    @UploadFileSingle('file')
    @HttpCode(HttpStatus.OK)
    @Post('/profile/upload')
    async upload(
        @GetUser() user: UserEntity,
        @UploadedFile(FileRequiredPipe, FileSizeImagePipe, FileTypeImagePipe)
        file: Express.Multer.File,
    ): Promise<void> {
        const result = await this.fileService.uploadFile(file, user);
        if (typeof result === 'string') {
            await this.userService.updatePhoto(user, result);
        } else {
            await this.userService.updatePhoto(
                user,
                `${result.path}/${result.filename}`,
            );
        }

        return;
    }

    @UserAuthLoginGoogleDoc()
    @Response('user.loginGoogle')
    @AuthGoogleOAuth2Protected()
    @Get('/login/google')
    async loginGoogle(
        @AuthJwtPayload<AuthGooglePayloadSerialization>()
        { user: userPayload }: AuthGooglePayloadSerialization,
    ): Promise<IResponse> {
        let user: UserEntity = await this.userService.findOneBy({
            email: userPayload.email,
        });

        if (!user) {
            user = await this.userService.createUserWithGoogle(
                userPayload.email,
                userPayload.googleId,
            );
        }
        if (user.blocked) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_BLOCKED_ERROR,
                message: 'user.error.blocked',
            });
        } else if (user.inactivePermanent) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_PERMANENT_ERROR,
                message: 'user.error.inactivePermanent',
            });
        } else if (!user.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_INACTIVE_ERROR,
                message: 'user.error.inactive',
            });
        }

        const userWithRole: UserEntity = await this.userService.joinWithRole(
            user,
        );
        if (!userWithRole.role.isActive) {
            throw new ForbiddenException({
                statusCode: ENUM_ROLE_STATUS_CODE_ERROR.ROLE_INACTIVE_ERROR,
                message: 'role.error.inactive',
            });
        }

        const payload: UserPayloadSerialization =
            await this.userService.payloadSerialization(userWithRole);
        const tokenType: string = await this.authService.getTokenType();
        const loginDate: Date = await this.authService.getLoginDate();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const payloadAccessToken: AuthAccessPayloadSerialization =
            await this.authService.createPayloadAccessToken(payload, {
                loginWith: ENUM_AUTH_LOGIN_WITH.EMAIL,
                loginFrom: ENUM_AUTH_LOGIN_FROM.GOOGLE,
                loginDate,
            });
        const payloadRefreshToken: AuthRefreshPayloadSerialization =
            await this.authService.createPayloadRefreshToken(
                payload.id,
                payloadAccessToken,
            );

        const payloadEncryption = await this.authService.getPayloadEncryption();
        let payloadHashedAccessToken: AuthAccessPayloadSerialization | string =
            payloadAccessToken;
        let payloadHashedRefreshToken:
            | AuthRefreshPayloadSerialization
            | string = payloadRefreshToken;

        if (payloadEncryption) {
            payloadHashedAccessToken =
                await this.authService.encryptAccessToken(payloadAccessToken);
            payloadHashedRefreshToken =
                await this.authService.encryptRefreshToken(payloadRefreshToken);
        }

        const roleType = userWithRole.role.type;
        const accessToken: string = await this.authService.createAccessToken(
            payloadHashedAccessToken,
        );
        const refreshToken: string = await this.authService.createRefreshToken(
            payloadHashedRefreshToken,
        );

        return {
            data: {
                tokenType,
                roleType,
                expiresIn,
                accessToken,
                refreshToken,
            },
        };
    }
}
