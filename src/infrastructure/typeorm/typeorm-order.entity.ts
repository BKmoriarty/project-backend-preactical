import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TypeOrmUser } from './typeorm-user.entity';
import { TypeOrmOrderItem } from './typeorm-order-item.entity';

@Entity('orders')
export class TypeOrmOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column('decimal')
  total: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => TypeOrmUser)
  @JoinColumn({ name: 'userId' })
  user: TypeOrmUser;

  @OneToMany(() => TypeOrmOrderItem, (orderItem) => orderItem.order, {
    cascade: true,
  })
  items: TypeOrmOrderItem[];
}
