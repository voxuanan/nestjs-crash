import { Injectable } from '@nestjs/common';
import {
  EventBus,
  IEvent,
  IEventPublisher,
  IMessageSource,
  UnhandledExceptionBus,
} from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject, takeUntil } from 'rxjs';
import { Repository } from 'typeorm';
import { readConnection } from '../common.module';
import { HelperDateService } from '../helper/services/helper.date.service';
import { EventProcessingAttemptEntity } from './entity/event-processcing-attempt.entity';
import { EventSourcingEntity } from './entity/event-sourcing.entity';
import { EventProcessingService } from './event-processing.service';

@Injectable()
export class EventStore implements IEventPublisher, IMessageSource {
  private subject$: Subject<any>;
  private destroy$ = new Subject<void>();

  constructor(
    private readonly eventBus: EventBus,
    private readonly unhandledExceptionsBus: UnhandledExceptionBus,
    private readonly helperDateService: HelperDateService,
    @InjectRepository(EventSourcingEntity)
    private eventSourcingRepository: Repository<EventSourcingEntity>,
    private readonly eventProcessingService: EventProcessingService,
  ) {
    this.eventBus.pipe(takeUntil(this.destroy$)).subscribe(async (event) => {
      await this.store(event as IEvent & { id: string; aggregateId: string });
    });

    this.unhandledExceptionsBus
      .pipe(takeUntil(this.destroy$))
      .subscribe((exceptionInfo) => {
        console.info('unhandled exception');
        console.error(exceptionInfo);
        return;
      });
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  publish<TEvent extends IEvent & { id?: string }>(
    event: TEvent,
    context?: unknown,
  ) {
    return this.eventProcessingService.processEvent(
      event.id,
      event.constructor.name,
      async () => {
        this.subject$.next(event);
      },
    );
  }

  publishAll?<TEvent extends IEvent>(events: TEvent[], context?: unknown) {
    if (events.length != 0) {
      events.forEach((event) => this.publish(event, context));
    }
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
    this.subject$ = subject;
  }

  private async store(event: IEvent & { id: string; aggregateId: string }) {
    const { id, aggregateId, ...data } = event;
    const create = new EventSourcingEntity({
      id,
      aggregateId,
      data: JSON.stringify(data),
      name: event.constructor.name,
    });
    this.eventSourcingRepository.create(create).save();
  }

  public async getEvents(
    timestamp: number = 0,
  ): Promise<
    (EventSourcingEntity & { processAttempt: EventProcessingAttemptEntity })[]
  > {
    const records = await readConnection
      .createQueryBuilder(EventSourcingEntity, 'event')
      .leftJoinAndMapOne(
        'event.processAttempt',
        EventProcessingAttemptEntity,
        'processAttempt',
        'event.id = processAttempt.eventId',
      )
      .where('event.createdAt > :timeThreshold', {
        timeThreshold: this.helperDateService.create(timestamp),
      })
      .orderBy('event.createdAt', 'ASC')
      .getMany();

    return records as unknown as (EventSourcingEntity & {
      processAttempt: EventProcessingAttemptEntity;
    })[];
  }
}
