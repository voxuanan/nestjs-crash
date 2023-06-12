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
import { UserTransformInterceptor } from 'src/users/transforms/user.transform';

@ApiTags('authentication')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(new UserTransformInterceptor())
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
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: Request, @GetUser() user: User) {
    await this.usersService.removeRefreshToken(user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookiesForLogOut(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: Request, @GetUser() user: User) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
