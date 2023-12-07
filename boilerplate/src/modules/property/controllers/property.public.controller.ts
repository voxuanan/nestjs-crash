import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindPropertiesDTO } from '../dtos/property.find.dto';
import { PropertyService } from '../services/property.service';
import { IProperty } from '../interface/property.interface';

@ApiTags('Properties')
@Controller('properties')
export class PropertyPulicController {
    constructor(private readonly propertyService: PropertyService) {}

    @Get('')
    async findAll(
        @Query()
        query: FindPropertiesDTO,
    ): Promise<IProperty[]> {
        return this.propertyService.getPropertiesData(query);
    }
}
