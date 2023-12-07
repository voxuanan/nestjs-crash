import {
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SavedSearchService } from '../../saved-search/services/saved-search.service';
import {
    PROPERTY_QUEUE,
    PROPERTY_QUEUE_JOB,
} from '../constants/property.queue.constant';
import { SyncFromMlsJobData } from '../constants/property.job-data.constant';

@Processor(PROPERTY_QUEUE)
export class PropertyConsumer {
    private readonly logger = new Logger(PropertyConsumer.name);

    constructor(private readonly savedSearchService: SavedSearchService) {}

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(
            `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
        );
    }

    @OnQueueCompleted()
    async onQueueCompleted(job: Job) {
        this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
    }

    @OnQueueFailed()
    async onQueueFailed(job: Job, err: any) {
        this.logger.debug(
            `Failed job ${job.id} of type ${job.name}: ${err.message}`,
        );
    }

    @Process(PROPERTY_QUEUE_JOB.PROPERTY_SYNCED)
    async processQueueSyncFromMls(job: Job) {
        const data: SyncFromMlsJobData = job.data;
        await this.savedSearchService.savedSearchMatchingPropertiesContainOldProperty(
            data,
        );
    }
}
