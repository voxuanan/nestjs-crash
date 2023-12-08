import { ApiProperty } from '@nestjs/swagger';
import { ArticleWithMapDataFindResult } from '../article-with-map-data.interface';
import { ArticleWithMapDataFindOneSerializer } from './article-with-map-data.find-one.serializer';

export class ArticleWithMapDataFindSerializer extends ArticleWithMapDataFindResult {
  @ApiProperty({ type: [ArticleWithMapDataFindOneSerializer] })
  readonly data: ArticleWithMapDataFindOneSerializer[];

  @ApiProperty()
  pagination: any;
}
