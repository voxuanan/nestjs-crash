import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateArticleRequestDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(8)
  @ApiProperty({ minLength: 2, maxLength: 8 })
  readonly name: string;
}
