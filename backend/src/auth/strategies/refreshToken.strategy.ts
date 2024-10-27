import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { refreshSecret } from '../../constants/constants';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RefreshTokenStartegy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.body.refreshToken,
      secretOrKey: refreshSecret,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      throw new BadRequestException('Please provide refresh token');
    }
    const refreshTokenUserId = await this.cacheManager.get(
      `refresh_token:${refreshToken}`,
    );

    if (!refreshTokenUserId) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    if (refreshTokenUserId !== payload.sub) {
      throw new UnauthorizedException('Token does not match user');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
