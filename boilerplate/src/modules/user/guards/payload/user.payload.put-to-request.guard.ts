import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserService } from 'src/modules/user/services/user.service';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UserPayloadPutToRequestGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __user: UserEntity }>();
        const { user } = request.user;

        const check: UserEntity = await this.userService.findOneBy({
            id: user.id,
        });
        request.__user = check;
        return true;
    }
}
