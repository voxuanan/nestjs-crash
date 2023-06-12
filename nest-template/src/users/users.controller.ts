import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';
import { UploadFileDto } from 'src/app.controller';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetUser } from 'src/common/decorator/getUser.decorator';
import User from './entity/user.entity';
import { UsersService } from './users.service';
// import { UserTransformInterceptor } from './transforms/user.transform';

@ApiTags('User')
// @UseInterceptors(new UserTransformInterceptor())
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
  ) {}
  @Post('addAvatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload File',
    type: UploadFileDto,
    required: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthenticationGuard)
  async addAvatar(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    const data = await this.cloudinaryService.uploadFile(file);
    return this.usersService.addAvatar(data.asset_id, data.public_id, user.id);
  }

  // @Get('files/:id')
  // @UseGuards(JwtAuthenticationGuard)
  // async getPrivateFile(
  //   @Param('id', ParseIntPipe) id: number,
  //   @GetUser() user: User,
  //   @Res() res: Response,
  // ) {
  //   const file = await this.usersService.getPrivateFile(id, user.id);
  //   file.stream.pipe(res);
  // }
}
