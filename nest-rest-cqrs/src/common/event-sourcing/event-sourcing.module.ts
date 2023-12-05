import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventStoreService } from './event-store.service';
import { EventProcessingService } from './event-processing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventSourcingEntity } from './entity/event-sourcing.entity';
import { EventProcessingAttemptEntity } from './entity/event-processcing-attempt.entity';
import { EventSourcingController } from './event-sourcing.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      EventSourcingEntity,
      EventProcessingAttemptEntity,
    ]),
  ],
  controllers: [EventSourcingController],
  providers: [EventProcessingService, EventStoreService],
  exports: [EventProcessingService, EventStoreService],
})
export class EventSourcingModule {}
