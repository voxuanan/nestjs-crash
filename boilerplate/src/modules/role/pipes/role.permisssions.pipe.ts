import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RolePermissionsDto } from '../dtos/role.create.dto';

@Injectable()
export class RolePermissionsPipe<
    T extends { permissions: RolePermissionsDto[] },
> implements PipeTransform
{
    transform(
        value: T,
        metadata: ArgumentMetadata,
    ): Omit<T, 'permissions'> & { permissions: string } {
        const { permissions, ...rest } = value;

        // Assuming permissions can be an array of objects or a string
        const result: Omit<T, 'permissions'> & { permissions: string } = {
            ...rest,
        } as Omit<T, 'permissions'> & { permissions: string };

        if (permissions) {
            if (Array.isArray(permissions)) {
                // If permissions is an array, convert it to a string
                result.permissions = JSON.stringify(permissions);
            } else if (typeof permissions === 'string') {
                // If permissions is already a string, use it as is
                result.permissions = permissions;
            }
        }

        return result as Omit<T, 'permissions'> & { permissions: string };
    }
}
