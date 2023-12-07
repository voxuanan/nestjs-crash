import { IBaseService } from 'src/common/helper/interfaces/helper.base-service.interface';
import { SettingEntity } from '../entities/setting.entity';
import { SettingUpdateValueDto } from '../dtos/setting.update-value.dto';
import { ENUM_SETTING_DATA_TYPE } from '../constants/setting.enum.constant';
import { SettingCreateDto } from '../dtos/setting.create.dto';

export interface ISettingService
    extends Omit<IBaseService<SettingEntity>, 'create'> {
    create({
        name,
        description,
        type,
        value,
        user,
    }: SettingCreateDto): Promise<SettingEntity>;
    updateValue(
        repository: SettingEntity,
        { type, value }: SettingUpdateValueDto,
    ): Promise<SettingEntity>;
    getValue<T>(setting: SettingEntity): Promise<T>;
    checkValue(value: string, type: ENUM_SETTING_DATA_TYPE): Promise<boolean>;
    getMaintenance(): Promise<boolean>;
    getMobileNumberCountryCodeAllowed(): Promise<string[]>;
    getPasswordAttempt(): Promise<boolean>;
    getMaxPasswordAttempt(): Promise<number>;
}
