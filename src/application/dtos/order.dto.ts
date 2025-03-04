import { IsArray, IsNumber, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
