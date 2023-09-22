import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthenticationService } from '../authentication/authentication.service';
import * as admin from 'firebase-admin';
import * as serviceAccount from '../../service-account.json';
import User from 'src/users/entity/user.entity';

@Injectable()
export class FirebaseAuthenticationService {
  firebaseClient: admin.app.App;
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {
    this.firebaseClient = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  async getUserData(token: string) {
    let tokenInfo: admin.auth.DecodedIdToken;
    try {
      tokenInfo = await this.firebaseClient.auth().verifyIdToken(token, true);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }

    return tokenInfo;
  }

  async authenticate(token: string) {
    const tokenInfo: admin.auth.DecodedIdToken = await this.getUserData(token);

    const email = tokenInfo.email;
    if (!email) throw new Error('this decode token has no email');
    try {
      const user = await this.usersService.getByEmail(email);
      return this.handleRegisteredUser(user);
    } catch (error) {
      if (error.status !== 404) {
        throw new error();
      }
      return this.registerUser(tokenInfo, email);
    }
  }

  async registerUser(tokenInfo: admin.auth.DecodedIdToken, email: string) {
    const user = await this.usersService.createWithGoogle(
      tokenInfo.uid,
      email,
      tokenInfo.name,
      tokenInfo.phone_number,
    );

    return this.handleRegisteredUser(user);
  }

  async getCookiesForUser(user: User) {
    const accessTokenCookie =
      this.authenticationService.getCookieWithJwtAccessToken(user.id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      accessTokenCookie,
      refreshTokenCookie,
    };
  }

  async handleRegisteredUser(user: User) {
    if (!user.isRegisterWithFirebase) {
      throw new UnauthorizedException();
    }

    const { accessTokenCookie, refreshTokenCookie } =
      await this.getCookiesForUser(user);

    return {
      accessTokenCookie,
      refreshTokenCookie,
      user,
    };
  }
}
