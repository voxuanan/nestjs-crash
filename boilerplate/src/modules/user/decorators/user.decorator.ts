import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    SetMetadata,
    UseGuards,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import {
    USER_ACTIVE_META_KEY,
    USER_BLOCKED_META_KEY,
    USER_INACTIVE_PERMANENT_META_KEY,
} from 'src/modules/user/constants/user.constant';
import { UserPayloadPutToRequestGuard } from 'src/modules/user/guards/payload/user.payload.put-to-request.guard';
import { UserActiveGuard } from 'src/modules/user/guards/user.active.guard';
import { UserBlockedGuard } from 'src/modules/user/guards/user.blocked.guard';
import { UserInactivePermanentGuard } from 'src/modules/user/guards/user.inactive-permanent.guard';
import { UserNotFoundGuard } from 'src/modules/user/guards/user.not-found.guard';
import { UserEntity } from '../entities/user.entity';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): UserEntity => {
        const { __user } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserEntity }>();
        return __user;
    },
);

export function UserProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(UserPayloadPutToRequestGuard, UserNotFoundGuard),
    );
}

export function UserAuthProtected(): MethodDecorator {
    return applyDecorators(
        UseGuards(
            UserBlockedGuard,
            UserInactivePermanentGuard,
            UserActiveGuard,
        ),
        SetMetadata(USER_INACTIVE_PERMANENT_META_KEY, [false]),
        SetMetadata(USER_BLOCKED_META_KEY, [false]),
        SetMetadata(USER_ACTIVE_META_KEY, [true]),
    );
}
