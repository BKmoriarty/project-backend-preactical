import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';
import * as bcrypt from 'bcrypt';

export class RegisterUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    name: string,
    username: string,
    password: string,
  ): Promise<User> {
    // Check if the username is already in use
    const userByUsername = await this.userRepository.findByUsername(username);
    if (userByUsername) {
      throw new Error('Username already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User(name, username, hashedPassword);

    return this.userRepository.create(user);
  }
}
