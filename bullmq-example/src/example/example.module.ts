import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import {
  EXAMPLE_QUEUE,
  EXAMPLE_QUEUE_PREFIX,
} from 'src/constants/example.queue.constant';
import { ExampleService } from './example.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: EXAMPLE_QUEUE,
      prefix: EXAMPLE_QUEUE_PREFIX,
    }),
  ],
  providers: [ExampleService],
})
export class ExampleModule {}
