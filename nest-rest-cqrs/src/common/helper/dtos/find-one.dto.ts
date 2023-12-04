import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneInputDTO {
  @IsNotEmpty()
  @IsString()
  id: string;
}
