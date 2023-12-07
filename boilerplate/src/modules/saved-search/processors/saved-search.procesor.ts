import {
    InjectQueue,
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';
import { Inject, Logger, forwardRef } from '@nestjs/common';
import { Job, Queue } from 'bull';

import { SavedSearchService } from '../services/saved-search.service';
import {
    SAVED_SEARCH_QUEUE,
    SAVED_SEARCH_QUEUE_JOB,
} from '../constants/saved-search.queue.constant';
import { savedSearchJobData } from '../constants/saved-search.job-data.constant';

@Processor(SAVED_SEARCH_QUEUE)
export class SavedSeachConsumer {
    private readonly logger = new Logger(SavedSeachConsumer.name);

    constructor(
        @InjectQueue(SAVED_SEARCH_QUEUE)
        private savedSearchQueue: Queue,
        @Inject(forwardRef(() => SavedSearchService))
        private readonly savedSearchService: SavedSearchService,
    ) {}

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

    async savedSearchNewMatching(data: savedSearchJobData) {
        return this.savedSearchQueue.add(
            SAVED_SEARCH_QUEUE_JOB.SAVED_SEARCH_NEW_MATCHING,
            data,
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: true,
                removeOnFail: true,
            },
        );
    }

    @Process(SAVED_SEARCH_QUEUE_JOB.SAVED_SEARCH_NEW_MATCHING)
    async processSavedSearchNewMatching(job: Job) {
        const { limit, offset, setLastRun, dto }: savedSearchJobData = job.data;
        await this.savedSearchService.savedSearchMatchingProperties(
            limit,
            offset,
            setLastRun,
            dto,
        );
    }
}
