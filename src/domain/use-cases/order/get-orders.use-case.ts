import { Order } from '../../entities/order.entity';
import { IOrderRepository } from '../../interfaces/order.repository.interface';

export class GetOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }
}
