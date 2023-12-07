import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { SavedSeachConsumer } from 'src/modules/saved-search/processors/saved-search.procesor';

@Injectable()
export class JobSavedSearchService {
    private readonly logger = new Logger(JobSavedSearchService.name);

    constructor(
        private readonly helperDateService: HelperDateService,
        private readonly savedSeachConsumer: SavedSeachConsumer,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_11PM, {
        name: 'autoSavedSearchNewMatching',
        timeZone: 'Asia/Saigon',
    })
    async autoSavedSearchNewMatching() {
        this.logger.log(
            `Cronjob: autoSavedSearchNewMatching running at ${this.helperDateService.create()}`,
        );
        this.savedSeachConsumer.savedSearchNewMatching({
            limit: 10,
            offset: 0,
            setLastRun: true,
        });
    }
}
