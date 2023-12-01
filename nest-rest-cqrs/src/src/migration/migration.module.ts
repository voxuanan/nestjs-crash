import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { KafkaModule } from 'src/common/kafka/kafka.module';
import { MigrationKafkaTopicsSeed } from './seeds/migration.kafka-topics.seed';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule, CommandModule, KafkaModule],
  providers: [MigrationKafkaTopicsSeed],
  exports: [],
})
export class MigrationModule {}
