import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import {
    Doc,
    DocRequest,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { UserSignUpDto } from 'src/modules/user/dtos/user.sign-up.dto';
import { UserForgotPasswordDto } from '../dtos/user.forgot-password.dto';
import { UserLoginDto } from '../dtos/user.login.dto';
import { UserResetPasswordDto } from '../dtos/user.reset-password.dto';
import { UserLoginSerialization } from '../serializations/user.login.serialization';

export function UserPublicSignUpDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.public.user',
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: UserSignUpDto,
        }),
        DocResponse('user.signUp', {
            httpStatus: HttpStatus.CREATED,
        }),
    );
}

export function UserPublicLoginDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.public.user',
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: UserLoginDto,
        }),
        DocResponse<UserLoginSerialization>('user.login', {
            serialization: UserLoginSerialization,
        }),
    );
}

export function UserPublicForgotPasswordDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.public.user',
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: UserForgotPasswordDto,
        }),
        DocResponse('user.forgotPassword', {
            httpStatus: HttpStatus.OK,
        }),
    );
}

export function UserPublicResetPasswordDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.public.user',
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: UserResetPasswordDto,
        }),
        DocResponse('user.resetPassword'),
    );
}
