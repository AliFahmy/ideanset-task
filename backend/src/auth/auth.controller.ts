import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { signupSchema } from './validation/signup.validation';
import { signinSchema } from './validation/sigin.validation';
import { ZodValidationPipe } from 'pipes/zod.validation.pipe';
import { SignupDTO } from './dto/signup.dto';
import { SigninDTO } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RefreshTokenDTO } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthContorller {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('signup')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(signupSchema))
  signup(@Body() userData: SignupDTO) {
    try {
      return this.authService.signup(userData);
    } catch (error) {
      throw error;
    }
  }
  @Public()
  @Post('signin')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(signinSchema))
  async signin(@Body() userData: SigninDTO) {
    try {
      return await this.authService.signin(userData);
    } catch (error) {
      throw error;
    }
  }
  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(200)
  @Post('refresh-token')
  async refreshToken(@Request() req, @Body() refreshTokenDto: RefreshTokenDTO) {
    try {
      const { user } = req;
      return this.authService.refreshTokens({
        sub: user._id,
        email: user.email,
      });
    } catch (error) {
      throw error;
    }
  }
  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(200)
  @Post('revoke-refresh-token')
  async revokeRefreshToken(@Body() refreshTokenDto: RefreshTokenDTO) {
    try {
      const { refreshToken } = refreshTokenDto;
      if (!refreshToken)
        throw new BadRequestException('No refresh token provided');
      this.authService.revokeRefreshToken(refreshTokenDto.refreshToken);
      return {
        message: 'Refresh token revoked.',
      };
    } catch (error) {
      throw error;
    }
  }
}
