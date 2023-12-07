import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Optional,
    Post,
    Req,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { InjectDataSource } from '@nestjs/typeorm';
import {
    ENUM_AUTH_LOGIN_FROM,
    ENUM_AUTH_LOGIN_WITH,
} from 'src/common/auth/constants/auth.enum.constant';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { AuthAccessPayloadSerialization } from 'src/common/auth/serializations/auth.access-payload.serialization';
import { AuthRefreshPayloadSerialization } from 'src/common/auth/serializations/auth.refresh-payload.serialization';
import { AuthService } from 'src/common/auth/services/auth.service';
import { ApplyHttpDebuggers } from 'src/common/debugger/decorators/debugger.decorator';
import { ENUM_ERROR_STATUS_CODE_ERROR } from 'src/common/error/constants/error.status-code.constant';
import { MailConsumer } from 'src/common/mail/processors/mail.processor';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { Response } from 'src/common/response/decorators/response.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { SettingService } from 'src/common/setting/services/setting.service';
import { ENUM_ROLE_STATUS_CODE_ERROR } from 'src/modules/role/constants/role.status-code.constant';
import { RoleService } from 'src/modules/role/services/role.service';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/user/constants/user.enum.constant';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/user/constants/user.status-code.constant';
import {
    UserPublicForgotPasswordDoc,
    UserPublicLoginDoc,
    UserPublicResetPasswordDoc,
    UserPublicSignUpDoc,
} from 'src/modules/user/docs/user.public.doc';
import { UserSignUpDto } from 'src/modules/user/dtos/user.sign-up.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { DataSource } from 'typeorm';
import { UserForgotPasswordDto } from '../dtos/user.forgot-password.dto';
import { UserLoginDto } from '../dtos/user.login.dto';
import { UserResetPasswordDto } from '../dtos/user.reset-password.dto';
import { UserEntity } from '../entities/user.entity';
import { UserLoginSerialization } from '../serializations/user.login.serialization';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { DebuggerService } from 'src/common/debugger/services/debugger.service';

@ApiTags('modules.public.user')
@Controller({
    version: '1',
    path: '/user',
})
// @ApplyHttpDebuggers()
export class UserPublicController {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource,
        @Optional() private readonly debuggerService: DebuggerService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly roleService: RoleService,
        private readonly settingService: SettingService,
        private readonly mailConsumer: MailConsumer,
        private readonly configService: ConfigService,
    ) {}

    @UserPublicSignUpDoc()
    @Response('user.signUp')
    @Post('/sign-up')
    async signUp(
        @Body()
        { email, mobileNumber, ...body }: UserSignUpDto,
    ): Promise<void> {
        const promises: Promise<any>[] = [
            this.roleService.findOneBy({ name: 'user' }),
            this.userService.exist({ where: { email } }),
        ];

        if (mobileNumber) {
            promises.push(this.userService.exist({ where: { mobileNumber } }));
        }

        const [role, emailExist, mobileNumberExist] = await Promise.all(
            promises,
        );

        if (emailExist) {
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

        const password = await this.authService.createPassword(body.password);

        await this.userService.create(
            {
                email,
                mobileNumber,
                signUpFrom: ENUM_USER_SIGN_UP_FROM.PUBLIC,
                role: role.id,
                ...body,
            },
            password,
        );

        return;
    }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UserPublicLoginDoc()
    @Response('user.login', {
        serialization: UserLoginSerialization,
    })
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(
        @Body() { email, password }: UserLoginDto,
        @Req() req: IRequestApp,
    ): Promise<IResponse> {
        const user: UserEntity = await this.userService.findOneBy({ email });
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }
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

        const validate: boolean = await this.authService.validateUser(
            password,
            user.password,
        );

        if (!validate) {
            await this.userService.increasePasswordAttempt(user);

            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_NOT_MATCH_ERROR,
                message: 'user.error.passwordNotMatch',
            });
        } else if (user.blocked) {
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

        await this.userService.resetPasswordAttempt(user);

        const payload: UserPayloadSerialization =
            await this.userService.payloadSerialization(userWithRole);
        const tokenType: string = await this.authService.getTokenType();
        const expiresIn: number =
            await this.authService.getAccessTokenExpirationTime();
        const loginDate: Date = await this.authService.getLoginDate();
        const payloadAccessToken: AuthAccessPayloadSerialization =
            await this.authService.createPayloadAccessToken(payload, {
                loginWith: ENUM_AUTH_LOGIN_WITH.EMAIL,
                loginFrom: ENUM_AUTH_LOGIN_FROM.PASSWORD,
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

        const checkPasswordExpired: boolean =
            await this.authService.checkPasswordExpired(user.passwordExpired);

        if (checkPasswordExpired) {
            throw new ForbiddenException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_PASSWORD_EXPIRED_ERROR,
                message: 'user.error.passwordExpired',
            });
        }

        // this.debuggerService.info(
        //     req.__id,
        //     {
        //         description: 'test',
        //         class: req.__class,
        //         function: req.__function,
        //         path: req.path,
        //     },
        //     {
        //         tokenType,
        //         roleType,
        //         expiresIn,
        //         accessToken,
        //         refreshToken,
        //     },
        // );

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

    @Throttle({ default: { limit: 2, ttl: 60000 } })
    @UserPublicForgotPasswordDoc()
    @HttpCode(HttpStatus.OK)
    @Response('user.forgotPassword')
    @Post('/forgot-password')
    async forgotPassword(
        @Body()
        { email }: UserForgotPasswordDto,
        @Req() req: IRequestApp,
    ) {
        const user = await this.userService.findOneBy({ email });
        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        const newUser = await this.userService.generateForgotPasswordInfo(user);

        //TODO: update redirect link
        const frontEndUrl: boolean =
            this.configService.get<boolean>('app.frontEnd.url');
        const redirectURL = `${frontEndUrl}/password-reset?token=${newUser.forgotenPasswordCode}`;

        await this.mailConsumer.sendMailForgotPassword({
            email,
            context: {
                user: newUser,
                redirectURL,
            },
        });
    }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @UserPublicResetPasswordDoc()
    @HttpCode(HttpStatus.OK)
    @Response('user.resetPassword')
    @Post('/reset-password')
    async resetPassword(@Body() { token, newPassword }: UserResetPasswordDto) {
        const user: UserEntity =
            await this.userService.findByForgotPasswordCode(token);

        const newMatchPassword: boolean = await this.authService.validateUser(
            newPassword,
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
                await this.authService.createPassword(newPassword);
            await this.userService.updatePassword(user, password, queryRunner);

            await this.userService.update(
                user,
                {
                    forgotenPasswordCode: null,
                    forgotenPasswordTime: null,
                },
                queryRunner,
            );

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
}
