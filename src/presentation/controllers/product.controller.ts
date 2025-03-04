import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  StreamableFile,
} from '@nestjs/common';
import { ProductService } from '../../application/services/product.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../../application/dtos/product.dto';
import { JwtAuthGuard } from '../../infrastructure/jwt/jwt.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get('export')
  async exportToCsv(): Promise<StreamableFile> {
    return this.productService.exportToCsv();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.productService.delete(id);
    return { message: 'Product deleted successfully' };
  }
}
