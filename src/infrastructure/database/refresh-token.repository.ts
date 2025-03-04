import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { IRefreshTokenRepository } from '../../domain/interfaces/refresh-token.repository.interface';
import { TypeOrmRefreshToken } from '../typeorm/typeorm-refresh-token.entity';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(TypeOrmRefreshToken, 'default')
    private refreshTokenRepository: Repository<TypeOrmRefreshToken>,
  ) {}

  async create(token: RefreshToken): Promise<RefreshToken> {
    const newToken = this.refreshTokenRepository.create(token);
    return this.refreshTokenRepository.save(newToken);
  }

  async findByToken(token: string): Promise<RefreshToken | undefined> {
    return this.refreshTokenRepository.findOne({ where: { token } });
  }

  async deleteByToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }
}
