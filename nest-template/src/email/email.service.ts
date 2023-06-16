import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailJobData } from './email.consumer';
import { InjectQueue } from '@nestjs/bull';
import { QueueJob, Queue_Enum } from 'src/common/enums/queue.enum';
import { Queue } from 'bull';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import VerificationTokenPayload from './interface/verificationTokenPayload.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectQueue(Queue_Enum.EmailQueue) private emailQueue: Queue,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  public async resendConfirmationLink(userId: number) {
    const user = await this.usersService.getById(userId);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
  }

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}`;

    const text = `Welcome to the application. To confirm the email address, click here: ${url}`;

    return this.sendEmail(email, 'Email confirmation', text);
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.getByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.usersService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

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
