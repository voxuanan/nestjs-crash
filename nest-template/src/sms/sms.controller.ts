import {
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Req,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { SmsService } from './sms.service';
import JwtAuthenticationGuard from 'src/authentication/guard/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import CheckVerificationCodeDto from './dto/checkVerificationCode.dto';

@ApiTags('sms')
@Controller('sms')
@UseInterceptors(ClassSerializerInterceptor)
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('initiate-verification')
  @UseGuards(JwtAuthenticationGuard)
  async initiatePhoneNumberVerification(@Req() request: RequestWithUser) {
    if (request.user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number already confirmed');
    }
    await this.smsService.initiatePhoneNumberVerification(
      request.user.phoneNumber,
    );
  }

  @ApiBody({
    type: CheckVerificationCodeDto,
  })
  @Post('check-verification-code')
  @UseGuards(JwtAuthenticationGuard)
  async checkVerificationCode(
    @Req() request: RequestWithUser,
    @Body() verificationData: CheckVerificationCodeDto,
  ) {
    if (request.user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number already confirmed');
    }
    await this.smsService.confirmPhoneNumber(
      request.user.id,
      request.user.phoneNumber,
      verificationData.code,
    );
  }
}
