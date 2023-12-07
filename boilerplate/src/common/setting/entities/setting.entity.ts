import { BaseEntityAbstract } from 'src/common/database/abstracts/base.entity.abstract';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { ENUM_SETTING_DATA_TYPE } from '../constants/setting.enum.constant';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'settings' })
export class SettingEntity extends BaseEntityAbstract {
    constructor(partial: Partial<SettingEntity>) {
        super();
        Object.assign(this, partial);
    }

    @Column({ nullable: false })
    @Index()
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({
        type: 'enum',
        enum: ENUM_SETTING_DATA_TYPE,
        default: ENUM_SETTING_DATA_TYPE.STRING,
    })
    type: ENUM_SETTING_DATA_TYPE;

    @Column({ nullable: false })
    value: string;

    @OneToOne(() => UserEntity, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user?: UserEntity;
}
