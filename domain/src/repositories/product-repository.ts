import { Product } from "../entities/Products";

export interface ProductRepository {
  save(product: Product): void;
  findById(id: string): Product | undefined;
  findAll(): Product[];
  delete(id: string): boolean;
}