import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/common/auth/services/auth.service';
import { UserService } from 'src/modules/user/services/user.service';
import { RoleService } from 'src/modules/role/services/role.service';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/user/constants/user.enum.constant';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable()
export class MigrationUserSeed {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
    ) {}

    @Command({
        command: 'seed:user',
        describe: 'seed users',
    })
    async seeds(): Promise<void> {
        const password = 'aaAA@123';
        const passwordHash = await this.authService.createPassword(password);

        const [superAdminRole, adminRole, userRole] = await Promise.all([
            this.roleService.findOneBy({
                name: 'superadmin',
            }),
            this.roleService.findOneBy({
                name: 'admin',
            }),

            this.roleService.findOneBy({
                name: 'user',
            }),
        ]);

        const user: Promise<UserEntity> = this.userService.create(
            {
                firstName: 'An',
                lastName: 'Vo',
                email: 'voxuanan0307@gmail.com',
                password,
                mobileNumber: '0967964426',
                signUpFrom: ENUM_USER_SIGN_UP_FROM.ADMIN,
                role: superAdminRole.id,
            },
            passwordHash,
        );

        const user1: Promise<UserEntity> = this.userService.create(
            {
                firstName: 'superadmin',
                lastName: 'test',
                email: 'superadmin@mail.com',
                password,
                mobileNumber: '628111111222',
                signUpFrom: ENUM_USER_SIGN_UP_FROM.ADMIN,
                role: superAdminRole.id,
            },
            passwordHash,
        );
        const user2: Promise<UserEntity> = this.userService.create(
            {
                firstName: 'admin',
                lastName: 'test',
                email: 'admin@mail.com',
                password,
                signUpFrom: ENUM_USER_SIGN_UP_FROM.ADMIN,
                role: adminRole.id,
            },
            passwordHash,
        );
        const user3: Promise<UserEntity> = this.userService.create(
            {
                firstName: 'user',
                lastName: 'test',
                email: 'user@mail.com',
                password,
                signUpFrom: ENUM_USER_SIGN_UP_FROM.ADMIN,
                role: userRole.id,
            },
            passwordHash,
        );
        const user4: Promise<UserEntity> = this.userService.create(
            {
                firstName: 'member',
                lastName: 'test',
                email: 'member@mail.com',
                password,
                signUpFrom: ENUM_USER_SIGN_UP_FROM.ADMIN,
                role: userRole.id,
            },
            passwordHash,
        );

        try {
            await Promise.all([user, user1, user2, user3, user4]);
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }

    @Command({
        command: 'remove:user',
        describe: 'remove users',
    })
    async remove(): Promise<void> {
        try {
            await this.userService.deleteMany({});
        } catch (err: any) {
            throw new Error(err.message);
        }

        return;
    }
}
