import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from './authentication.service';
import LogInDto from './dto/logIn.dto';
import RegisterDto from './dto/register.dto';
import JwtAuthenticationGuard from './guard/jwt-authentication.guard';
import JwtRefreshGuard from './guard/jwt-refresh.guard';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import { GetUser } from 'src/common/decorator/getUser.decorator';
import User from 'src/users/entity/user.entity';
import { Request } from 'express';
import * as passport from 'passport';
import { LogInWithCredentialsGuard } from './guard/logInWithCredentialsGuard';
import { CookieAuthenticationGuard } from './guard/cookieAuthentication.guard';
import RequestWithUser from './interface/requestWithUser.interface';
// import { UserTransformInterceptor } from 'src/users/transforms/user.transform';

@ApiTags('Authentication')
@UseInterceptors(ClassSerializerInterceptor)
// @UseInterceptors(new UserTransformInterceptor())
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBody({
    type: RegisterDto,
  })
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @ApiBody({ type: LogInDto })
  @Post('log-in')
  async logIn(@Req() request: Request, @GetUser() user: User) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    if (user.isTwoFactorAuthenticationEnabled) {
      return;
    }

    return user;
  }

  // @HttpCode(200)
  // @UseGuards(LogInWithCredentialsGuard)
  // @Post('log-in')
  // async logIn(@Req() request: RequestWithUser) {
  //   return request.user;
  // }

  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: Request, @GetUser() user: User) {
    if (user) {
      await this.usersService.removeRefreshToken(user.id);
    }
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookiesForLogOut(),
    );
  }

  // @HttpCode(200)
  // @UseGuards(CookieAuthenticationGuard)
  // @Post('log-out')
  // async logOut(@Req() request: Request) {
  //   request.logOut({}, () => {});
  //   request.session.cookie.maxAge = 0;
  // }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@GetUser() user: User) {
    return user;
  }

  // @HttpCode(200)
  // @UseGuards(CookieAuthenticationGuard)
  // @Get()
  // async authenticate(@GetUser() user: User) {
  //   return user;
  // }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: Request, @GetUser() user: User) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
