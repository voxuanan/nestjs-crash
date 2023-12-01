import { DiscoveryModule } from '@nestjs-plus/discovery';
import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './services/kafka.consumer.service';
import { KafkaProducerService } from './services/kafka.producer.service';
import { KafkaTopicsConsumer } from './processors/kafka.topics.consumer';
import { KafkaAdminService } from './services/kafka.admin.service';

@Module({
  imports: [DiscoveryModule],
  providers: [
    KafkaProducerService,
    KafkaConsumerService,
    KafkaTopicsConsumer,
    KafkaAdminService,
  ],
  exports: [
    KafkaProducerService,
    KafkaConsumerService,
    KafkaTopicsConsumer,
    KafkaAdminService,
  ],
})
export class KafkaModule {}
