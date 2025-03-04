import { RefreshToken } from '../entities/refresh-token.entity';

export interface IRefreshTokenRepository {
  create(token: RefreshToken): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | undefined>;
  deleteByToken(token: string): Promise<void>;
}
