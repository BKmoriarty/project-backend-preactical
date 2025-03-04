import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from '../application/services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmProduct } from '../infrastructure/typeorm/typeorm-product.entity';
import { ProductRepository } from '../infrastructure/database/product.repository';
import { CreateProductUseCase } from '../domain/use-cases/product/create-product.use-case';
import {
  GetByIdProductUseCase,
  GetProductsUseCase,
} from '../domain/use-cases/product/get-products.use-case';
import { UpdateProductUseCase } from '../domain/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '../domain/use-cases/product/delete-product.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOrmProduct], 'default')],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductRepository,
    {
      provide: CreateProductUseCase,
      useFactory: (repo: ProductRepository) => new CreateProductUseCase(repo),
      inject: [ProductRepository],
    },
    {
      provide: GetProductsUseCase,
      useFactory: (repo: ProductRepository) => new GetProductsUseCase(repo),
      inject: [ProductRepository],
    },
    {
      provide: GetByIdProductUseCase,
      useFactory: (repo: ProductRepository) => new GetByIdProductUseCase(repo),
      inject: [ProductRepository],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (repo: ProductRepository) => new UpdateProductUseCase(repo),
      inject: [ProductRepository],
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (repo: ProductRepository) => new DeleteProductUseCase(repo),
      inject: [ProductRepository],
    },
  ],
})
export class ProductModule {}
