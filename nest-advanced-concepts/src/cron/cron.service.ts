import { IntervalHost } from 'src/scheduler/decorators/interval-host.decorator';
import { Interval } from 'src/scheduler/decorators/interval-key.decorator';

@IntervalHost
export class CronService {
  @Interval(1000)
  everySecond() {
    console.log('Log every second');
  }
}
