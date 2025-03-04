import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CreateOrderUseCase } from '../../domain/use-cases/order/create-order.use-case';
import { GetOrdersUseCase } from '../../domain/use-cases/order/get-orders.use-case';
import { CreateOrderDto } from '../dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private getOrdersUseCase: GetOrdersUseCase,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      return await this.createOrderUseCase.execute(
        createOrderDto.userId,
        createOrderDto.items,
      );
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new BadRequestException(error.message);
      }
      Logger.error(error);
      throw new BadRequestException('Failed to create order');
    }
  }

  async findAll() {
    return this.getOrdersUseCase.execute();
  }
}
