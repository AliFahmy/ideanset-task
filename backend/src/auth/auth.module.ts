import { Module } from '@nestjs/common';
import { AuthContorller } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from './constants/constants';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStartegy } from './strategies/refreshToken.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthContorller],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStartegy],
})
export class AuthModule {}
