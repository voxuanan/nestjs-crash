import { Injectable } from '@nestjs/common';
import { FindPropertiesDTO } from '../dtos/property.find.dto';
import { ENUM_MAPPING_RULES_RESOURCE } from 'src/modules/saved-search/constants/saved-search-mapping-rule.contant';
import { RedisEventBusService } from 'src/common/microservice/services/redis.event-bus.service';
import { IProperty } from '../interface/property.interface';

@Injectable()
export class PropertyService {
    constructor(private readonly redisEventBusService: RedisEventBusService) {}
    public async getPropertiesData(
        query?: FindPropertiesDTO,
    ): Promise<IProperty[]> {
        return this.redisEventBusService.sendSyncRequest({
            function: 'getPropertiesData',
            args: [query],
        }) as unknown as IProperty[];
    }

    public preparePropertyData(
        property: IProperty,
        mapKey: string,
        resource = ENUM_MAPPING_RULES_RESOURCE.Trestle,
    ) {
        let data = null;
        if ((resource = ENUM_MAPPING_RULES_RESOURCE.Trestle)) {
            switch (mapKey) {
                case 'PropertyType':
                    data =
                        property[mapKey] == 'CommercialLease'
                            ? 'lease'
                            : 'sale';
                    break;
                case 'Latitude,Longitude':
                case 'Longitude,Latitude':
                    data =
                        property.Longitude && property.Latitude
                            ? {
                                  Longitude: property.Longitude,
                                  Latitude: property.Latitude,
                              }
                            : null;
                    break;
                default:
                    data = property[mapKey];
            }
        }

        if ((resource = ENUM_MAPPING_RULES_RESOURCE.Homing)) {
        }
        return data;
    }
}
