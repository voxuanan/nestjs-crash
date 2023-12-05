import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventProcessingAttemptEntity } from './entity/event-processcing-attempt.entity';
import { ENUM_EVENT_PROCESSING_STATUS } from './contants/event-sourcing.enum';
import { EventSourcingEntity } from './entity/event-sourcing.entity';

export interface StartEventProcessingAttemptInput {
  eventId: string;
  processorName: string;
}

export interface StartEventProcessingAttemptOutput {
  attemptId: string;
}

export interface ReportSuccessfulEventProcessingAttemptInput {
  attemptId: string;
}

interface ReportFailedEventProcessingAttempt<T> {
  attemptId: string;
  error: T;
}

@Injectable()
export class EventProcessingService {
  constructor(
    @InjectRepository(EventProcessingAttemptEntity)
    private eventProcessingEttemptRepository: Repository<EventProcessingAttemptEntity>,
  ) {}

  async processEvent<T>(
    eventId: string,
    processorName: string,
  ): Promise<{ attemptId: string; eventId: string; processorName: string }> {
    const { attemptId } = await this.startEventProcessingAttempt({
      eventId,
      processorName,
    });

    return { attemptId, eventId, processorName };
  }

  async startEventProcessingAttempt({
    eventId,
    processorName,
  }: StartEventProcessingAttemptInput): Promise<StartEventProcessingAttemptOutput> {
    const create = new EventProcessingAttemptEntity({
      eventId,
      processorName,
      error: null,
      finishedAt: null,
      status: ENUM_EVENT_PROCESSING_STATUS.IN_PROGRESS,
    });
    const record = await this.eventProcessingEttemptRepository
      .create(create)
      .save();

    return { attemptId: record.id };
  }

  async reportSuccessfulEventProcessingAttempt({
    attemptId,
  }: ReportSuccessfulEventProcessingAttemptInput): Promise<void> {
    await this.eventProcessingEttemptRepository.update(
      { id: attemptId },
      { status: ENUM_EVENT_PROCESSING_STATUS.SUCCESS, finishedAt: new Date() },
    );
  }

  async reportFailedEventProcessingAttempt<T = unknown>({
    attemptId,
    error,
  }: ReportFailedEventProcessingAttempt<T>): Promise<void> {
    await this.eventProcessingEttemptRepository.update(
      { id: attemptId },
      {
        status: ENUM_EVENT_PROCESSING_STATUS.SUCCESS,
        finishedAt: new Date(),
        error: JSON.stringify(error),
      },
    );
  }
}
