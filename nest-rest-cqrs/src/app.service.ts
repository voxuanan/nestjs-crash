import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from './common/kafka/services/kafka.producer.service';
import { ENUM_KAFKA_TOPIC } from './common/kafka/constants/topic.enum.constant';

@Injectable()
export class AppService {
  constructor(private readonly producerService: KafkaProducerService) {}

  async getHello() {
    await this.producerService.produce(ENUM_KAFKA_TOPIC.TEST, {
      value: JSON.stringify({ Test: 'Hello World!' }),
    });
    return 'Hello World!';
  }
}
