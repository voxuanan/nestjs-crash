import { ApiProperty } from '@nestjs/swagger';
import { ArticleFindResult } from '../article.interface';
import { ArticleFindOneSerializer } from './article.find-one.serializer';

export class ArticleFindSerializer extends ArticleFindResult {
  @ApiProperty({ type: [ArticleFindOneSerializer] })
  readonly data: ArticleFindOneSerializer[];

  @ApiProperty()
  pagination: any;
}
