import {
    InjectQueue,
    OnQueueActive,
    OnQueueCompleted,
    OnQueueFailed,
    Process,
    Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { MAIL_QUEUE, MAIL_QUEUE_JOB } from '../constants/mail.queue.constant';
import { MailService } from '../service/mail.service';
import {
    mailForgotPasswordJobData,
    mailSavedSearchJobData,
} from '../constants/mail.job-data.constant';

@Processor(MAIL_QUEUE)
export class MailConsumer {
    private readonly logger = new Logger(MailConsumer.name);

    constructor(
        private readonly mailService: MailService,
        @InjectQueue(MAIL_QUEUE) private emailQueue: Queue,
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

    async sendMailForgotPassword(data: mailForgotPasswordJobData) {
        return this.emailQueue.add(
            MAIL_QUEUE_JOB.SEND_MAIL_FORGOT_PASSWORD,
            data,
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: true,
                removeOnFail: true,
            },
        );
    }

    @Process(MAIL_QUEUE_JOB.SEND_MAIL_FORGOT_PASSWORD)
    async processSendMailForgotPassword(job: Job) {
        const { email, context }: mailForgotPasswordJobData = job.data;

        await this.mailService.sendMailForgotPassword(email, context);
    }

    async sendMailSavedSearch(data: mailSavedSearchJobData) {
        return this.emailQueue.add(
            MAIL_QUEUE_JOB.SEND_MAIL_SAVED_SEARCH,
            data,
            {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: true,
                removeOnFail: true,
            },
        );
    }

    @Process(MAIL_QUEUE_JOB.SEND_MAIL_SAVED_SEARCH)
    async processSendMailSavedSearch(job: Job) {
        const { email, context }: mailSavedSearchJobData = job.data;

        await this.mailService.sendMailSavedSearch(email, context);
    }
}
