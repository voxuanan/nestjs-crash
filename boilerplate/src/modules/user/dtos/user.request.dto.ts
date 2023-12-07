import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserRequestDto {
    @IsNotEmpty()
    @Type(() => Number)
    user: number;
}
