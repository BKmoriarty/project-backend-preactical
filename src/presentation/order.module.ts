import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from '../application/services/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmOrder } from '../infrastructure/typeorm/typeorm-order.entity';
import { TypeOrmOrderItem } from '../infrastructure/typeorm/typeorm-order-item.entity';
import { OrderRepository } from '../infrastructure/database/order.repository';
import { OrderItemRepository } from '../infrastructure/database/order-item.repository';
import { CreateOrderUseCase } from '../domain/use-cases/order/create-order.use-case';
import { GetOrdersUseCase } from '../domain/use-cases/order/get-orders.use-case';
import { ProductRepository } from '../infrastructure/database/product.repository';
import { TypeOrmProduct } from '../infrastructure/typeorm/typeorm-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [TypeOrmOrder, TypeOrmOrderItem, TypeOrmProduct],
      'default',
    ),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    OrderItemRepository,
    ProductRepository,
    {
      provide: CreateOrderUseCase,
      useFactory: (
        orderRepo: OrderRepository,
        productRepo: ProductRepository,
      ) => new CreateOrderUseCase(orderRepo, productRepo),
      inject: [OrderRepository, ProductRepository],
    },
    {
      provide: GetOrdersUseCase,
      useFactory: (repo: OrderRepository) => new GetOrdersUseCase(repo),
      inject: [OrderRepository],
    },
  ],
})
export class OrderModule {}
