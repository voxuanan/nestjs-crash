import { applyDecorators } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from 'src/common/doc/constants/doc.enum.constant';
import {
    Doc,
    DocAuth,
    DocRequest,
    DocRequestFile,
    DocResponse,
} from 'src/common/doc/decorators/doc.decorator';
import { UserChangePasswordDto } from 'src/modules/user/dtos/user.change-password.dto';
import { UserUpdateUsernameDto } from 'src/modules/user/dtos/user.update-username.dto';
import { UserUpdateProfileDto } from '../dtos/user.update-profile.dto';
import { UserProfileSerialization } from '../serializations/user.profile.serialization';

export function UserAuthRefreshDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.auth.user',
        }),
        DocAuth({
            jwtRefreshToken: true,
        }),
    );
}

export function UserAuthProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.auth.user',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocResponse<UserProfileSerialization>('user.profile', {
            serialization: UserProfileSerialization,
        }),
    );
}

export function UserAuthUploadProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.auth.user',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequestFile(),
        DocResponse('user.upload'),
    );
}

export function UserAuthUpdateProfileDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.auth.user',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: UserUpdateProfileDto,
        }),
        DocResponse('user.updateProfile'),
    );
}

export function UserAuthChangePasswordDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.auth.user',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: UserChangePasswordDto,
        }),
        DocResponse('user.changePassword'),
    );
}

export function UserAuthClaimUsernameDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'modules.auth.user',
        }),
        DocAuth({
            jwtAccessToken: true,
        }),
        DocRequest({
            bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
            body: UserUpdateUsernameDto,
        }),
        DocResponse('user.claimUsername'),
    );
}

export function UserAuthLoginGoogleDoc(): MethodDecorator {
    return applyDecorators(
        Doc({
            operation: 'login with access token google',
        }),
        DocAuth({ google: true }),
        DocResponse('user.loginGoogle'),
    );
}
