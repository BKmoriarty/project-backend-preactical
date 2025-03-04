import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/interfaces/user.repository.interface';
import { TypeOrmUser } from '../typeorm/typeorm-user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(TypeOrmUser, 'default')
    private userRepository: Repository<TypeOrmUser>,
  ) {}

  async create(user: User): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }
}
