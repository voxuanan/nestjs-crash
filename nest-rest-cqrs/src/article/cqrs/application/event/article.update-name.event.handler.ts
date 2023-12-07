import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ENUM_KAFKA_TOPIC } from 'src/common/kafka/constants/topic.enum.constant';
import { KafkaProducerService } from 'src/common/kafka/services/kafka.producer.service';
import { Transactional } from 'src/common/request-storage/transactional';
import { UpdateNameArticleEvent } from '../../domain/event/article.update';

@EventsHandler(UpdateNameArticleEvent)
export class NameUpdatedEventHandler
  implements IEventHandler<UpdateNameArticleEvent>
{
  constructor(private readonly producerService: KafkaProducerService) {}

  @Transactional()
  async handle(event: UpdateNameArticleEvent): Promise<void> {
    return this.producerService.produce(ENUM_KAFKA_TOPIC.ARTICLE_UPDATE_NAME, {
      value: JSON.stringify({ ...event }),
    });
  }
}
