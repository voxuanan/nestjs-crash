import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailJobData } from './email.consumer';
import { InjectQueue } from '@nestjs/bull';
import { QueueJob, Queue_Enum } from 'src/common/enums/queue.enum';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue(Queue_Enum.EmailQueue) private emailQueue: Queue,
  ) {}

  public async sendEmail(
    to: string,
    subject: string,
    text?: string,
    templatePath?: string,
    data?: any,
  ) {
    if (!text) {
      await this.mailerService.sendMail({
        to,
        subject: subject,
        template: templatePath,
        context: data,
      });
    } else {
      await this.mailerService.sendMail({
        to,
        subject: subject,
        html: text,
      });
    }
  }

  public makeNameCached(email: string, templatePath: string) {
    return `CachedSendEmail.${templatePath}.${email}`;
  }

  async addMailToQueueSendMailJob(data: SendMailJobData) {
    return this.emailQueue.add(QueueJob.EmailQueueSendMailJob, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 4000,
      },
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
}
