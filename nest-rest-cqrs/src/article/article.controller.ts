import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  Post,
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
import { CreateArticleCommand } from './cqrs/application/command/article.create.command';
import { UpdateNameArticleCommand } from './cqrs/application/command/article.update-name.command';
import { CreateArticleRequestDTO } from './interfaces/dto/article.create.interface';
import { FindOneInputDto } from './interfaces/dto/article.find-one.dto';
import { UpdateNameArticleRequestDTO } from './interfaces/dto/article.update-name.dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

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

  @Post(':articleId')
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiBadRequestResponse({})
  @ApiNotFoundResponse({})
  @ApiUnprocessableEntityResponse({})
  @ApiInternalServerErrorResponse({})
  async updateName(
    @Param() param: FindOneInputDto,
    @Body() body: UpdateNameArticleRequestDTO,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateNameArticleCommand(param.articleId, body.name),
    );
  }
}
