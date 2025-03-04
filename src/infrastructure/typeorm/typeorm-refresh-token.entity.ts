import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TypeOrmUser } from './typeorm-user.entity';

@Entity('refresh_tokens')
export class TypeOrmRefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  userId: number;

  @Column()
  expiresAt: Date;

  @ManyToOne(() => TypeOrmUser, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: TypeOrmUser;
}
