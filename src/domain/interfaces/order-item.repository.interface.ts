import { OrderItem } from '../entities/order-item.entity';

export interface IOrderItemRepository {
  create(orderItem: OrderItem): Promise<OrderItem>;
}
