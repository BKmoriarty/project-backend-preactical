import { IProductRepository } from '../../interfaces/product.repository.interface';

export class DeleteProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(id: number): Promise<void> {
    return this.productRepository.delete(id);
  }
}
