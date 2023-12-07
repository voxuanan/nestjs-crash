import { BaseEntityAbstract } from 'src/common/database/abstracts/base.entity.abstract';
import { SettingEntity } from 'src/common/setting/entities/setting.entity';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import { ENUM_USER_SIGN_UP_FROM } from 'src/modules/user/constants/user.enum.constant';
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    VirtualColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntityAbstract {
    constructor(partial: Partial<UserEntity>) {
        super();
        Object.assign(this, partial);
    }

    @Column({ unique: true, nullable: true })
    username?: string;

    @Column({ nullable: true, length: 50 })
    firstName?: string;

    @Column({ nullable: true, length: 50 })
    lastName?: string;

    @VirtualColumn({
        query: (alias) =>
            `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
    })
    fullName!: string;

    @Column({ nullable: true, unique: true, length: 15 })
    mobileNumber?: string;

    @Column({ nullable: false, unique: true, length: 100 })
    email: string;

    @ManyToOne(() => RoleEntity, (role) => role.users)
    @JoinColumn()
    role: RoleEntity;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    passwordExpired: Date;

    @Column({ nullable: false })
    passwordCreated: Date;

    @Column({ nullable: false, default: 0 })
    passwordAttempt: number;

    @Column({ nullable: false })
    signUpDate: Date;

    @Column({
        type: 'enum',
        enum: ENUM_USER_SIGN_UP_FROM,
        default: ENUM_USER_SIGN_UP_FROM.PUBLIC,
    })
    signUpFrom: ENUM_USER_SIGN_UP_FROM;

    @Column({ nullable: false })
    salt: string;

    @Index()
    @Column({ nullable: false, default: true })
    isActive: boolean;

    @Index()
    @Column({ nullable: false, default: false })
    inactivePermanent: boolean;

    @Column({ nullable: true })
    inactiveDate?: Date;

    @Index()
    @Column({ nullable: false, default: false })
    blocked: boolean;

    @Column({ nullable: true })
    blockedDate?: Date;

    @Column({
        nullable: true,
    })
    photo?: string;

    @Column({ nullable: true, unique: true })
    forgotenPasswordCode?: string;

    @Column({ nullable: true })
    forgotenPasswordTime?: Date;

    @OneToMany(() => SettingEntity, (setting) => setting.user, { eager: true })
    settings: SettingEntity[];

    @Column({ nullable: true, unique: true })
    googleId?: string;
}
