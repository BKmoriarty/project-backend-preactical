import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TypeOrmOrder } from './typeorm-order.entity';
import { TypeOrmProduct } from './typeorm-product.entity';

@Entity('order_items')
export class TypeOrmOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column('decimal')
  price: number;

  @ManyToOne(() => TypeOrmOrder, (order) => order.items)
  @JoinColumn({ name: 'orderId' })
  order: TypeOrmOrder;

  @ManyToOne(() => TypeOrmProduct)
  @JoinColumn({ name: 'productId' })
  product: TypeOrmProduct;
}
