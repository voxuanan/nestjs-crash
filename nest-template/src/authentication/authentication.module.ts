import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { AuthenticationResolver } from './authentication.resolver';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { TwoFactorAuthenticationController } from './twoFactorAuthentication.controller';
import { LocalSerializer } from './serializers/local.serializer';
import { EmailModule } from 'src/email/email.module';
import { FirebaseAuthenticationController } from './firebaseAuthentication.controller';
import { FirebaseAuthenticationService } from './firebaseAuthentication.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    EmailModule,
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    AuthenticationResolver,
    TwoFactorAuthenticationService,
    LocalSerializer,
    FirebaseAuthenticationService,
  ],
  controllers: [
    AuthenticationController,
    TwoFactorAuthenticationController,
    FirebaseAuthenticationController,
  ],
  exports: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    AuthenticationResolver,
    TwoFactorAuthenticationService,
    LocalSerializer,
    FirebaseAuthenticationService,
  ],
})
export class AuthenticationModule {}
