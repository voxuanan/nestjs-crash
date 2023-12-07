import { FindPropertiesDTO } from 'src/modules/property/dtos/property.find.dto';

export class savedSearchJobData {
    limit: number;
    offset: number;
    setLastRun: boolean;
    dto?: FindPropertiesDTO;
}
