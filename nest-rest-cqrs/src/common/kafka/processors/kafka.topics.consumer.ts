import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from '../services/kafka.consumer.service';
import { ENUM_KAFKA_TOPIC } from '../constants/topic.enum.constant';

@Injectable()
export class KafkaTopicsConsumer implements OnModuleInit {
  constructor(private readonly consumerService: KafkaConsumerService) {}

  async onModuleInit() {
    for (const topic of Object.values(ENUM_KAFKA_TOPIC)) {
      await this.consumerService.consume({
        topic: { topic },
        config: { groupId: topic },
        onMessage: async (message) => {
          // console.log({
          //   value: message.value.toString(),
          // });
        },
      });
    }
  }
}
