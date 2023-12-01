import { DiscoveryService } from '@nestjs-plus/discovery';
import {
  Inject,
  Injectable,
  Logger,
  OnApplicationShutdown,
  SetMetadata,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModulesContainer } from '@nestjs/core';
import retry from 'async-retry';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopic,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import { sleep } from '../../helper/constants/helper.function.constant';
import { IKafkaConsumer } from '../interfaces/kafka.consumer.interface';
import { RequestStorage } from '../../request-storage/request-storage';
import { IEvent } from '@nestjs/cqrs';

interface KafkajsConsumerOptions {
  topic: ConsumerSubscribeTopic;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<void>;
}

type Message = Readonly<{ name: string; body: IEvent; requestId: string }>;
type MessageHandlerMetadata = Readonly<{ name: string }>;

const KAFKA_CONSUMER_METHOD = Symbol.for('KAFKA_CONSUMER_METHOD');
export const MessageHandler = (name: string) =>
  SetMetadata<symbol, MessageHandlerMetadata>(KAFKA_CONSUMER_METHOD, { name });

export class KafkajsConsumer implements IKafkaConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: ConsumerSubscribeTopic,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topic}-${config.groupId}`);
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await retry(async () => onMessage(message), {
            retries: 3,
            onRetry: (error, attempt) =>
              this.logger.error(
                `Error consuming message, executing retry ${attempt}/3...`,
                error,
              ),
          });
        } catch (err) {
          this.logger.error(
            'Error consuming message. Adding to dead letter queue...',
            err,
          );
        }
      },
    });
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown {
  private readonly consumers: IKafkaConsumer[] = [];
  @Inject() private readonly discover: DiscoveryService;

  constructor(
    private readonly configService: ConfigService,
    private readonly modulesContainer: ModulesContainer,
  ) {}

  async consume({ topic, config, onMessage }: KafkajsConsumerOptions) {
    RequestStorage.reset();
    const consumer = new KafkajsConsumer(
      topic,
      config,
      this.configService.get('KAFKA_BROKER'),
    );

    const handler = (
      await this.discover.controllerMethodsWithMetaAtKey<MessageHandlerMetadata>(
        KAFKA_CONSUMER_METHOD,
      )
    ).find((handler) => handler.meta.name === (consumer as any).topic.topic);

    // Request ID ??
    // RequestStorage.setRequestId(message.requestId);

    if (handler) {
      const controller = Array.from(this.modulesContainer.values())
        .filter((module) => 0 < module.controllers.size)
        .flatMap((module) => Array.from(module.controllers.values()))
        .find(
          (wrapper) =>
            wrapper.name == handler.discoveredMethod.parentClass.name,
        );

      const overriteOnMessage: (message: KafkaMessage) => Promise<void> =
        await handler.discoveredMethod.handler.bind(controller.instance);

      await consumer.connect();
      await consumer.consume(overriteOnMessage);
      this.consumers.push(consumer);
    } else {
      await consumer.connect();
      await consumer.consume(onMessage);
      this.consumers.push(consumer);
    }
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
