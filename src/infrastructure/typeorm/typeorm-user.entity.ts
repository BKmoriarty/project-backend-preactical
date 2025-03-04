import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class TypeOrmUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
