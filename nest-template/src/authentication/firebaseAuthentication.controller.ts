import {
  Controller,
  Post,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
  Req,
} from '@nestjs/common';
import { FirebaseAuthenticationService } from './firebaseAuthentication.service';
import { Request } from 'express';
import TokenVerificationDto from './dto/tokenVerificationDto';

@Controller('firebase-authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class FirebaseAuthenticationController {
  constructor(
    private readonly firebaseAuthenticationService: FirebaseAuthenticationService,
  ) {}

  @Post()
  async authenticate(
    @Body() tokenData: TokenVerificationDto,
    @Req() request: Request,
  ) {
    const { accessTokenCookie, refreshTokenCookie, user } =
      await this.firebaseAuthenticationService.authenticate(tokenData.token);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    return user;
  }
}
