export class OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;

  constructor(
    orderId: number,
    productId: number,
    quantity: number,
    price: number,
  ) {
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
    this.price = price;
  }
}
