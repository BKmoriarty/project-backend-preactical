import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { OrderService } from '../../application/services/order.service';
import { CreateOrderDto } from '../../application/dtos/order.dto';
import { JwtAuthGuard } from '../../infrastructure/jwt/jwt.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return this.orderService.findAll();
  }
}
