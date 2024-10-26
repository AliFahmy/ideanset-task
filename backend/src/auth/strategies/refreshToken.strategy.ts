import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { refreshSecret } from '../constants/constants';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RefreshTokenStartegy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: (req: Request) => req.body.refreshToken,
      secretOrKey: refreshSecret,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: any) {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
