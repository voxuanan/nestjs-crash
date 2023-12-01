import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateNameArticleEvent } from '../../domain/event/article.update';
import { Transactional } from 'src/common/request-storage/transactional';
import { KafkaProducerService } from 'src/common/kafka/services/kafka.producer.service';
import { ENUM_KAFKA_TOPIC } from 'src/common/kafka/constants/topic.enum.constant';

@EventsHandler(UpdateNameArticleEvent)
export class NameUpdatedEventHandler
  implements IEventHandler<UpdateNameArticleEvent>
{
  constructor(private readonly producerService: KafkaProducerService) {}

  @Transactional()
  async handle(event: UpdateNameArticleEvent): Promise<void> {
    await this.producerService.produce(ENUM_KAFKA_TOPIC.ARTICLE_UPDATE_NAME, {
      value: JSON.stringify(event),
    });
  }
}
