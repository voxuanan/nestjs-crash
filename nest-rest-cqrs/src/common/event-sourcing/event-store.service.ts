import { Injectable } from '@nestjs/common';
import { EventBus, IEvent, UnhandledExceptionBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject, takeUntil } from 'rxjs';
import { Repository } from 'typeorm';
import { readConnection } from '../common.module';
import { EventProcessingAttemptEntity } from './entity/event-processcing-attempt.entity';
import { EventSourcingEntity } from './entity/event-sourcing.entity';
import { HelperDateService } from '../helper/services/helper.date.service';

@Injectable()
export class EventStoreService {
  private destroy$ = new Subject<void>();

  constructor(
    private readonly eventBus: EventBus,
    private readonly unhandledExceptionsBus: UnhandledExceptionBus,
    private readonly helperDateService: HelperDateService,
    @InjectRepository(EventSourcingEntity)
    private eventSourcingRepository: Repository<EventSourcingEntity>,
    @InjectRepository(EventProcessingAttemptEntity)
    private eventProcessingEttemptRepository: Repository<EventProcessingAttemptEntity>,
  ) {
    this.eventBus.pipe(takeUntil(this.destroy$)).subscribe(async (event) => {
      if (!(event as any).oldProcess) {
        await this.store(event as IEvent & { id: string });
      }
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

  private async store(event: IEvent & { id: string }) {
    const { id, ...data } = event;
    const create = new EventSourcingEntity({
      id,
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
