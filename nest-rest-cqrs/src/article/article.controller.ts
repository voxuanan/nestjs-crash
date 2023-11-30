import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateArticleCommand } from './cqrs/application/command/article.create.command';
import { CreateArticleRequestDTO } from './interfaces/dto/article.create.interface';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

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
}
