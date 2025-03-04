import { Order } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { IOrderRepository } from '../../interfaces/order.repository.interface';
import { IProductRepository } from '../../interfaces/product.repository.interface';

export class CreateOrderUseCase {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
  ) {}

  async execute(
    userId: number,
    items: { productId: number; quantity: number }[],
  ): Promise<Order> {
    // ตรวจสอบและคำนวณราคารวม
    let total = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      const price = product.price * item.quantity;
      total += price;
      orderItems.push(
        new OrderItem(0, item.productId, item.quantity, product.price),
      );
    }

    const order = new Order(userId, total, orderItems);
    return this.orderRepository.create(order);
  }
}
