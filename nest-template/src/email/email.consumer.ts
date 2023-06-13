import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { Queue_Enum, QueueJob } from 'src/common/enums/queue.enum';
import { EmailService } from './email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export class SendMailJobData {
  email: string;
  subject: string;
  template: string;
  data?: any;
}

@Processor(Queue_Enum.EmailQueue)
export class EmailConsumer {
  private readonly logger = new Logger(EmailConsumer.name);

  constructor(
    private readonly emailService: EmailService,
    @InjectQueue(Queue_Enum.EmailQueue) private emailQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueCompleted()
  async onQueueCompleted(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, err: any) {
    this.logger.debug(
      `Failed job ${job.id} of type ${job.name}: ${err.message}`,
    );
  }

  @Process(QueueJob.EmailQueueSendMailJob)
  async processSendMailJob(job: Job) {
    const { email, subject, template, data }: SendMailJobData = job.data;
    await this.emailService.sendEmail(
      email,
      subject,
      undefined,
      template,
      data,
    );
  }
}
