import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { KafkaModule } from 'src/common/kafka/kafka.module';
import { MigrationKafkaTopicsSeed } from './seeds/migration.kafka-topics.seed';
import { CommonModule } from 'src/common/common.module';
import { TestModule } from 'src/test/test.module';
import { MigrationTestSeed } from './seeds/test.seed';

@Module({
  imports: [CommonModule, CommandModule, KafkaModule, TestModule],
  providers: [MigrationKafkaTopicsSeed, MigrationTestSeed],
  exports: [],
})
export class MigrationModule {}
