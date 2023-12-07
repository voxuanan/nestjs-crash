import { IBaseService } from 'src/common/helper/interfaces/helper.base-service.interface';
import { RoleEntity } from '../entities/role.entity';
import { RoleUpdatePermissionDto } from '../dtos/role.update-permission.dto';

export interface IRoleService extends IBaseService<RoleEntity> {
    updatePermissions(
        repository: RoleEntity,
        {
            permissions,
            type,
        }: Omit<RoleUpdatePermissionDto, 'permissions'> & {
            permissions: string;
        },
    ): Promise<RoleEntity>;
    inactive(repository: RoleEntity): Promise<RoleEntity>;
    active(repository: RoleEntity): Promise<RoleEntity>;
}
