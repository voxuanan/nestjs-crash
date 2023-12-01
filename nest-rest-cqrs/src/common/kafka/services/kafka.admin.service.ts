import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin, Kafka } from 'kafkajs';
import { sleep } from '../../helper/constants/helper.function.constant';
import { IKafkaAdmin } from '../interfaces/kafka.admin.interface';

export class KafkaJsAdmin implements IKafkaAdmin {
  private readonly kafka: Kafka;
  private readonly admin: Admin;

  constructor(broker: string) {
    this.kafka = new Kafka({
      brokers: [broker],
    });
    this.admin = this.kafka.admin();
  }

  async connect() {
    try {
    } catch (err) {
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    await this.admin.disconnect();
  }

  async getAllTopic(): Promise<string[]> {
    return this.admin.listTopics();
  }

  async getAllTopicUnique(): Promise<string[]> {
    return [...new Set(await this.getAllTopic())].filter(
      (val) => val !== '__consumer_offsets',
    );
  }

  async createTopics(topics: string[]) {
    await this.admin.createTopics({
      waitForLeaders: true,
      topics: Object.values(topics).map((topic) => ({ topic })),
    });
  }

  async deleteTopics(topics: string[]): Promise<boolean> {
    const currentTopic: string[] = await this.getAllTopicUnique();

    const data = [];

    for (const topic of topics) {
      if (currentTopic.includes(topic)) {
        data.push(topic);
      }
    }

    if (data.length > 0) {
      await this.admin.deleteTopics({
        topics: data,
      });
    }
    return true;
  }
}

@Injectable()
export class KafkaAdminService implements OnApplicationShutdown {
  public admin: IKafkaAdmin;

  constructor(private readonly configService: ConfigService) {
    this.admin = new KafkaJsAdmin(this.configService.get('KAFKA_BROKER'));
  }

  async connect() {
    await this.admin.connect();
  }

  async createTopics(topics: string[]) {
    await this.admin.createTopics(topics);
  }

  async deleteTopics(topics: string[]): Promise<boolean> {
    return await this.admin.deleteTopics(topics);
  }

  async onApplicationShutdown() {
    await this.admin.disconnect();
  }
}
