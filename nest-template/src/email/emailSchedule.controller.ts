import { Body, Controller, UseGuards, Post } from '@nestjs/common';

import EmailScheduleDto from './dto/emailSchedule.dto';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import { EmailScheduleService } from './emailSchedule.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Email')
@Controller('email-scheduling')
export default class EmailSchedulingController {
  constructor(private readonly emailSchedulingService: EmailScheduleService) {}

  @ApiBody({
    type: EmailScheduleDto,
  })
  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    await this.emailSchedulingService.scheduleEmail(emailSchedule);
    return true;
  }
}
