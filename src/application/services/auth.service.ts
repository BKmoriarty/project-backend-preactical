import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUseCase } from '../../domain/use-cases/register.use-case';
import { LoginUseCase } from '../../domain/use-cases/login.use-case';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from 'src/infrastructure/database/refresh-token.repository';
import { RefreshToken } from 'src/domain/entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
    private configService: ConfigService,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async register(name: string, username: string, password: string) {
    try {
      const user = await this.registerUseCase.execute(name, username, password);
      return { id: user.id, username: user.username };
    } catch (error) {
      if (error.message === 'Username already in use') {
        throw new UnauthorizedException('Username already in use');
      }
      throw new UnauthorizedException('Registration failed');
    }
  }

  async login(username: string, password: string) {
    try {
      const user = await this.loginUseCase.execute(username, password);
      const payload = { username: user.username, sub: user.id };

      const accessToken = this.jwtService.sign(payload); // ใช้ JWT_SECRET จาก module config
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
      });

      // คำนวณ expiresAt จาก refresh token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const expiresAt = new Date(decoded.exp * 1000); // แปลง timestamp วินาทีเป็น milliseconds
      await this.refreshTokenRepository.create(
        new RefreshToken(refreshToken, user.id, expiresAt),
      );

      return { access_token: accessToken, refresh_token: refreshToken };
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException('Login failed');
    }
  }

  async logout(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      await this.redis.set(`blacklist:${token}`, 'true', 'EX', expiresIn);
      await this.refreshTokenRepository.deleteByToken(token); // ลบ refresh token ถ้ามี
      return { message: 'Logged out successfully' };
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async refresh(refreshToken: string) {
    try {
      // ตรวจสอบ refresh token
      const storedToken =
        await this.refreshTokenRepository.findByToken(refreshToken);
      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (storedToken.expiresAt < new Date()) {
        await this.refreshTokenRepository.deleteByToken(refreshToken);
        throw new UnauthorizedException('Refresh token has expired');
      }

      // Verify refresh token ด้วย JWT_REFRESH_SECRET
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const payload = { username: decoded.username, sub: decoded.sub };

      // สร้าง access token ใหม่
      const newAccessToken = this.jwtService.sign(payload);

      return { access_token: newAccessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.redis.get(`blacklist:${token}`);
    return result === 'true';
  }
}
