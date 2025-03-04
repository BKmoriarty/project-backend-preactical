import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { IOrderItemRepository } from '../../domain/interfaces/order-item.repository.interface';
import { TypeOrmOrderItem } from '../typeorm/typeorm-order-item.entity';

@Injectable()
export class OrderItemRepository implements IOrderItemRepository {
  constructor(
    @InjectRepository(TypeOrmOrderItem, 'default')
    private orderItemRepository: Repository<TypeOrmOrderItem>,
  ) {}

  async create(orderItem: OrderItem): Promise<OrderItem> {
    const newOrderItem = this.orderItemRepository.create(orderItem);
    return this.orderItemRepository.save(newOrderItem);
  }
}
