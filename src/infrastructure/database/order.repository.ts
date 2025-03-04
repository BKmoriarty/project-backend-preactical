import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../../domain/entities/order.entity';
import { IOrderRepository } from '../../domain/interfaces/order.repository.interface';
import { TypeOrmOrder } from '../typeorm/typeorm-order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectRepository(TypeOrmOrder, 'default')
    private orderRepository: Repository<TypeOrmOrder>,
    @InjectDataSource('default') private dataSource: DataSource,
  ) {}

  async create(order: Order): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newOrder = this.orderRepository.create({
        userId: order.userId,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const savedOrder = await queryRunner.manager.save(newOrder);
      await queryRunner.commitTransaction();
      return {
        ...savedOrder,
        items: savedOrder.items as OrderItem[],
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderRepository.find({ relations: ['items'] });
    return orders.map((order) => ({
      ...order,
      items: order.items as OrderItem[],
    }));
  }
}
