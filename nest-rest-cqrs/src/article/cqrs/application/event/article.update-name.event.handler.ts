import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateNameArticleEvent } from '../../domain/event/article.update';
import { Transactional } from 'src/common/request-storage/transactional';
import { KafkaProducerService } from 'src/common/kafka/services/kafka.producer.service';
import { ENUM_KAFKA_TOPIC } from 'src/common/kafka/constants/topic.enum.constant';
import {
  EventProcessingService,
  StartEventProcessingAttemptOutput,
} from 'src/common/event-sourcing/event-processing.service';

@EventsHandler(UpdateNameArticleEvent)
export class NameUpdatedEventHandler
  implements IEventHandler<UpdateNameArticleEvent>
{
  constructor(
    private readonly producerService: KafkaProducerService,
    private readonly eventProcessingService: EventProcessingService,
  ) {}

  @Transactional()
  async handle(event: UpdateNameArticleEvent): Promise<void> {
    let attemptId = event.id;
    if (!event.oldProcess) {
      const data: StartEventProcessingAttemptOutput =
        await this.eventProcessingService.startEventProcessingAttempt({
          eventId: event.id,
          processorName: this.constructor.name,
        });
      attemptId = data.attemptId;
    }

    try {
      await this.producerService.produce(ENUM_KAFKA_TOPIC.ARTICLE_UPDATE_NAME, {
        value: JSON.stringify({ ...event }),
      });

      await this.eventProcessingService.reportSuccessfulEventProcessingAttempt({
        attemptId: attemptId,
      });
    } catch (error) {
      await this.eventProcessingService.reportFailedEventProcessingAttempt({
        attemptId: attemptId,
        error: error.toString(),
      });

      throw error;
    }
  }
}
