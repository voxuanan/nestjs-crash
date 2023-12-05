import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class EventSouringSearchDto {
  @ApiProperty({
    example: Date.now(),
    type: Number,
  })
  @Type(() => Number)
  @IsNumber()
  from: number;
}
