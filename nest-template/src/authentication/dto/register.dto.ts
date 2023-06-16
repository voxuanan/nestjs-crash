import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phoneNumber: string;
}

export default RegisterDto;
