import { User } from '../entities/user.entity';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByUsername(username: string): Promise<User | undefined>;
}
