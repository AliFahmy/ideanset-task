import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDTO } from './dto/signup.dto';
import { UsersService } from '../users/users.service';
import { SigninDTO } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret, refreshSecret, saltRounds } from '../constants/constants';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async signup(userData: SignupDTO) {
    try {
      const existingUser = await this.usersService.getUserByEmail(
        userData.email,
      );
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      userData.password = await this.hashPassword(userData.password);

      await this.usersService.create({ ...userData, role: 'user' });

      return {
        message: 'User Created Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async signin(userData: SigninDTO) {
    try {
      const user = await this.usersService.getUserByEmail(userData.email);

      if (!user) {
        throw new UnauthorizedException('Incorrect email or password');
      }

      const comparePasswords = await bcrypt.compare(
        userData.password,
        user.password,
      );

      if (!comparePasswords) {
        throw new UnauthorizedException('Incorrect email or password');
      }
      const payload = {
        email: user.email,
        sub: user._id,
      };
      const tokens = await this.generateTokens(payload);
      return {
        message: 'User signedin successfully',
        ...tokens,
      };
    } catch (error) {
      throw error;
    }
  }

  async revokeRefreshToken(refreshToken: string) {
    try {
      await this.cacheManager.del(`refresh_token:${refreshToken}`);
    } catch (error) {
      throw new error();
    }
  }
  refreshTokens(payload: any) {
    return this.generateTokens(payload);
  }
  private async hashPassword(password: string) {
    try {
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      throw error;
    }
  }

  private async generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });
    await this.cacheManager.set(
      `refresh_token:${refreshToken}`,
      payload.sub,
      60 * 60 * 24 * 30,
    );
    return { accessToken, refreshToken };
  }
}
