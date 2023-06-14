import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Queue } from 'bull';
import { Queue_Enum } from 'src/common/enums/queue.enum';

@Injectable()
export class ImageScheduleService {
  constructor(
    @InjectQueue(Queue_Enum.ImageQueue) private readonly imageQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_11PM, {
    name: 'cleanImageInQueue',
    timeZone: 'Asia/Saigon',
  })
  async cleanImageInQueue() {
    await this.imageQueue.clean(0, 'completed');
  }
}
