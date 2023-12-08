import { ApiProperty } from '@nestjs/swagger';
import { ArticleFindOneResult } from '../article.interface';

export class ArticleFindOneSerializer extends ArticleFindOneResult {
  @ApiProperty()
  readonly id: string;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
