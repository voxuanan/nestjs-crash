import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperNumberService } from 'src/common/helper/services/helper.number.service';
import { SettingCreateDto } from 'src/common/setting/dtos/setting.create.dto';
import { SettingUpdateValueDto } from 'src/common/setting/dtos/setting.update-value.dto';
import { SettingEntity } from 'src/common/setting/entities/setting.entity';
import {
    DeleteResult,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    QueryRunner,
    Repository,
    UpdateResult,
} from 'typeorm';
import { ISettingService } from '../interfaces/setting-service.interface';
import { ENUM_SETTING_DATA_TYPE } from '../constants/setting.enum.constant';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CacheService } from 'src/common/cache/services/cache.service';
import { ENUM_CACHE_KEY } from 'src/common/cache/constants/cache.enum.constant';

@Injectable()
export class SettingService implements ISettingService {
    private readonly mobileNumberCountryCodeAllowed: string[];
    private readonly passwordAttempt: boolean;
    private readonly maxPasswordAttempt: number;

    constructor(
        @InjectRepository(SettingEntity)
        private settingRepository: Repository<SettingEntity>,
        private readonly configService: ConfigService,
        private readonly helperNumberService: HelperNumberService,
        private readonly cacheService: CacheService,
    ) {
        this.mobileNumberCountryCodeAllowed = this.configService.get<string[]>(
            'user.mobileNumberCountryCodeAllowed',
        );
        this.passwordAttempt = this.configService.get<boolean>(
            'auth.password.attempt',
        );
        this.maxPasswordAttempt = this.configService.get<number>(
            'auth.password.maxAttempt',
        );
    }

    exist(findData: FindManyOptions<SettingEntity>): Promise<boolean> {
        return this.settingRepository.exist(findData);
    }

    createMany(data: Partial<SettingEntity>[]): Promise<SettingEntity[]> {
        const settings = this.settingRepository.create(data);

        this.cacheService.clearCache(ENUM_CACHE_KEY.SETTING);
        return this.settingRepository.save(settings);
    }

    update(
        repository: SettingEntity,
        fields: Partial<SettingEntity>,
        queryRunner?: QueryRunner,
    ): Promise<SettingEntity> {
        for (const [key, value] of Object.entries(fields)) {
            repository[key] = value;
        }

        this.cacheService.clearCache(ENUM_CACHE_KEY.SETTING);
        return queryRunner
            ? queryRunner.manager.save(repository)
            : this.settingRepository.save(repository);
    }

    updateMany(
        options: FindOptionsWhere<SettingEntity>,
        fields: Partial<SettingEntity>,
    ): Promise<UpdateResult> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.SETTING);
        return this.settingRepository.update(options, fields);
    }

    remove(repository: SettingEntity): Promise<SettingEntity> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.SETTING);
        return this.settingRepository.remove(repository);
    }

    findAll(
        options?: FindManyOptions<SettingEntity>,
    ): Promise<SettingEntity[]> {
        return this.settingRepository.find(options);
    }

    findOne(
        options?: FindOneOptions<SettingEntity>,
    ): Promise<SettingEntity | null> {
        return this.settingRepository.findOne(options);
    }

    findOneBy(
        findData: FindOptionsWhere<SettingEntity>,
    ): Promise<SettingEntity | null> {
        return this.settingRepository.findOneBy(findData);
    }

    findAndCount(
        options?: FindManyOptions<SettingEntity>,
    ): Promise<[SettingEntity[], number]> {
        return this.settingRepository.findAndCount(options);
    }

    findAndCountBy(
        where:
            | FindOptionsWhere<SettingEntity>
            | FindOptionsWhere<SettingEntity>[],
    ): Promise<[SettingEntity[], number]> {
        return this.settingRepository.findAndCountBy(where);
    }

    getTotal(options?: FindManyOptions<SettingEntity>): Promise<number> {
        return this.settingRepository.count(options);
    }

    async create({
        name,
        description,
        type,
        value,
        user,
    }: SettingCreateDto): Promise<SettingEntity> {
        const create: SettingEntity = new SettingEntity({
            name,
            description: description ?? undefined,
            type,
            value,
        });
        if (user) {
            create.user = Object.assign(new UserEntity({}), {
                id: user,
            });
        }

        this.cacheService.clearCache(ENUM_CACHE_KEY.SETTING);
        return this.settingRepository.create(create).save();
    }

    async updateValue(
        repository: SettingEntity,
        { type, value }: SettingUpdateValueDto,
    ): Promise<SettingEntity> {
        repository.type = type;
        repository.value = value;

        this.cacheService.clearCache(ENUM_CACHE_KEY.SETTING);
        return this.settingRepository.save(repository);
    }

    softDelete(
        options: FindOptionsWhere<SettingEntity>,
    ): Promise<UpdateResult> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.SETTING);
        return this.settingRepository.softDelete(options);
    }

    async getValue<T>(setting: SettingEntity): Promise<T> {
        if (
            setting.type === ENUM_SETTING_DATA_TYPE.BOOLEAN &&
            (setting.value === 'true' || setting.value === 'false')
        ) {
            return (setting.value === 'true') as any;
        } else if (
            setting.type === ENUM_SETTING_DATA_TYPE.NUMBER &&
            this.helperNumberService.check(setting.value)
        ) {
            return this.helperNumberService.create(setting.value) as any;
        } else if (setting.type === ENUM_SETTING_DATA_TYPE.ARRAY_OF_STRING) {
            return setting.value.split(',') as any;
        }

        return setting.value as any;
    }

    async checkValue(
        value: string,
        type: ENUM_SETTING_DATA_TYPE,
    ): Promise<boolean> {
        if (
            type === ENUM_SETTING_DATA_TYPE.BOOLEAN &&
            (value === 'true' || value === 'false')
        ) {
            return true;
        } else if (
            type === ENUM_SETTING_DATA_TYPE.NUMBER &&
            this.helperNumberService.check(value)
        ) {
            return true;
        } else if (
            (type === ENUM_SETTING_DATA_TYPE.STRING ||
                type === ENUM_SETTING_DATA_TYPE.ARRAY_OF_STRING) &&
            typeof value === 'string'
        ) {
            return true;
        }

        return false;
    }

    async getMaintenance(): Promise<boolean> {
        const setting: SettingEntity = await this.settingRepository.findOneBy({
            name: 'maintenance',
        });

        return this.getValue<boolean>(setting);
    }

    async getMobileNumberCountryCodeAllowed(): Promise<string[]> {
        return this.mobileNumberCountryCodeAllowed;
    }

    async getPasswordAttempt(): Promise<boolean> {
        return this.passwordAttempt;
    }

    async getMaxPasswordAttempt(): Promise<number> {
        return this.maxPasswordAttempt;
    }

    deleteMany(
        options: FindOptionsWhere<SettingEntity>,
    ): Promise<DeleteResult> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.SETTING);
        return this.settingRepository.delete(options);
    }
}
