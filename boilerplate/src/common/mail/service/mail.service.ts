import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import {
    MAIL_TEMPLATE,
    MAIL_TEMPLATE_SUBJECT,
} from '../constants/mail.template.enum.constant';
import {
    mailForgotPasswordContext,
    mailSavedSearchContext,
} from '../constants/mail.job-data.constant';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendMail(to: string, subject: string, text: string) {
        try {
            await this.mailerService.sendMail({
                to,
                subject,
                text,
                html: `<b>${text}</b>`,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async sendMailForgotPassword(
        email: string,
        context: mailForgotPasswordContext,
    ) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: MAIL_TEMPLATE_SUBJECT.FORGOT_PASSWORD,
                template: MAIL_TEMPLATE.FORGOT_PASSWORD,
                context,
            });
        } catch (error) {
            console.log(error);
        }
    }

    async sendMailSavedSearch(email: string, context: mailSavedSearchContext) {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: MAIL_TEMPLATE_SUBJECT.SAVED_SEATCH,
                template: MAIL_TEMPLATE.SAVED_SEATCH,
                context,
            });
        } catch (error) {
            console.log(error);
        }
    }
}
