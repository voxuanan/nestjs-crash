import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Queue } from 'bull';
import { QueueEnum, QueueJobs } from 'src/constants/queue.constant';

@Controller('sample')
export class SampleController {
  constructor(@InjectQueue(QueueEnum.SampleQueue) private sampleQueue: Queue) {}

  @Get('test')
  async addSampleQueue() {
    await this.sampleQueue.add(
      QueueJobs.SampleQueueTestJob,
      {},
      {
        attempts: 10,
        backoff: {
          type: 'binaryExponential',
          options: {
            delay: 1000,
          },
        },
      },
    );
    return 'Sample Queue Added';
  }
}
