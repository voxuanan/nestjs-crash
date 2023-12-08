import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateNameArticleRequestDTO {
  @IsString()
  @ApiProperty({})
  readonly name: string;
}
