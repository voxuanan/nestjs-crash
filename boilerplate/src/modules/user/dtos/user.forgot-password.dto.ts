import { PickType } from '@nestjs/swagger';
import { UserCreateDto } from './user.create.dto';

export class UserForgotPasswordDto extends PickType(UserCreateDto, [
    'email',
] as const) {}
