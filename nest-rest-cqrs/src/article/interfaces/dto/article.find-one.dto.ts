import { IsNotEmpty, IsString } from 'class-validator';

export class FindOneInputDto {
  @IsNotEmpty()
  @IsString()
  articleId: string;
}
