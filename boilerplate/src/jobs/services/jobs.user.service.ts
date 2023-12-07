import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';
import { SettingService } from 'src/common/setting/services/setting.service';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class JobUserService {
    private readonly logger = new Logger(JobUserService.name);

    constructor(
        private readonly settingService: SettingService,
        private readonly userService: UserService,
        private readonly helperDateService: HelperDateService,
    ) {}

    @Cron(CronExpression.EVERY_30_MINUTES, {
        name: 'autoResetPasswordAttempt',
        timeZone: 'Asia/Saigon',
    })
    async autoResetPasswordAttempt() {
        this.logger.log(
            `Cronjob: autoResetPasswordAttempt running at ${this.helperDateService.create()}`,
        );
        const passwordAttempt: boolean =
            await this.settingService.getPasswordAttempt();

        if (passwordAttempt) {
            await this.userService.resetAllPasswordAttempt();
        }
    }
}
