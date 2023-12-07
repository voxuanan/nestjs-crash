import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ENUM_ROLE_TYPE } from '../constants/role.enum.constant';
import { BaseEntityAbstract } from 'src/common/database/abstracts/base.entity.abstract';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { IPolicyRule } from 'src/common/policy/interfaces/policy.interface';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntityAbstract {
    constructor(partial: Partial<RoleEntity>) {
        super();
        Object.assign(this, partial);
    }

    @Column()
    @Index()
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({
        default: true,
    })
    isActive!: boolean;

    @Column({
        type: 'enum',
        enum: ENUM_ROLE_TYPE,
        default: ENUM_ROLE_TYPE.USER,
    })
    type!: ENUM_ROLE_TYPE;

    @OneToMany(() => UserEntity, (user) => user.role)
    users: UserEntity[];

    @Column({
        type: 'json',
    })
    // this is IPolicyRule[];
    permissions: string;
}
