import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import RequestWithUser from 'src/authentication/interface/requestWithUser.interface';
import User from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './inputs/authentication.input';
import { AuthenticationService } from './authentication.service';
import { LocalAuthenticationGuard } from './guard/localAuthentication.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class AuthenticationResolver {
  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => User)
  async login(
    @Args('input') loginInput: LoginInput,
    @Context() context: { req: RequestWithUser },
  ) {
    const user = await this.authenticationService.getAuthenticatedUser(
      loginInput.email,
      loginInput.password,
    );
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    context.req.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return user;
  }
}
