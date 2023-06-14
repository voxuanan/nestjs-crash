import { ApiProperty } from '@nestjs/swagger';

export class UploadMutipleFileDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files: any[];
}
