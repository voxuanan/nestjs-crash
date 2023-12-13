import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { EventSourcingEntity } from '../entity/event-sourcing.entity';

export abstract class EventSourcingProjectionService<T> {
  abstract _entity: T[];
  abstract readonly _name: string;

  @InjectRepository(EventSourcingEntity)
  abstract eventSourcingRepository: Repository<EventSourcingEntity>;

  makeAggregateId(id: string): string {
    return `${this._name}-${id}`;
  }

  async loadAggregateItems(id: string): Promise<EventSourcingEntity[]> {
    return this.eventSourcingRepository.find({
      where: { aggregateId: this.makeAggregateId(id) },
      order: { createdAt: 'ASC' },
    });
  }

  async loadByAggregateName(): Promise<EventSourcingEntity[]> {
    return this.eventSourcingRepository.find({
      where: {
        aggregateId: Like(`${this._name}%`),
      },
    });
  }

  abstract findEntity(aggregateId: any): T | undefined;

  abstract projection(events: EventSourcingEntity[]): Promise<void>;
}
