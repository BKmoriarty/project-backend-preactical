import { OrderItem } from './order-item.entity';

export class Order {
  id: number;
  userId: number;
  total: number;
  createdAt: Date;
  items: OrderItem[];

  constructor(userId: number, total: number, items: OrderItem[]) {
    this.userId = userId;
    this.total = total;
    this.items = items;
    this.createdAt = new Date();
  }
}
