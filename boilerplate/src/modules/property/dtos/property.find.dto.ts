import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

export class FindPropertiesDTO {
    @ApiProperty({ example: faker.date.recent() })
    @IsNumberString()
    @IsNotEmpty()
    public startDate: number;

    @ApiProperty()
    @IsNumberString()
    @IsOptional()
    public endDate?: number;
}
