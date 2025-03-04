import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { RegisterDto } from '../../application/dtos/register.dto';
import { LoginDto } from '../../application/dtos/login.dto';
import { JwtAuthGuard } from '../../infrastructure/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.name,
      registerDto.username,
      registerDto.password,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token format');
    }
    const token = authHeader.replace('Bearer ', '');
    return this.authService.logout(token);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refresh(refreshToken);
  }
}
