import { PickType } from '@nestjs/swagger';
import { UserCreateDto } from './user.create.dto';

export class UserUpdateProfileDto extends PickType(UserCreateDto, [
    'firstName',
    'lastName',
    'email',
    'mobileNumber',
] as const) {}
