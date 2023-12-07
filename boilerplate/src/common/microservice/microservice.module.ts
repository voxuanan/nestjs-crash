import { Global, Module } from '@nestjs/common';
import { RedisEventBusService } from './services/redis.event-bus.service';
import { LastRunService } from './services/microservice.last-run.service';

@Global()
@Module({
    imports: [],
    providers: [RedisEventBusService, LastRunService],
    exports: [RedisEventBusService, LastRunService],
})
export class MicroserviceModule {}
