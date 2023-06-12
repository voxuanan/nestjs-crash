import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import * as _ from 'lodash';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}

@Controller('')
export class AppController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload File',
    type: UploadFileDto,
    required: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const data = await this.cloudinaryService.uploadFile(file);
    return _.pick(data, ['url', 'secure_url']);
  }
}
