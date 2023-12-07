import { Injectable } from '@nestjs/common';
import fs from 'fs';
import * as path from 'path';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';

@Injectable()
export class LastRunService {
    private readonly filePathLastRunOpenresync = path.join(
        __dirname,
        '../',
        'constants',
        'openresync.last-run.txt',
    );

    constructor(private readonly helperDateService: HelperDateService) {}

    getLastRunOpenresync = () => {
        let data;
        try {
            data = fs.readFileSync(this.filePathLastRunOpenresync, 'utf8');
        } catch (err) {
            data = this.helperDateService.timestamp(
                this.helperDateService.backwardInDays(1),
            );
            fs.writeFileSync(this.filePathLastRunOpenresync, data.toString());
        }
        return parseInt(data);
    };

    setLastRunOpenresync = (timeStamp: number) => {
        fs.writeFileSync(this.filePathLastRunOpenresync, timeStamp.toString());
    };
}
