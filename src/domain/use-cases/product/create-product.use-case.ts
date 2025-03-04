import { Product } from '../../entities/product.entity';
import { IProductRepository } from '../../interfaces/product.repository.interface';

export class CreateProductUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(
    name: string,
    price: number,
    description?: string,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findByName(name);
    if (existingProduct) {
      throw new Error('Product already exists');
    }

    const product = new Product(name, price, description);
    return this.productRepository.create(product);
  }
}
