import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class RoleRequestDto {
    @IsNotEmpty()
    @Type(() => Number)
    role: number;
}
