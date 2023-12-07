import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { RoleService } from 'src/modules/role/services/role.service';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RolePutToRequestGuard implements CanActivate {
    constructor(private readonly roleService: RoleService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<IRequestApp & { __role: RoleEntity }>();
        const { params } = request;
        const { role } = params;

        const check: RoleEntity = await this.roleService.findOneBy({
            id: parseInt(role),
        });
        request.__role = check;

        return true;
    }
}
