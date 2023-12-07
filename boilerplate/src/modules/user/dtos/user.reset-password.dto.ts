import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { IsPasswordStrong } from 'src/common/request/validations/request.is-password-strong.validation';

export class UserResetPasswordDto {
    @ApiProperty({
        description:
            "new string password, newPassword can't same with oldPassword",
        example: `${faker.string.alphanumeric(5).toLowerCase()}${faker.string
            .alphanumeric(5)
            .toUpperCase()}@@!123`,
        required: true,
    })
    @IsPasswordStrong()
    @IsNotEmpty()
    @MaxLength(50)
    readonly newPassword: string;

    @ApiProperty({
        description: 'forgot password code',
        example: faker.string.hexadecimal(),
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    readonly token: string;
}
