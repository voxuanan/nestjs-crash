import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueEnum, QueueJobs } from 'src/constants/queue.constant';

@Processor(QueueEnum.SampleQueue)
export class SampleConsumer {
  private readonly logger = new Logger(SampleConsumer.name);

  constructor() {}

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

  @Process(QueueJobs.SampleQueueTestJob)
  async test(job: Job) {
    // log current timestamp
    console.log(new Date().toISOString());
    throw new Error('Error');
  }
}
