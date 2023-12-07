import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserService } from 'src/modules/user/services/user.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserEntity }>();
        const { params } = request;
        const { user } = params;

        const check: UserEntity = await this.userService.findOneBy({
            id: parseInt(user),
        });
        request.__user = check;

        return true;
    }
}
