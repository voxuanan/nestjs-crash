import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { KafkaAdminService } from 'src/common/kafka/services/kafka.admin.service';
import { ENUM_KAFKA_TOPIC } from 'src/common/kafka/constants/topic.enum.constant';

@Injectable()
export class MigrationKafkaTopicsSeed {
  constructor(private readonly kafkaAdminService: KafkaAdminService) {}
  @Command({
    command: 'insert:kafka-topics',
    describe: 'insert kafka topics',
  })
  async insert(): Promise<void> {
    try {
      await this.kafkaAdminService.connect();
      await this.kafkaAdminService.createTopics(
        Object.values(ENUM_KAFKA_TOPIC),
      );
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }

  @Command({
    command: 'remove:kafka-topics',
    describe: 'remove kafka topics',
  })
  async remove(): Promise<void> {
    try {
      await this.kafkaAdminService.connect();
      await this.kafkaAdminService.deleteTopics(
        Object.values(ENUM_KAFKA_TOPIC),
      );
    } catch (err: any) {
      throw new Error(err.message);
    }

    return;
  }
}
