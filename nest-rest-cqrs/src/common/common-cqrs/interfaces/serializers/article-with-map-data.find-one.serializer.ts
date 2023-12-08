import { ApiProperty } from '@nestjs/swagger';
import { ArticleWithMapDataFindOneResult } from '../article-with-map-data.interface';

export class ArticleWithMapDataFindOneSerializer extends ArticleWithMapDataFindOneResult {
  @ApiProperty()
  readonly id: string;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ required: false })
  readonly mapData?: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;
}
