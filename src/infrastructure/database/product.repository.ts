import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../domain/interfaces/product.repository.interface';
import { TypeOrmProduct } from '../typeorm/typeorm-product.entity';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(TypeOrmProduct, 'default')
    private productRepository: Repository<TypeOrmProduct>,
  ) {}

  async create(product: Product): Promise<Product> {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ order: { id: 'ASC' } }); // เรียงลำดับตาม id จากน้อยไปมาก
  }

  async findById(id: number): Promise<Product> {
    const result = await this.productRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return result;
  }

  async findByName(name: string): Promise<Product | undefined> {
    return this.productRepository.findOne({ where: { name } });
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    try {
      const existingProduct = await this.findById(id);
      if (!existingProduct) {
        throw new NotFoundException('Product not found');
      }
      await this.productRepository.update(id, product);
      return this.findById(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error.code === 'ER_DUP_ENTRY') {
        // MySQL duplicate entry error code
        throw new BadRequestException('Product already exists');
      }
      throw new Error('Failed to update product');
    }
  }

  async delete(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}
