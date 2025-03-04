import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';
import * as bcrypt from 'bcrypt';

export class LoginUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error('Unauthorized');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('Unauthorized');
    }

    return user;
  }
}
