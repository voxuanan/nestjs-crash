import { Injectable, Logger } from '@nestjs/common';
import {
  Cron,
  CronExpression,
  SchedulerRegistry,
  Timeout,
} from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { ejsTemplate } from 'src/common/enums/ejsTemplate.enum';
import { CronJob } from 'cron';
import EmailScheduleDto from './dto/emailSchedule.dto';

@Injectable()
export class EmailScheduleService {
  private readonly logger = new Logger(EmailScheduleService.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  @Timeout('getCrons', 1000)
  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    const IS_CRON_DISABLED = this.configService.get('CRON_DISABLED');

    jobs.forEach((value, key) => {
      if (IS_CRON_DISABLED === 'true') {
        value.stop();
      }

      let next;
      try {
        next = value.nextDates().toJSDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`Cronjob: ${key} -> next: ${next}`);
    });
  }

  // @Cron(CronExpression.EVERY_10_SECONDS, {
  //   name: 'test',
  //   timeZone: 'Asia/Saigon',
  // })
  // async test() {
  //   await this.emailService.addMailToQueueSendMailJob({
  //     email: 'logothanlong159@gmail.com',
  //     subject: 'test',
  //     template: ejsTemplate.test,
  //     data: {
  //       email: 'logothanlong159@gmail.com',
  //     },
  //   });
  // }

  scheduleEmail(emailSchedule: EmailScheduleDto) {
    const date = new Date(emailSchedule.date);
    const job = new CronJob(date, () => {
      this.emailService.sendEmail(
        emailSchedule.recipient,
        emailSchedule.subject,
        emailSchedule.content,
      );
    });

    this.schedulerRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.subject}`,
      job,
    );
    job.start();
  }
}
