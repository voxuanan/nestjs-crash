import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindPaginationInputDTO } from 'src/common/helper/dtos/find-pagination.dto';
import { FindOneInputDTO } from '../helper/dtos/find-one.dto';
import { FindOneArticleWithMapDataQuery } from './application/query/article-with-map-data.find-one.query';
import { FindArticleWithMapDataQuery } from './application/query/article-with-map-data.find.query';
import { GetTotalArticleWithMapDataQuery } from './application/query/article-with-map-data.get-total.query';
import { ArticleWithMapDataFindOneSerializer } from './interfaces/serializers/article-with-map-data.find-one.serializer';
import { ArticleWithMapDataFindSerializer } from './interfaces/serializers/article-with-map-data.find.serializer';

@ApiTags('Articles With data')
@Controller('article-with-data')
export class ArticleWithDataController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('')
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArticleWithMapDataFindSerializer,
  })
  @ApiBadRequestResponse({})
  @ApiInternalServerErrorResponse({})
  async find(
    @Query() querystring: FindPaginationInputDTO,
  ): Promise<ArticleWithMapDataFindSerializer> {
    const query = new FindArticleWithMapDataQuery(querystring);
    return {
      data: await this.queryBus.execute(query),
      pagination: {
        total: await this.queryBus.execute(
          new GetTotalArticleWithMapDataQuery(),
        ),
        skip: +querystring.skip,
        take: +querystring.take,
      },
    };
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArticleWithMapDataFindOneSerializer,
  })
  @ApiBadRequestResponse({})
  @ApiInternalServerErrorResponse({})
  async findById(
    @Param() param: FindOneInputDTO,
  ): Promise<ArticleWithMapDataFindOneSerializer> {
    return this.queryBus.execute(new FindOneArticleWithMapDataQuery(param.id));
  }
}
