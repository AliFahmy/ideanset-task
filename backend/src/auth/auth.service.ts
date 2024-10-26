import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDTO } from './dto/signup.dto';
import { UsersService } from 'src/users/users.service';
import { SigninDTO } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret, refreshSecret, saltRounds } from './constants/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
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

      await this.usersService.create(userData);

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

      return {
        message: 'User signedin successfully',
        ...this.generateTokens(payload),
      };
    } catch (error) {
      throw error;
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

  private generateTokens(payload: any) {
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtSecret,
      expiresIn: '60s',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
}
