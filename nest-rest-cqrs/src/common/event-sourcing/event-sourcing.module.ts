import { DynamicModule, Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventProcessingAttemptEntity } from './entity/event-processcing-attempt.entity';
import { EventSourcingEntity } from './entity/event-sourcing.entity';
import { EventProcessingService } from './event-processing.service';
import { EventSourcingController } from './event-sourcing.controller';
import { EventStore } from './event-store';
import { EventStoreService } from './event-store.service';

@Global()
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      EventSourcingEntity,
      EventProcessingAttemptEntity,
    ]),
  ],
  controllers: [EventSourcingController],
  providers: [EventStoreService],
  exports: [EventStoreService],
})
export class EventSourcingModule {
  static forRoot(): DynamicModule {
    return {
      module: EventSourcingModule,
    };
  }

  static forFeature(): DynamicModule {
    return {
      module: EventSourcingModule,
      providers: [EventProcessingService, EventStore],
      exports: [EventProcessingService, EventStore],
    };
  }
}
