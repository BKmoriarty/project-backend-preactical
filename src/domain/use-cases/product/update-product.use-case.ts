import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../interfaces/product.repository.interface';

export class UpdateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: number, data: Partial<Product>): Promise<Product> {
    return this.productRepository.update(id, data);
  }
}
