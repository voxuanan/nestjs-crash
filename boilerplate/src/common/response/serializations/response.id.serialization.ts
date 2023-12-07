import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ResponseIdSerialization {
    @ApiProperty({
        description: 'Id that representative with your target data',
        example: faker.number.int(),
        required: true,
        nullable: false,
    })
    @Type(() => Number)
    id: number;
}
