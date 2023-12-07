import { Injectable } from '@nestjs/common';
import { Command } from 'nestjs-command';
import {
    ENUM_POLICY_ACTION,
    ENUM_POLICY_SUBJECT,
} from 'src/common/policy/constants/policy.enum.constant';
import { ENUM_ROLE_TYPE } from 'src/modules/role/constants/role.enum.constant';
import { RoleCreateDto } from 'src/modules/role/dtos/role.create.dto';
import { RoleService } from 'src/modules/role/services/role.service';

@Injectable()
export class MigrationRoleSeed {
    constructor(private readonly roleService: RoleService) {}

    @Command({
        command: 'seed:role',
        describe: 'seed roles',
    })
    async seeds(): Promise<void> {
        const dataAdmin: (Omit<RoleCreateDto, 'permissions'> & {
            permissions: string;
        })[] = [
            {
                name: 'superadmin',
                type: ENUM_ROLE_TYPE.SUPER_ADMIN,
                description: 'description',
                permissions: JSON.stringify([]),
            },
            {
                name: 'admin',
                type: ENUM_ROLE_TYPE.ADMIN,
                description: 'description',
                permissions: JSON.stringify(
                    Object.values(ENUM_POLICY_SUBJECT).map((val) => ({
                        subject: val,
                        action: [ENUM_POLICY_ACTION.MANAGE],
                    })),
                ),
            },
            {
                name: 'user',
                type: ENUM_ROLE_TYPE.USER,
                description: 'description',
                permissions: JSON.stringify([]),
            },
        ];

        try {
            await this.roleService.createMany(dataAdmin);
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({
        command: 'remove:role',
        describe: 'remove roles',
    })
    async remove(): Promise<void> {
        try {
            await this.roleService.deleteMany({});
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
