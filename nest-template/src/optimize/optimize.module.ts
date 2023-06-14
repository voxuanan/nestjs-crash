import { Module } from '@nestjs/common';
import { OptimizeController } from './optimize.controller';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { QueueJob, Queue_Enum } from 'src/common/enums/queue.enum';
import { ImageScheduleService } from './imageSchedule.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queue_Enum.ImageQueue,
      processors: [
        {
          name: QueueJob.ImageQueueOptimizeJob,
          path: join(__dirname, 'image.processor.js'),
        },
      ],
    }),
  ],
  providers: [ImageScheduleService],
  exports: [],
  controllers: [OptimizeController],
})
export class OptimizeModule {}
