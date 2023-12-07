import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    Repository,
    FindOptionsWhere,
    DeleteResult,
    FindOneOptions,
    FindManyOptions,
    UpdateResult,
    QueryRunner,
} from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { RoleCreateDto } from '../dtos/role.create.dto';
import { RoleUpdatePermissionDto } from '../dtos/role.update-permission.dto';
import { IRoleService } from '../interfaces/role.service.interface';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CacheService } from 'src/common/cache/services/cache.service';
import { ENUM_CACHE_KEY } from 'src/common/cache/constants/cache.enum.constant';

@Injectable()
export class RoleService implements IRoleService {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>,
        private readonly cacheService: CacheService,
    ) {}

    softDelete(options: FindOptionsWhere<RoleEntity>): Promise<UpdateResult> {
        return this.roleRepository.softDelete(options);
    }

    findAll(options?: FindManyOptions<RoleEntity>): Promise<RoleEntity[]> {
        return this.roleRepository.find(options);
    }

    findOne(options?: FindOneOptions<RoleEntity>): Promise<RoleEntity | null> {
        return this.roleRepository.findOne(options);
    }

    findOneBy(
        findData: FindOptionsWhere<RoleEntity>,
    ): Promise<RoleEntity | null> {
        return this.roleRepository.findOneBy(findData);
    }

    findAndCount(
        options?: FindManyOptions<RoleEntity>,
    ): Promise<[RoleEntity[], number]> {
        return this.roleRepository.findAndCount(options);
    }

    findAndCountBy(
        where: FindOptionsWhere<RoleEntity> | FindOptionsWhere<RoleEntity>[],
    ): Promise<[RoleEntity[], number]> {
        return this.roleRepository.findAndCountBy(where);
    }

    exist(findData: FindManyOptions<RoleEntity>): Promise<boolean> {
        return this.roleRepository.exist(findData);
    }

    getTotal(options?: FindManyOptions<RoleEntity>): Promise<number> {
        return this.roleRepository.count(options);
    }

    create(
        roleCreateDtos: Omit<RoleCreateDto, 'permissions'> & {
            permissions: string;
        },
    ): Promise<RoleEntity> {
        const roles = this.roleRepository.create(roleCreateDtos);

        this.cacheService.clearCache(ENUM_CACHE_KEY.ROLE);
        return this.roleRepository.save(roles);
    }

    createMany(
        roleCreateDtos: (Omit<RoleCreateDto, 'permissions'> & {
            permissions: string;
        })[],
    ): Promise<RoleEntity[]> {
        const roles = this.roleRepository.create(roleCreateDtos);

        this.cacheService.clearCache(ENUM_CACHE_KEY.ROLE);
        return this.roleRepository.save(roles);
    }

    async update(
        repository: RoleEntity,
        fields: Partial<RoleEntity>,
        queryRunner?: QueryRunner,
    ): Promise<RoleEntity> {
        for (const [key, value] of Object.entries(fields)) {
            repository[key] = value;
        }

        this.cacheService.clearCache(ENUM_CACHE_KEY.ROLE);
        return queryRunner
            ? queryRunner.manager.save(repository)
            : this.roleRepository.save(repository);
    }

    updateMany(
        options: FindOptionsWhere<RoleEntity>,
        fields: Partial<RoleEntity>,
    ): Promise<UpdateResult> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.ROLE);
        return this.roleRepository.update(options, fields);
    }

    async updatePermissions(
        repository: RoleEntity,
        {
            permissions,
            type,
        }: Omit<RoleUpdatePermissionDto, 'permissions'> & {
            permissions: string;
        },
    ): Promise<RoleEntity> {
        repository.permissions = permissions;
        repository.type = type;

        this.cacheService.clearCache(ENUM_CACHE_KEY.ROLE);
        return this.roleRepository.save(repository);
    }

    async inactive(repository: RoleEntity): Promise<RoleEntity> {
        repository.isActive = false;

        this.cacheService.clearCache(ENUM_CACHE_KEY.ROLE);
        return this.roleRepository.save(repository);
    }

    async active(repository: RoleEntity): Promise<RoleEntity> {
        repository.isActive = true;

        this.cacheService.clearCache(ENUM_CACHE_KEY.ROLE);
        return this.roleRepository.save(repository);
    }

    remove(repository: RoleEntity): Promise<RoleEntity> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.ROLE);
        return this.roleRepository.remove(repository);
    }

    deleteMany(options: FindOptionsWhere<RoleEntity>): Promise<DeleteResult> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.ROLE);
        return this.roleRepository.delete(options);
    }
}
