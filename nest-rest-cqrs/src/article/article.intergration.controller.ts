import { Controller, Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OmitType } from '@nestjs/swagger';
import { KafkaMessage } from 'kafkajs';
import { EventProcessingService } from 'src/common/event-sourcing/event-processing.service';
import { ENUM_KAFKA_TOPIC } from 'src/common/kafka/constants/topic.enum.constant';
import { MessageHandler } from 'src/common/kafka/services/kafka.consumer.service';
import { TestLogCommand } from 'src/test/cqrs/application/command/test.log.command';

@Controller()
export class ArticleIntegrationController {
  @Inject() private readonly commandBus: CommandBus;
  @Inject() private readonly eventProcessingService: EventProcessingService;

  @MessageHandler(ENUM_KAFKA_TOPIC.ARTICLE_UPDATE_NAME)
  async articleUpdateEvent(message: KafkaMessage): Promise<void> {
    await this.commandBus.execute(new TestLogCommand(message.value.toString()));
  }
}
