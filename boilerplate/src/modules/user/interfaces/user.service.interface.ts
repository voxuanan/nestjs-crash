import { IAuthPassword } from 'src/common/auth/interfaces/auth.interface';
import { QueryRunner, UpdateResult } from 'typeorm';
import { UserCreateDto } from '../dtos/user.create.dto';
import { UserUpdateProfileDto } from '../dtos/user.update-profile.dto';
import { UserUpdateUsernameDto } from '../dtos/user.update-username.dto';
import { UserEntity } from '../entities/user.entity';
import { UserPayloadSerialization } from '../serializations/user.payload.serialization';
import { IBaseService } from 'src/common/helper/interfaces/helper.base-service.interface';

export interface IUserService extends Omit<IBaseService<UserEntity>, 'create'> {
    findByForgotPasswordCode(token: string): Promise<UserEntity>;
    create(
        {
            firstName,
            lastName,
            email,
            mobileNumber,
            role,
            signUpFrom,
        }: UserCreateDto,
        { passwordExpired, passwordHash, salt, passwordCreated }: IAuthPassword,
    ): Promise<UserEntity>;
    payloadSerialization(data: UserEntity): Promise<UserPayloadSerialization>;
    increasePasswordAttempt(repository: UserEntity): Promise<UserEntity>;
    resetPasswordAttempt(
        repository: UserEntity,
        queryRunner?: QueryRunner,
    ): Promise<UserEntity>;
    resetAllPasswordAttempt(): Promise<UpdateResult>;
    updateProfile(
        repository: UserEntity,
        { firstName, lastName, email, mobileNumber }: UserUpdateProfileDto,
    ): Promise<UserEntity>;
    updateUsername(
        repository: UserEntity,
        { username }: UserUpdateUsernameDto,
    ): Promise<UserEntity>;
    updatePassword(
        repository: UserEntity,
        { passwordHash, passwordExpired, salt, passwordCreated }: IAuthPassword,
        queryRunner?: QueryRunner,
    ): Promise<UserEntity>;
    updatePhoto(repository: UserEntity, photo: string): Promise<UserEntity>;
    joinWithRole(repository: UserEntity): Promise<UserEntity>;
    active(repository: UserEntity): Promise<UserEntity>;
    inactive(repository: UserEntity): Promise<UserEntity>;
    inactivePermanent(repository: UserEntity): Promise<UserEntity>;
    blocked(repository: UserEntity): Promise<UserEntity>;
    unblocked(repository: UserEntity): Promise<UserEntity>;
    generateForgotPasswordInfo(user: UserEntity): Promise<UserEntity>;
    createPhotoFilename(): Promise<Record<string, any>>;
    createUserWithGoogle(email: string, googleId: string): Promise<UserEntity>;
}
