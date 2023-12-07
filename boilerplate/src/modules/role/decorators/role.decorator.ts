import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { RoleEntity } from '../entities/role.entity';

export const GetRole = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): RoleEntity => {
        const { __role } = ctx
            .switchToHttp()
            .getRequest<IRequestApp & { __role: RoleEntity }>();
        return __role;
    },
);
