import { Product } from '../entities/product.entity';

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product>;
  findByName(name: string): Promise<Product | undefined>;
  update(id: number, product: Partial<Product>): Promise<Product>;
  delete(id: number): Promise<void>;
}
