import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../application/services/auth.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // ใช้ JWT_SECRET สำหรับ Access Token
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token = this.extractToken(req);
    if (await this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been blacklisted');
    }
    return { userId: payload.sub, username: payload.username };
  }

  private extractToken(req: Request): string {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.replace('Bearer ', '');
    }
    throw new UnauthorizedException('No token provided');
  }
}
