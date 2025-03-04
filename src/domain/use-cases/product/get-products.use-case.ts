import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../interfaces/product.repository.interface';

export class GetProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}

export class GetByIdProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: number): Promise<Product> {
    return this.productRepository.findById(id);
  }
}
