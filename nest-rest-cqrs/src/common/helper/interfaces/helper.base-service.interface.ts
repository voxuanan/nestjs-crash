import {
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    DeleteResult,
    UpdateResult,
    QueryRunner,
} from 'typeorm';

export interface IBaseService<T> {
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    findOne(options?: FindOneOptions<T>): Promise<T | null>;
    findOneBy(findData: FindOptionsWhere<T>): Promise<T | null>;
    findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
    findAndCountBy(
        where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    ): Promise<[T[], number]>;
    exist(findData: FindManyOptions<T>): Promise<boolean>;
    getTotal(options?: FindManyOptions<T>): Promise<number>;
    create(data: Partial<T>): Promise<T>;
    createMany(data: Partial<T>[]): Promise<T[]>;
    deleteMany(options: FindOptionsWhere<T>): Promise<DeleteResult>;
    update(
        repository: T,
        fields: Partial<T>,
        queryRunner?: QueryRunner,
    ): Promise<T>;
    updateMany(
        options: FindOptionsWhere<T>,
        fields: Partial<T>,
    ): Promise<UpdateResult>;
    softDelete(options: FindOptionsWhere<T>): Promise<UpdateResult>;
    remove(repository: T): Promise<T>;
}
