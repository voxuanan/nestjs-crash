import {
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
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadFileDto } from 'src/app.controller';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { GetUser } from 'src/common/decorator/getUser.decorator';
import User from './entity/user.entity';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
  ) {}
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload File',
    type: UploadFileDto,
    required: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthenticationGuard)
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    const data = await this.cloudinaryService.uploadFile(file);
    return this.usersService.createFilePrivate(
      data.asset_id,
      data.public_id,
      user.id,
    );
  }

  @Get('files/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getPrivateFile(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Res() res: Response,
  ) {
    const file = await this.usersService.getPrivateFile(id, user.id);
    file.stream.pipe(res);
  }

  @Get('files')
  @UseGuards(JwtAuthenticationGuard)
  async getAllPrivateFiles(@GetUser() user: User) {
    return this.usersService.getAllPrivateFiles(user.id);
  }
}
