import { Controller, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { KafkaMessage } from 'kafkajs';
import { ENUM_KAFKA_TOPIC } from 'src/common/kafka/constants/topic.enum.constant';
import { MessageHandler } from 'src/common/kafka/services/kafka.consumer.service';
import { TestLogCommand } from 'src/test/cqrs/application/command/test.log.command';

@Controller()
export class ArticleIntegrationController {
  @Inject() private readonly commandBus: CommandBus;

  @MessageHandler(ENUM_KAFKA_TOPIC.ARTICLE_UPDATE_NAME)
  async articleUpdateEvent(message: KafkaMessage): Promise<void> {
    await this.commandBus.execute(
      new TestLogCommand(JSON.parse(message.value.toString())),
    );
  }
}
