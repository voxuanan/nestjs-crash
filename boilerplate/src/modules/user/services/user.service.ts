import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { HelperStringService } from 'src/common/helper/services/helper.string.service';
import { RoleEntity } from 'src/modules/role/entities/role.entity';
import {
    DeleteResult,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    Not,
    QueryRunner,
    Repository,
    UpdateResult,
} from 'typeorm';
import { ENUM_USER_STATUS_CODE_ERROR } from '../constants/user.status-code.constant';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserImportDto } from '../dtos/user.import.dto';
import { UserUpdateProfileDto } from '../dtos/user.update-profile.dto';
import { UserUpdateUsernameDto } from '../dtos/user.update-username.dto';
import { UserEntity } from '../entities/user.entity';
import { IUserService } from '../interfaces/user.service.interface';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { ConfigService } from '@nestjs/config';
import { CacheService } from 'src/common/cache/services/cache.service';
import { ENUM_CACHE_KEY } from 'src/common/cache/constants/cache.enum.constant';
import { ENUM_USER_SIGN_UP_FROM } from '../constants/user.enum.constant';
import { RoleService } from 'src/modules/role/services/role.service';
import { AuthService } from 'src/common/auth/services/auth.service';

@Injectable()
export class UserService implements IUserService {
    private readonly uploadPath: string;

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly helperStringService: HelperStringService,
        private readonly helperDateService: HelperDateService,
        private readonly configService: ConfigService,
        private readonly cacheService: CacheService,
        private readonly roleService: RoleService,
        private readonly authService: AuthService,
    ) {
        this.uploadPath = this.configService.get<string>('user.uploadPath');
    }

    findAll(options?: FindManyOptions<UserEntity>): Promise<UserEntity[]> {
        return this.userRepository.find(options);
    }

    findOne(options?: FindOneOptions<UserEntity>): Promise<UserEntity | null> {
        return this.userRepository.findOne(options);
    }

    findOneBy(
        findData: FindOptionsWhere<UserEntity>,
    ): Promise<UserEntity | null> {
        return this.userRepository.findOneBy(findData);
    }

    async findByForgotPasswordCode(token: string): Promise<UserEntity> {
        const user: UserEntity = await this.findOneBy({
            forgotenPasswordCode: token,
        });

        if (!user) {
            throw new NotFoundException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
                message: 'user.error.notFound',
            });
        }

        if (
            this.helperDateService.isBefore(
                user.forgotenPasswordTime,
                this.helperDateService.create(),
            )
        ) {
            throw new BadRequestException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_FORGOT_PASSWORD_TOKEN_EXPIRED_ERROR,
                message: 'user.error.forgotPasswordTokenExpired',
            });
        }

        return user;
    }

    findAndCount(
        options?: FindManyOptions<UserEntity>,
    ): Promise<[UserEntity[], number]> {
        return this.userRepository.findAndCount(options);
    }

    findAndCountBy(
        where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
    ): Promise<[UserEntity[], number]> {
        return this.userRepository.findAndCountBy(where);
    }

    exist(findData: FindManyOptions<UserEntity>): Promise<boolean> {
        return this.userRepository.exist(findData);
    }

    getTotal(options?: FindManyOptions<UserEntity>): Promise<number> {
        return this.userRepository.count(options);
    }

    async create(
        {
            firstName,
            lastName,
            email,
            mobileNumber,
            role,
            signUpFrom,
        }: UserCreateDto,
        { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    ): Promise<UserEntity> {
        const create: UserEntity = new UserEntity({
            firstName: firstName,
            email: email,
            password: passwordHash,
            role: Object.assign(new RoleEntity({}), {
                id: role,
            }),
            isActive: true,
            inactivePermanent: false,
            blocked: false,
            lastName: lastName,
            salt: salt,
            passwordExpired: passwordExpired,
            passwordCreated: passwordCreated,
            signUpDate: this.helperDateService.create(),
            passwordAttempt: 0,
            mobileNumber: mobileNumber ?? undefined,
            signUpFrom: signUpFrom,
        });

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.create(create).save();
    }

    createMany(data: Partial<UserEntity>[]): Promise<UserEntity[]> {
        const users = this.userRepository.create(data);

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.save(users);
    }

    remove(repository: UserEntity): Promise<UserEntity> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.remove(repository);
    }

    deleteMany(options: FindOptionsWhere<UserEntity>): Promise<DeleteResult> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.delete(options);
    }

    async payloadSerialization(
        data: UserEntity,
    ): Promise<UserPayloadSerialization> {
        return plainToInstance(UserPayloadSerialization, data);
    }

    async increasePasswordAttempt(repository: UserEntity): Promise<UserEntity> {
        repository.passwordAttempt = ++repository.passwordAttempt;

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.save(repository);
    }

    async resetPasswordAttempt(
        repository: UserEntity,
        queryRunner?: QueryRunner,
    ): Promise<UserEntity> {
        repository.passwordAttempt = 0;

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return queryRunner
            ? queryRunner.manager.save(repository)
            : this.userRepository.save(repository);
    }

    async resetAllPasswordAttempt(): Promise<UpdateResult> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.update({}, { passwordAttempt: 0 });
    }

    async update(
        repository: UserEntity,
        fields: Partial<UserEntity>,
        queryRunner?: QueryRunner,
    ): Promise<UserEntity> {
        for (const [key, value] of Object.entries(fields)) {
            repository[key] = value;
        }

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return queryRunner
            ? queryRunner.manager.save(repository)
            : this.userRepository.save(repository);
    }

    updateMany(
        options: FindOptionsWhere<UserEntity>,
        fields: Partial<UserEntity>,
    ): Promise<UpdateResult> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.update(options, fields);
    }

    async updateProfile(
        repository: UserEntity,
        { firstName, lastName, email, mobileNumber }: UserUpdateProfileDto,
    ): Promise<UserEntity> {
        const emailExisted = await this.userRepository.exist({
            where: { email: email, id: Not(repository.id) },
        });
        if (emailExisted) {
            throw new ConflictException({
                statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_EMAIL_EXIST_ERROR,
                message: 'user.error.emailExist',
                _error: 'Email already exists.',
            });
        }

        const mobileNumberExisted = await this.userRepository.findOne({
            where: { mobileNumber: mobileNumber, id: Not(repository.id) },
        });
        if (mobileNumberExisted) {
            throw new ConflictException({
                statusCode:
                    ENUM_USER_STATUS_CODE_ERROR.USER_MOBILE_NUMBER_EXIST_ERROR,
                message: 'user.error.mobileNumberExist',
                _error: 'Mobile number already exists.',
            });
        }

        repository.firstName = firstName;
        repository.lastName = lastName;
        repository.email = email;
        repository.mobileNumber = mobileNumber;

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.save(repository);
    }

    async updateUsername(
        repository: UserEntity,
        { username }: UserUpdateUsernameDto,
    ): Promise<UserEntity> {
        repository.username = username;

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.save(repository);
    }

    async updatePassword(
        repository: UserEntity,
        { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
        queryRunner?: QueryRunner,
    ): Promise<UserEntity> {
        repository.password = passwordHash;
        repository.passwordExpired = passwordExpired;
        repository.passwordCreated = passwordCreated;
        repository.salt = salt;

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return queryRunner
            ? queryRunner.manager.save(repository)
            : this.userRepository.save(repository);
    }

    async updatePhoto(
        repository: UserEntity,
        photo: string,
    ): Promise<UserEntity> {
        repository.photo = photo;

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.save(repository);
    }

    async active(repository: UserEntity): Promise<UserEntity> {
        repository.isActive = true;
        repository.inactiveDate = null;

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.save(repository);
    }

    async inactive(repository: UserEntity): Promise<UserEntity> {
        repository.isActive = false;
        repository.inactiveDate = this.helperDateService.create();

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.save(repository);
    }

    async inactivePermanent(repository: UserEntity): Promise<UserEntity> {
        repository.isActive = false;
        repository.inactivePermanent = true;
        repository.inactiveDate = this.helperDateService.create();

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.save(repository);
    }

    async blocked(repository: UserEntity): Promise<UserEntity> {
        repository.blocked = true;
        repository.blockedDate = this.helperDateService.create();

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.save(repository);
    }

    async unblocked(repository: UserEntity): Promise<UserEntity> {
        repository.blocked = false;
        repository.blockedDate = null;

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.save(repository);
    }

    async joinWithRole(repository: UserEntity): Promise<UserEntity> {
        return this.userRepository.findOne({
            where: {
                id: repository.id,
            },
            relations: ['role'],
        });
    }

    softDelete(options: FindOptionsWhere<UserEntity>): Promise<UpdateResult> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.softDelete(options);
    }

    async import(
        data: UserImportDto[],
        role: number,
        { passwordCreated, passwordHash, salt }: IAuthPassword,
    ): Promise<boolean> {
        const passwordExpired: Date = this.helperDateService.backwardInDays(1);
        const users: UserEntity[] = data.map(
            ({ email, firstName, lastName, mobileNumber, signUpFrom }) => {
                const create: UserEntity = new UserEntity({
                    firstName: firstName,
                    email: email,
                    password: passwordHash,
                    role: Object.assign(new RoleEntity({}), {
                        id: role,
                    }),
                    isActive: true,
                    inactivePermanent: false,
                    blocked: false,
                    lastName: lastName,
                    salt: salt,
                    passwordExpired: passwordExpired,
                    passwordCreated: passwordCreated,
                    signUpDate: this.helperDateService.create(),
                    passwordAttempt: 0,
                    mobileNumber: mobileNumber ?? undefined,
                    signUpFrom: signUpFrom,
                });

                return create;
            },
        );

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        this.userRepository.save(users);
        return true;
    }

    async generateForgotPasswordInfo(user: UserEntity): Promise<UserEntity> {
        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.update(user, {
            forgotenPasswordCode: this.helperStringService.random(16),
            forgotenPasswordTime: this.helperDateService.forwardInDays(1),
        });
    }

    async createPhotoFilename(): Promise<Record<string, any>> {
        const filename: string = this.helperStringService.random(20);

        return {
            path: this.uploadPath,
            filename: filename,
        };
    }

    async createUserWithGoogle(
        email: string,
        googleId: string,
    ): Promise<UserEntity> {
        const role = await this.roleService.findOneBy({ name: 'user' });
        const { passwordCreated, passwordExpired, passwordHash, salt } =
            await this.authService.createPassword(
                this.helperStringService.random(30),
            );

        const create: UserEntity = new UserEntity({
            googleId,
            email: email,
            role: Object.assign(new RoleEntity({}), {
                id: role.id,
            }),
            isActive: true,
            inactivePermanent: false,
            blocked: false,
            salt: salt,
            password: passwordHash,
            passwordExpired: passwordExpired,
            passwordCreated: passwordCreated,
            signUpDate: this.helperDateService.create(),
            passwordAttempt: 0,
            signUpFrom: ENUM_USER_SIGN_UP_FROM.GOOGLE,
        });

        this.cacheService.clearCache(ENUM_CACHE_KEY.USER);
        return this.userRepository.create(create).save();
    }
}
