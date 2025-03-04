import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { CreateProductUseCase } from '../../domain/use-cases/product/create-product.use-case';
import {
  GetByIdProductUseCase,
  GetProductsUseCase,
} from '../../domain/use-cases/product/get-products.use-case';
import { UpdateProductUseCase } from '../../domain/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '../../domain/use-cases/product/delete-product.use-case';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class ProductService {
  private readonly CACHE_KEY = 'products:all';

  constructor(
    private createProductUseCase: CreateProductUseCase,
    private getProductsUseCase: GetProductsUseCase,
    private getByIdProductUseCase: GetByIdProductUseCase,
    private updateProductUseCase: UpdateProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.createProductUseCase.execute(
        createProductDto.name,
        createProductDto.price,
        createProductDto.description,
      );
      // ล้าง cache เมื่อเพิ่มสินค้า
      await this.redis.del(this.CACHE_KEY);
      return product;
    } catch (error) {
      Logger.debug(error);
      if (error.message === 'Product already exists') {
        throw new NotFoundException('Product already exists');
      }
      throw error;
    }
  }

  async findAll() {
    // ตรวจสอบ cache ก่อน
    const cachedProducts = await this.redis.get(this.CACHE_KEY);
    if (cachedProducts) {
      return JSON.parse(cachedProducts); // แปลงจาก string กลับเป็น object
    }

    // ถ้าไม่มีใน cache ดึงจาก database
    const products = await this.getProductsUseCase.execute();

    // เก็บลง cache (ตั้ง TTL เป็น 1 ชั่วโมง)
    await this.redis.set(this.CACHE_KEY, JSON.stringify(products), 'EX', 3600);
    return products;
  }

  async findOne(id: number) {
    try {
      const product = await this.getByIdProductUseCase.execute(id);
      return product;
    } catch (error) {
      Logger.debug(error);
      if (error.message === 'Product not found') {
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.updateProductUseCase.execute(
        id,
        updateProductDto,
      );
      // ล้าง cache เมื่อแก้ไขสินค้า
      await this.redis.del(this.CACHE_KEY);
      return product;
    } catch (error) {
      Logger.debug(error);
      if (error.message === 'Product not found') {
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      await this.deleteProductUseCase.execute(id);
      // ล้าง cache เมื่อลบสินค้า
      await this.redis.del(this.CACHE_KEY);
      return { message: 'Product deleted successfully' };
    } catch (error) {
      Logger.debug(error);
      if (error.message === 'Product not found') {
        throw new NotFoundException('Product not found');
      }
      throw error;
    }
  }

  async exportToCsv(): Promise<StreamableFile> {
    try {
      const products = await this.findAll();

      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'id', title: 'ID' },
          { id: 'name', title: 'Name' },
          { id: 'price', title: 'Price' },
          { id: 'description', title: 'Description' },
          { id: 'createdAt', title: 'Created At' },
          { id: 'updatedAt', title: 'Updated At' },
        ],
      });

      const csvData =
        csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(products);
      const buffer = Buffer.from(csvData, 'utf-8');

      const date = new Date().toISOString().split('T')[0];

      return new StreamableFile(buffer, {
        type: 'text/csv',
        disposition: `attachment; filename="products-${date}.csv"`,
      });
    } catch (error) {
      Logger.debug(error);
      throw new BadRequestException('Failed to export products');
    }
  }
}
