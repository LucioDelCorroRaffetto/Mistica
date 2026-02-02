import { Product } from "../entities/Products";
import { ProductRepository } from "../repositories/product-repository";

export function mockProductRepository(): ProductRepository {
  const products: Product[] = [];

  return {
    async save(product: Product): Promise<Product> {
      const existingIndex = products.findIndex((p) => p.id === product.id);
      if (existingIndex !== -1) {
        products[existingIndex] = product;
      } else {
        products.push(product);
      }
      return product;
    },
    async findById(id: string): Promise<Product | undefined> {
      return products.find((product) => product.id === id);
    },
    async findAll(): Promise<Product[]> {
      return products;
    },
    async delete(id: string): Promise<boolean> {
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        return true;
      }
      return false;
    },
  };
}