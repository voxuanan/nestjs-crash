import { Injectable } from '@nestjs/common';
import { readConnection } from '../common.module';
import { HelperDateService } from '../helper/services/helper.date.service';
import { EventProcessingAttemptEntity } from './entity/event-processcing-attempt.entity';
import { EventSourcingEntity } from './entity/event-sourcing.entity';

@Injectable()
export class EventStoreService {
  constructor(private readonly helperDateService: HelperDateService) {}

  public async getEvents(
    timestamp: number = 0,
  ): Promise<
    (EventSourcingEntity & { processAttempt: EventProcessingAttemptEntity })[]
  > {
    const records = await readConnection
      .createQueryBuilder(EventSourcingEntity, 'event-sourcing')
      .leftJoinAndMapOne(
        'event-sourcing.processAttempt',
        EventProcessingAttemptEntity,
        'event-processing',
        'event-sourcing.id = event-processing.eventId',
      )
      .where('event-sourcing.createdAt > :timeThreshold', {
        timeThreshold: this.helperDateService.create(timestamp),
      })
      .orderBy('event-sourcing.createdAt', 'ASC')
      .getMany();

    return records as unknown as (EventSourcingEntity & {
      processAttempt: EventProcessingAttemptEntity;
    })[];
  }
}
