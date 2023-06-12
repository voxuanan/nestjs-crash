import { Controller } from '@nestjs/common';

import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: any;
}

@Controller('')
export class AppController {}
