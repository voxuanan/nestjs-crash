import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueEnum } from 'src/constants/queue.constant';
import { SampleConsumer } from './sample.consumer';
import { SampleController } from './sample.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueEnum.SampleQueue,
      limiter: {
        duration: 6000,
        max: 180,
      },
      settings: {
        backoffStrategies: {
          //   whaterverNameYouWant
          binaryExponential: function (attemptsMade, err, options) {
            // Options can be undefined, you need to handle it by yourself
            if (!options) {
              options = {};
            }
            const delay = options.delay || 1000;
            // console.error({ attemptsMade, err, options });
            return Math.round((Math.pow(2, attemptsMade) - 1) * delay);
          },
        },
      },
    }),
  ],
  controllers: [SampleController],
  providers: [SampleConsumer],
  exports: [],
})
export class SampleModule {}
