import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import CreateCommentDto from './dto/createComment.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from './commands/implementations/createComment.command';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { GetUser } from 'src/common/decorator/getUser.decorator';
import User from 'src/users/entity/user.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import GetCommentsDto from './dto/getComments.dto';
import { GetCommentsQuery } from './queries/implementations/getComments.query';

@ApiTags('Comment')
@Controller('comments')
@UseInterceptors(ClassSerializerInterceptor)
export class CommentsController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  @ApiBody({
    type: CreateCommentDto,
  })
  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createComment(
    @Body() comment: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.commandBus.execute(new CreateCommentCommand(comment, user));
  }

  @Get()
  async getComments(@Query() { postId }: GetCommentsDto) {
    return this.queryBus.execute(new GetCommentsQuery(postId));
  }
}
