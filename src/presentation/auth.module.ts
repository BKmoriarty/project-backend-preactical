import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from '../application/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../infrastructure/jwt/jwt.strategy';
import { UserRepository } from '../infrastructure/database/user.repository';
import { RegisterUseCase } from '../domain/use-cases/register.use-case';
import { LoginUseCase } from '../domain/use-cases/login.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUser } from '../infrastructure/typeorm/typeorm-user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshTokenRepository } from 'src/infrastructure/database/refresh-token.repository';
import { TypeOrmRefreshToken } from 'src/infrastructure/typeorm/typeorm-refresh-token.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([TypeOrmUser, TypeOrmRefreshToken], 'default'),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UserRepository,
    RefreshTokenRepository,
    {
      provide: RegisterUseCase,
      useFactory: (repo: UserRepository) => new RegisterUseCase(repo),
      inject: [UserRepository],
    },
    {
      provide: LoginUseCase,
      useFactory: (repo: UserRepository) => new LoginUseCase(repo),
      inject: [UserRepository],
    },
  ],
})
export class AuthModule {}
