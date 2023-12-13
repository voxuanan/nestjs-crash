import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FindPaginationInputDTO } from 'src/common/helper/dtos/find-pagination.dto';
import { FindOneInputDTO } from '../common/helper/dtos/find-one.dto';
import { CreateArticleCommand } from './cqrs/application/command/article.create.command';
import { UpdateNameArticleCommand } from './cqrs/application/command/article.update-name.command';
import { FindOneArticleQuery } from './cqrs/application/query/article.find-one.query';
import { FindArticleQuery } from './cqrs/application/query/article.find.query';
import { GetTotalArticleQuery } from './cqrs/application/query/article.get-total.query';
import { CreateArticleRequestDTO } from './interfaces/dtos/article.create.dto';
import { UpdateNameArticleRequestDTO } from './interfaces/dtos/article.update-name.dto';
import { ArticleFindOneSerializer } from './interfaces/serializers/article.find-one.serializer';
import { ArticleFindSerializer } from './interfaces/serializers/article.find.serializer';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('')
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiBadRequestResponse({})
  @ApiInternalServerErrorResponse({})
  async find(
    @Query() querystring: FindPaginationInputDTO,
  ): Promise<ArticleFindSerializer> {
    const query = new FindArticleQuery(querystring);
    return {
      data: await this.queryBus.execute(query),
      pagination: {
        total: await this.queryBus.execute(new GetTotalArticleQuery()),
        skip: +querystring.skip,
        take: +querystring.take,
      },
    };
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArticleFindOneSerializer,
  })
  @ApiBadRequestResponse({})
  @ApiInternalServerErrorResponse({})
  async findById(
    @Param() param: FindOneInputDTO,
  ): Promise<ArticleFindOneSerializer> {
    return this.queryBus.execute(new FindOneArticleQuery(param.id));
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiBadRequestResponse({})
  @ApiInternalServerErrorResponse({})
  async create(@Body() body: CreateArticleRequestDTO): Promise<void> {
    const command = new CreateArticleCommand(body.name);
    await this.commandBus.execute(command);
  }

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiBadRequestResponse({})
  @ApiNotFoundResponse({})
  @ApiUnprocessableEntityResponse({})
  @ApiInternalServerErrorResponse({})
  async updateName(
    @Param() param: FindOneInputDTO,
    @Body() body: UpdateNameArticleRequestDTO,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateNameArticleCommand(param.id, body.name),
    );
  }
}
