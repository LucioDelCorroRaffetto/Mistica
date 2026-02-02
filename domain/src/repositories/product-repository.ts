import { Product } from "../entities/Products";

export interface ProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | undefined>;
  findAll(): Promise<Product[]>;
  delete(id: string): Promise<boolean>;
}